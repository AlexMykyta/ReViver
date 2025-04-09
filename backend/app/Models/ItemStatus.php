<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemStatus extends Model
{
    protected $primaryKey = 'status_id';
    protected $fillable = ['status_name'];

    public function items()
    {
        return $this->hasMany(Item::class, 'status_id');
    }
}