<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class UserAvailability extends Model
{
    use HasFactory;
    protected $table = 'user_availability';
    protected $primaryKey = 'id';
    protected $fillable = ['user_availability'];
}