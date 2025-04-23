<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonationStatus extends Model
{
    protected $primaryKey = 'status_id';
    protected $fillable = ['status_name'];

    public function donations()
    {
        return $this->hasMany(Donation::class, 'status_id');
    }
}