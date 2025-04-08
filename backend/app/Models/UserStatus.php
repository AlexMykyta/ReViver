<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStatus extends Model
{
    protected $primaryKey = 'status_id';
    protected $fillable = ['status_name'];

    public function users()
    {
        return $this->hasMany(User::class, 'status_id');
    }
}