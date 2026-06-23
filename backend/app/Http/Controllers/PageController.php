<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Page::select('id', 'title', 'slug', 'status', 'created_at', 'updated_at')->get()
        ]);
    }

    public function show(Page $page)
    {
        return response()->json([
            'data' => $page
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'components' => 'required|array',
            'status' => 'nullable|in:draft,published',
        ]);

        $page = Page::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . uniqid(),
            'status' => $validated['status'] ?? 'draft',
            'components' => $validated['components'],
        ]);

        return response()->json(['data' => $page], 201);
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'components' => 'required|array',
            'status' => 'nullable|in:draft,published',
        ]);

        $page->update([
            'title' => $validated['title'],
            'status' => $validated['status'] ?? $page->status,
            'components' => $validated['components'],
        ]);

        return response()->json(['data' => $page]);
    }
}
