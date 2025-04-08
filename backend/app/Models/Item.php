<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $primaryKey = 'item_id';
    protected $fillable = [
        'donation_id',
        'item_type',
        'description',
        'quantity',
        'category_id',
        'warehouse_id',
        'status_id'
    ];

    public function donation()
    {
        return $this->belongsTo(Donation::class, 'donation_id');
    }

    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_id');
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }

    public function status()
    {
        return $this->belongsTo(ItemStatus::class, 'status_id');
    }

    public function distributions()
    {
        return $this->hasMany(Distribution::class, 'item_id');
    }

    public function transactions()
    {
        return $this->hasMany(TransactionHistory::class, 'item_id');
    }
}