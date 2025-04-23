<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $primaryKey = 'warehouse_id';
    protected $fillable = [
        'location',
        'capacity',
        'current_quantity'
    ];

    public function items()
    {
        return $this->hasMany(Item::class, 'warehouse_id');
    }
}