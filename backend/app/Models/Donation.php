<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $primaryKey = 'donation_id';
    protected $fillable = [
        'user_id',
        'date',
        'total_value',
        'status_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function status()
    {
        return $this->belongsTo(DonationStatus::class, 'status_id');
    }

    public function items()
    {
        return $this->hasMany(Item::class, 'donation_id');
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'donation_id');
    }
}