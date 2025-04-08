<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DistributionStatus extends Model
{
    protected $primaryKey = 'status_id';
    protected $fillable = ['status_name'];

    public function distributions()
    {
        return $this->hasMany(Distribution::class, 'status_id');
    }
}