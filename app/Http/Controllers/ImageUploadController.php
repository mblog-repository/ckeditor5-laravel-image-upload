<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ImageUploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'upload' => 'required|image|mimes:jpeg,png,gif,webp|max:2048', // 2 МБ
            ]);
        } catch (ValidationException $e) {
            // Ckeditor покажет это сообщение пользователю
            return response()->json([
                'error' => ['message' => $e->validator->errors()->first('upload')],
            ]);
        }

        $path = $request->file('upload')->store('uploads', 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
        ]);
    }
}
