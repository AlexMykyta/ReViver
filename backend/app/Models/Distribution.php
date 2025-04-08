<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Distribution extends Model
{
    protected $primaryKey = 'distribution_id';
    protected $fillable = [
        'item_id',
        'user_id',
        'date',
        'quantity_distributed',
        'status_id'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function beneficiary()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function status()
    {
        return $this->belongsTo(DistributionStatus::class, 'status_id');
    }
}