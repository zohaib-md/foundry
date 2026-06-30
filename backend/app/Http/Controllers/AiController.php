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

    public function generateUi(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string',
        ]);

        $apiKey = env('GROQ_API_KEY');

        if (!$apiKey) {
            return response()->json(['error' => 'GROQ_API_KEY not configured on server.'], 500);
        }

        $userPrompt = $request->input('prompt');

        $systemInstruction = <<<EOT
You are an expert UI generator for a visual page builder called Foundry.
The user will provide a prompt describing a section or layout.
You must return a valid JSON object with a single key "components" containing an array of Foundry component objects.
Return ONLY raw JSON. No markdown, no explanation, no extra text.

Component Schema:
type ComponentType = 'heading' | 'text' | 'button' | 'image' | 'container' | 'divider' | 'spacer' | 'section' | 'columns' | 'grid' | 'icon';

interface BuilderComponent {
  id: string; // generate a random string like "comp_xyz123"
  type: ComponentType;
  props: object;
  styles: object;
  children?: BuilderComponent[];
}

Props by type:
- heading: { text: string, level: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6', alignment: 'left'|'center'|'right', color: string }
- text: { text: string, alignment: 'left'|'center'|'right', color: string }
- button: { text: string, url: string, variant: 'primary'|'secondary'|'outline', alignment: 'left'|'center'|'right' }
- image: { url: string, altText: string, width: string, alignment: 'left'|'center'|'right' }
- section/container/columns/grid: { preset?: string }

Styles (camelCase keys):
{
  fontFamily?: string, fontSize?: string, fontWeight?: string, width?: string, minHeight?: string,
  color?: string, backgroundColor?: string, textAlign?: 'left'|'center'|'right',
  display?: 'flex'|'grid'|'block', flexDirection?: 'row'|'column',
  alignItems?: 'flex-start'|'center'|'flex-end'|'stretch',
  justifyContent?: 'flex-start'|'center'|'flex-end'|'space-between',
  gap?: string, padding?: string, paddingTop?: string, paddingBottom?: string, borderRadius?: string
}

Ensure you use proper nesting (e.g. a 'section' contains a 'container', which contains 'heading' and 'text'). Use appropriate padding (e.g. padding: '4rem 2rem') and gap (e.g. gap: '1.5rem').
EOT;

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->timeout(60)->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.3-70b-versatile',
            'messages' => [
                ['role' => 'system', 'content' => $systemInstruction],
                ['role' => 'user', 'content' => $userPrompt],
            ],
            'response_format' => ['type' => 'json_object'],
            'temperature' => 0.2,
            'max_tokens' => 4096,
        ]);

        if ($response->failed()) {
            $details = $response->json();
            $errorMsg = $details['error']['message'] ?? 'Failed to connect to Groq API';
            return response()->json(['error' => $errorMsg, 'details' => $details], $response->status());
        }

        $data = $response->json();

        if (isset($data['choices'][0]['message']['content'])) {
            $jsonString = trim($data['choices'][0]['message']['content']);

            // Strip markdown wrappers just in case
            if (str_starts_with($jsonString, '```json')) {
                $jsonString = preg_replace('/^```json\s*/', '', $jsonString);
                $jsonString = preg_replace('/\s*```$/', '', $jsonString);
            }

            $decoded = json_decode($jsonString, true);
            if (json_last_error() === JSON_ERROR_NONE && isset($decoded['components'])) {
                return response()->json(['data' => $decoded['components']]);
            }
            return response()->json(['error' => 'AI returned malformed JSON', 'raw' => $jsonString], 500);
        }

        return response()->json(['error' => 'Invalid response from Groq'], 500);
    }
}
