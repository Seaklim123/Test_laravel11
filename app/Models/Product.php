<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;
    protected $table      = 'products';
    protected $primarykey = 'id';
    protected $fillable = ['title', 'price', 'photo', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
