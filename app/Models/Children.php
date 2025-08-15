<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class Children extends Model
{
    use HasFactory;

    protected $table = 'children'; // Evita que Eloquent busque 'childrens'

    protected $fillable = [
        'user_id',
        'name',
        'lastname',
        'dni',
        'school',
        'grado',
        'condition',
    ];

    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->name . ' ' . $this->lastname);
    }
}
