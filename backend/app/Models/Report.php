<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\UserAvailability;


class Report extends Model
{
    use HasFactory;
    protected $table = 'report';

    protected $fillable = [
        'user_id',
        'name',
        'availability',
        'motivation',
        'status',
        'aproved_by'
    ];
    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'aproved_by');
    }

    public function userAvailability()
    {
        return $this->belongsTo(UserAvailability::class, 'availability');
    }
}