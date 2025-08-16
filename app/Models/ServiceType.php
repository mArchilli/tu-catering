<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ServiceType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price_cents',
    ];

    protected $casts = [
        'id' => 'integer',
        'price_cents' => 'integer',
    ];
}
