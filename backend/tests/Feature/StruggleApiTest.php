<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\Struggle;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StruggleApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user);
    }

    public function test_result_requires_authentication(): void
    {
        Auth::forgetGuards();

        $response = $this->postJson('/api/quizzes/result', [
            'answers' => [['question_id' => 1, 'selected_index' => 0]],
        ]);

        $response->assertUnauthorized();
    }

    public function test_wrong_answer_creates_or_upserts_struggle(): void
    {
        $question = Question::with('options')->where('difficulty', 'easy')->first();
        $wrong = $question->options->firstWhere('is_correct', false)->position;

        foreach ([$wrong, $wrong] as $attempt) {
            $this->json('POST', '/api/quizzes/result', [
                'answers' => [['question_id' => $question->id, 'selected_index' => $attempt]],
            ])->assertOk();
        }

        $this->assertDatabaseHas('struggles', [
            'user_id' => $this->user->id,
            'question_id' => $question->id,
            'selected_index' => $wrong,
        ]);
        $this->assertSame(1, Struggle::where('user_id', $this->user->id)->count());
    }

    public function test_correct_answer_removes_struggle(): void
    {
        $question = Question::with('options')->where('difficulty', 'easy')->first();
        $correct = $question->options->firstWhere('is_correct', true)->position;

        Struggle::create([
            'user_id' => $this->user->id,
            'question_id' => $question->id,
            'selected_index' => 0,
        ]);

        $response = $this->json('POST', '/api/quizzes/result', [
            'answers' => [['question_id' => $question->id, 'selected_index' => $correct]],
        ]);

        $response->assertOk();
        $this->assertDatabaseMissing('struggles', [
            'user_id' => $this->user->id,
            'question_id' => $question->id,
        ]);
    }

    public function test_struggles_returns_flagged_questions(): void
    {
        $question = Question::with('options', 'category')->where('difficulty', 'easy')->first();
        $wrong = $question->options->firstWhere('is_correct', false)->position;

        Struggle::create([
            'user_id' => $this->user->id,
            'question_id' => $question->id,
            'selected_index' => $wrong,
        ]);

        $response = $this->getJson('/api/quizzes/struggles');

        $response->assertOk()->assertJsonCount(1);
        $response->assertJsonFragment([
            'question_id' => $question->id,
            'category' => $question->category->name,
            'question' => $question->question,
            'selectedIndex' => $wrong,
        ]);
    }

    public function test_mastered_requires_authentication(): void
    {
        Auth::forgetGuards();

        $response = $this->deleteJson('/api/quizzes/struggles/1');

        $response->assertUnauthorized();
    }

    public function test_mastered_removes_only_the_users_struggle(): void
    {
        $question = Question::with('options')->where('difficulty', 'easy')->first();
        $other = User::factory()->create();

        Struggle::create([
            'user_id' => $this->user->id,
            'question_id' => $question->id,
            'selected_index' => 0,
        ]);
        Struggle::create([
            'user_id' => $other->id,
            'question_id' => $question->id,
            'selected_index' => 1,
        ]);

        $response = $this->deleteJson("/api/quizzes/struggles/{$question->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('struggles', [
            'user_id' => $this->user->id,
            'question_id' => $question->id,
        ]);
        $this->assertDatabaseHas('struggles', [
            'user_id' => $other->id,
            'question_id' => $question->id,
        ]);
    }
}
