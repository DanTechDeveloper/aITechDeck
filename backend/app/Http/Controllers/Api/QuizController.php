<?php

namespace App\Http\Controllers\Api;

use App\Enums\Difficulty;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Question;
use App\Models\Struggle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function categories(): JsonResponse
    {
        return response()->json(
            Category::orderBy('name')->get(['id', 'name'])
        );
    }

    public function quizzes(Request $request, string $difficulty): JsonResponse
    {
        if (! in_array($difficulty, array_column(Difficulty::cases(), 'value'))) {
            return response()->json(['message' => 'Invalid difficulty.'], 422);
        }

        $category = Category::where('name', $request->query('category'))->first();

        if (! $category) {
            return response()->json(['message' => 'Category not found.'], 404);
        }

        $questions = Question::with('options')
            ->where('category_id', $category->id)
            ->where('difficulty', $difficulty)
            ->orderBy('position')
            ->get()
            ->shuffle()
            ->map(fn (Question $q) => [
                'id' => $q->id,
                'question' => $q->question,
                'options' => $q->options->pluck('option'),
                'answerIndex' => $q->options->firstWhere('is_correct', true)?->position,
            ]);

        return response()->json($questions);
    }

    public function result(Request $request): JsonResponse
    {
        $request->validate([
            'answers' => ['required', 'array', 'min:1'],
            'answers.*.question_id' => ['required', 'integer', 'exists:questions,id'],
            'answers.*.selected_index' => ['required', 'integer', 'min:0'],
        ]);

        $user = $request->user();

        foreach ($request->input('answers') as $answer) {
            $question = Question::with('options')->find($answer['question_id']);
            $correct = $question->options->firstWhere('is_correct', true)->position;

            if ($answer['selected_index'] === $correct) {
                Struggle::where('user_id', $user->id)
                    ->where('question_id', $question->id)
                    ->delete();
            } else {
                Struggle::updateOrCreate(
                    ['user_id' => $user->id, 'question_id' => $question->id],
                    ['selected_index' => $answer['selected_index']],
                );
            }
        }

        return response()->json(['message' => 'Saved']);
    }

    public function struggles(Request $request): JsonResponse
    {
        $rows = Struggle::with(['question.options', 'question.category'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($rows->map(fn (Struggle $s) => [
            'question_id' => $s->question_id,
            'category' => $s->question->category->name,
            'difficulty' => $s->question->difficulty->value,
            'question' => $s->question->question,
            'options' => $s->question->options->pluck('option'),
            'answerIndex' => $s->question->options->firstWhere('is_correct', true)->position,
            'selectedIndex' => $s->selected_index,
            'updated_at' => $s->updated_at->toISOString(),
        ]));
    }

    public function mastered(Request $request, int $question): JsonResponse
    {
        Struggle::where('user_id', $request->user()->id)
            ->where('question_id', $question)
            ->delete();

        return response()->json(['message' => 'Mastered']);
    }
}
