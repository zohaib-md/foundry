<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string',
            'currentText' => 'nullable|string',
            'componentType' => 'required|string',
        ]);

        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json(['error' => 'Gemini API key not configured on server.'], 500);
        }

        $userPrompt = $request->input('prompt');
        $currentText = $request->input('currentText', '');
        $componentType = $request->input('componentType');

        $systemInstruction = "You are an expert copywriter for a web page builder. The user needs text for a '$componentType' component. Return ONLY the final text without quotes, markdown formatting, or explanations.";
        
        $fullPrompt = "Current Text: " . ($currentText ?: 'None') . "\n\nUser Request: " . $userPrompt;

        $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $systemInstruction . "\n\n" . $fullPrompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.7,
                'maxOutputTokens' => 200,
            ]
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Failed to connect to Gemini API', 'details' => $response->json()], 502);
        }

        $data = $response->json();
        
        if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            $generatedText = trim($data['candidates'][0]['content']['parts'][0]['text']);
            return response()->json(['data' => $generatedText]);
        }

        return response()->json(['error' => 'Invalid response from AI'], 500);
    }
}
