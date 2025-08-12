<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->enum('action', ['send', 'receive']);
            $table->string('sender_type')->nullable(); 
            $table->string('sender_name')->nullable(); 
            $table->string('recipient_type')->nullable(); 
            $table->string('recipient_name')->nullable(); 
            $table->enum('payment_type', ['earned', 'advance', 'repayment'])->default('earned'); 
            $table->text('details');
            $table->enum('method', ['cash', 'online']);
            $table->date('transaction_date');
            $table->decimal('amount', 10, 2);
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); 
            $table->boolean('is_out_of_pocket')->default(false); 
            $table->boolean('is_repaid')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
}