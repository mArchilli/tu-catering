<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DailyOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'child_id',
        'service_type_id',
        'date',
        'status',
    ];

    protected $casts = [
        'id' => 'integer',
        'child_id' => 'integer',
        'service_type_id' => 'integer',
        'date' => 'date',
    ];

    public function child()
    {
        return $this->belongsTo(Children::class, 'child_id');
    }

    public function serviceType()
    {
        return $this->belongsTo(ServiceType::class);
    }
}
