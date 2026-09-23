<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class QuizApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        Sanctum::actingAs(User::factory()->create());
    }

    public function test_categories_require_authentication(): void
    {
        Auth::forgetGuards();

        $response = $this->getJson('/api/quizzes/categories');

        $response->assertUnauthorized();
    }

    public function test_categories_returns_all_categories(): void
    {
        $response = $this->getJson('/api/quizzes/categories');

        $response->assertOk()
            ->assertJsonCount(4)
            ->assertJsonFragment(['name' => 'Cybersecurity']);
    }

    public function test_quiz_returns_questions_with_four_options_for_a_difficulty(): void
    {
        $response = $this->getJson('/api/quizzes/easy?category=Cybersecurity');

        $response->assertOk()
            ->assertJsonCount(3);

        $response->assertJsonStructure([
            '*' => ['question', 'options', 'answerIndex'],
        ]);

        foreach ($response->json() as $item) {
            $this->assertCount(4, $item['options']);
            $this->assertContains($item['answerIndex'], [0, 1, 2, 3]);
        }
    }

    public function test_quiz_sets_question_difficulty(): void
    {
        $response = $this->getJson('/api/quizzes/hard?category=Web Development');

        $response->assertOk()
            ->assertJsonCount(3);

        $questions = array_column($response->json(), 'question');

        $this->assertContains('Which HTTP method is idempotent and updates a full resource?', $questions);
    }

    public function test_quiz_returns_404_for_unknown_category(): void
    {
        $response = $this->getJson('/api/quizzes/easy?category=Astrology');

        $response->assertNotFound();
    }

    public function test_quiz_returns_422_for_invalid_difficulty(): void
    {
        $response = $this->getJson('/api/quizzes/expert?category=Cybersecurity');

        $response->assertUnprocessable();
    }
}
