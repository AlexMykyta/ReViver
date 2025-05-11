<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ItemCategory;
use App\Models\User;



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

    public function requester()
    {
        return $this->belongsTo(\App\Models\User::class, 'requester', 'user_id');
    }
    
    public function category()
    {
        return $this->belongsTo(\App\Models\ItemCategory::class, 'category_id', 'category_id');
    }
}

