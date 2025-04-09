<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VolunteerActivity extends Model
{
    protected $primaryKey = 'activity_id';
    protected $fillable = [
        'user_id',
        'activity_type',
        'date'
    ];

    public function volunteer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}