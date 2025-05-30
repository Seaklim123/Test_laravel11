<?php
namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index()
    {
        $products = Product::with('user')->latest()->get();
        return Inertia::render('Shop/Index', [
            'products' => $products
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
        ]);

        // In real app: store order, integrate with payment gateway like Stripe, etc.
        return redirect()->back()->with('success', 'Your order has been placed!');
    }
}

