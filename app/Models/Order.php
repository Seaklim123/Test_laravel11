<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;
    protected $table      = 'orders';
    protected $primarykey = 'id';

    protected $fillable = ['customer_name', 'delivery_address', 'total', 'user_id'];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
