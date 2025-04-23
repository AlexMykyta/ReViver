<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $primaryKey = 'campaign_id';
    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'goal',
        'status'
    ];
}