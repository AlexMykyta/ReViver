<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'user_id';
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'status_id',
        'contact',
        'availability'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Relação com Role
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    // Relação com UserStatus
    public function status()
    {
        return $this->belongsTo(UserStatus::class, 'status_id');
    }

    // Relação com BeneficiaryRequests
    public function beneficiaryRequests()
    {
        return $this->hasMany(BeneficiaryRequest::class, 'user_id');
    }

    // Relação com Donations (como doador)
    public function donations()
    {
        return $this->hasMany(Donation::class, 'user_id');
    }

    // Relação com Distributions (como beneficiário)
    public function distributions()
    {
        return $this->hasMany(Distribution::class, 'user_id');
    }

    // Relação com VolunteerActivities
    public function volunteerActivities()
    {
        return $this->hasMany(VolunteerActivity::class, 'user_id');
    }

    // Relação com Feedback
    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'user_id');
    }

    // Relação com Notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    // Relação com Reports (como usuário reportado)
    public function report()
    {
        return $this->hasMany(Report::class, 'user_id');
    }

    // Relação com Reports (como aprovador)
    public function approvedReports()
    {
        return $this->hasMany(Report::class, 'aproved_by');
    }

    // Relação com TransactionHistory
    public function transactions()
    {
        return $this->hasMany(TransactionHistory::class, 'user_id');
    }
}