<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $rsDatas = Product::where('user_id', auth()->id())
                ->latest()
                ->paginate(10)
                ->appends(request()->query());

        return Inertia::render('Product/Index', [
            'productData' => $rsDatas
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Product/CreateEdit', [
            'datas' => ''
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
        'title' => 'required|string',
        'price' => 'required|numeric',
        'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048', // Change here
        ]);
        $user = Auth::user();
        $validated['user_id'] = $user->id;
    
        // Store file
        $path = $request->file('photo')->store('products', 'public');
        $validated['photo'] = $path;
        Product::create($validated);
        return redirect()->route('product.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category, $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $data = Product::find($id);
        return Inertia::render('Product/CreateEdit', [
            'datas' => $data
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'price' => 'required|numeric',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $product = Product::findOrFail($id);

        // Handle new photo upload
        if ($request->hasFile('photo')) {
            // Delete old image if it exists
            if ($product->photo && Storage::disk('public')->exists($product->photo)) {
                Storage::disk('public')->delete($product->photo);
            }

            // Store new image
            $path = $request->file('photo')->store('products', 'public');
            $validated['photo'] = $path;
        }

        // Update user_id from authenticated user
        $validated['user_id'] = Auth::id();

        // ✅ Correct update
        $product->update($validated);

        return redirect()->route('product.index')->with('success', 'Product updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $product = Product::find($id);
        // Delete image from storage
        if ($product->photo && Storage::disk('public')->exists($product->photo)) {
            Storage::disk('public')->delete($product->photo);
        }

        // Delete the product
        $product->delete();

        return back()->with('message', 'Deleted successfully');
    }
}
