<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSitesTable extends Migration
{
    public function up()
    {
        Schema::create('sites', function (Blueprint $table) {
            $table->id();
            $table->date('site_date');
            $table->string('site_name');
            $table->string('site_location');
            $table->string('owner_name');
            $table->string('contractor_name');
            $table->decimal('site_area', 10, 2); // sq ft
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sites');
    }
}