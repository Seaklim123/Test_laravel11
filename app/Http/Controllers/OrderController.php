<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use App\Models\Telegram;

class OrderController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'customer_name' => 'required|string',
        'delivery_address' => 'required|string',
        'items' => 'required|array',
        'items.*.id' => 'required|exists:products,id',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.price' => 'required|numeric',
    ]);

    $user = Auth::user();
    $orderTotal = collect($validated['items'])->sum(fn($item) => $item['price'] * $item['quantity']);

    $order = Order::create([
        'user_id' => $user->id,
        'customer_name' => $validated['customer_name'],
        'delivery_address' => $validated['delivery_address'],
        'total' => $orderTotal,
    ]);

    $sellerTotals = []; // user_id => subtotal

    foreach ($validated['items'] as $item) {
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item['id'],
            'quantity' => $item['quantity'],
            'price' => $item['price'],
        ]);

        $product = Product::find($item['id']);
        if ($product) {
            // Sum totals per seller
            $sellerTotals[$product->user_id] = ($sellerTotals[$product->user_id] ?? 0) + ($item['price'] * $item['quantity']);
        }
    }

    // Send webhook to each seller with their subtotal
    foreach ($sellerTotals as $userId => $subtotal) {
    $telegram = Telegram::where('user_id', $userId)->first();
    if ($telegram) {
        try {
            Http::post("https://api.telegram.org/bot" . env('TELEGRAM_TOKEN') . "/sendMessage", [
                'chat_id' => $telegram->chatBotID,
                'text' => "📦 New Order Received!\n"
                        . "Buyer: {$user->name}\n"
                        . "Order ID: {$order->id}\n"
                        . "Total: $" . number_format($subtotal, 2, '.', ''),
            ]);
        } catch (\Exception $e) {
            \Log::error("Telegram webhook failed for user {$userId}: " . $e->getMessage());
        }
    }
}

    return response()->json([
        'success' => true,
        'message' => 'Order placed successfully!',
        'order_id' => $order->id,
        'total' => $order->total,
    ]);
}

}
