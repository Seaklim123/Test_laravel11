<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Telegram extends Model
{
    use HasFactory;
    protected $table      = 'telegrams';
    protected $primarykey = 'id';
    protected $fillable = [
        'app_key',
        'chatBotID',
        'user_id',
        'url_redirect'
    ];
}
