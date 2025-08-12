<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'action',
        'sender_type',      
        'sender_name',      
        'recipient_type',   
        'recipient_name',
        'payment_type',     
        'details',
        'method',
        'transaction_date',
        'amount',
        'user_id',
        'is_out_of_pocket', 
        'is_repaid',        
    ];

    protected $dates = ['transaction_date'];

    protected $casts = [
        'is_out_of_pocket' => 'boolean',
        'is_repaid' => 'boolean',
        'transaction_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}