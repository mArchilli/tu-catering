<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MonthlyOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'child_id',
        'month',
        'year',
        'status',
        'total_cents',
    'decision_at',
    'notified',
    ];

    protected $casts = [
        'id' => 'integer',
        'child_id' => 'integer',
        'month' => 'integer',
        'year' => 'integer',
        'total_cents' => 'integer',
    'decision_at' => 'datetime',
    'notified' => 'boolean',
    ];

    public function child()
    {
        return $this->belongsTo(Children::class, 'child_id');
    }
}
