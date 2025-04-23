<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BeneficiaryRequest extends Model
{
    protected $primaryKey = 'request_id';
    protected $fillable = [
        'user_id',
        'item_type_needed',
        'quantity_needed',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}