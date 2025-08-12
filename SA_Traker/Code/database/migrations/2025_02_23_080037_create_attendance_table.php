<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttendanceTable extends Migration
{
    public function up()
    {
        Schema::create('attendance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('site_id')->nullable()->constrained('sites')->onDelete('set null');
            $table->date('attendance_date');
            $table->enum('status', ['0.5', '1', '1.5', '2', 'A'])->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'attendance_date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('attendance');
    }
}