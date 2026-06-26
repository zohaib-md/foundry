<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:10240', // max 10MB
        ]);

        $file = $request->file('image');
        // Store in storage/app/public/uploads
        $path = $file->store('uploads', 'public');

        // Return the public URL
        return response()->json([
            'url' => Storage::url($path),
        ]);
    }
}
