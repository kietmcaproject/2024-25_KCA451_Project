<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    use HasFactory;

    protected $fillable = [
        'site_date',
        'site_name',
        'site_location',
        'owner_name',
        'contractor_name',
        'site_area',
    ];

    public function attendance()
    {
        return $this->hasMany(Attendance::class, 'site_id');
    }
}