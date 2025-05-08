<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    // Indica explicitamente o nome da tabela
    protected $table = 'notification';
    public $timestamps = false;
    protected $primaryKey = 'notification_id';

    protected $fillable = [
        'user_id',
        'message',
        'date',
        'idstatus',
        'title'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function status()
    {
        return $this->belongsTo(NotificationStatus::class, 'idstatus');
    }
}