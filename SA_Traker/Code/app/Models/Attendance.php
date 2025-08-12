<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance';

    protected $fillable = [
        'user_id',
        'site_id',
        'attendance_date',
        'status',
    ];

    protected $dates = ['attendance_date'];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with Site
    public function site()
    {
        return $this->belongsTo(Site::class,'site_id');
    }
}