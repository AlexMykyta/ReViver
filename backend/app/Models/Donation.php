<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model

{
    protected $table = 'donation'; // <- adiciona esta linha

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
    ];

    public function donor()
{
    return $this->belongsTo(\App\Models\User::class, 'created_by', 'user_id');
}
}
