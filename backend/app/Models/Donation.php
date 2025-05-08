<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $table = 'donation';

    use HasFactory;

    public $timestamps = false;

    protected $primaryKey = 'donation_id';

    protected $fillable = [
        'created_by',
        'date',
        'status_id',
        'category_id',
        'title',
        'description',
        'document',
        'contact',
        'requester', 
    ];

    public function donor()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by', 'user_id');
    }
}

