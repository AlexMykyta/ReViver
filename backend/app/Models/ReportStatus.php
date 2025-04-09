<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class ReportStatus extends Model
{
    use HasFactory;
    protected $table = 'report_status';
    protected $primaryKey = 'status_id';
    protected $fillable = ['status_name', 'description'];
}