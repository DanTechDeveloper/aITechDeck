<?php

namespace App\Http\Controllers\Api;

use App\Enums\Difficulty;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Question;
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
            ->map(fn (Question $q) => [
                'question' => $q->question,
                'options' => $q->options->pluck('option'),
                'answerIndex' => $q->options->firstWhere('is_correct', true)?->position,
            ]);

        return response()->json($questions);
    }
}
