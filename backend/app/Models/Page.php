<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = ['title', 'slug', 'status', 'components'];

    protected function casts(): array
    {
        return [
            'components' => 'array',
        ];
    }
}
