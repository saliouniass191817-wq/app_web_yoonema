<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function store(ReviewRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $payload['student_id'] = auth()->id();
        $payload['id'] = (string) \Illuminate\Support\Str::uuid();

        $review = Review::create($payload);

        return response()->json(['success' => true, 'data' => new ReviewResource($review), 'message' => 'Votre avis a été enregistré.']);
    }
}
