<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationStatus extends Model
{
    protected $primaryKey = 'status_id';
    protected $fillable = ['status_name'];

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'status_id');
    }
}