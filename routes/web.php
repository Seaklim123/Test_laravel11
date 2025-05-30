<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\OrderController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\TelegramController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('homepage');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard')->middleware(['check:dashboard-list']);

Route::middleware('auth')->group(function () {

    Route::get('/verify-key', [TelegramController::class, 'showVerifyForm'])->name('telegram.verify-form');
    Route::post('/telegram/webhook', [TelegramController::class, 'handleWebhook']);
    Route::get('/telegram/verify', [TelegramController::class, 'showVerifyForm'])->name('telegram.verify.form');
    Route::post('/telegram/verify', [TelegramController::class, 'verify'])->name('telegram.verify');

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [ShopController::class, 'index'])->name('shop.index');
    Route::post('/checkout', [ShopController::class, 'checkout'])->name('shop.checkout');
        Route::get('/orders/history', function () {
        return \App\Models\Order::with('items.product')->where('user_id', auth()->id())->latest()->get();
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index')->middleware(['check:category-list']);
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create')->middleware(['check:category-create']);
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::patch('/categories/{id}', [CategoryController::class, 'update'])->name('categories.update');
    Route::get('/categories/{id}', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::prefix('product')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('product.index')->middleware(['check:product-list']);
        Route::get('/create', [ProductController::class, 'create'])->name('product.create')->middleware(['check:product-create']);
        Route::get('/{id}', [ProductController::class, 'edit'])->name('product.edit')->middleware(['check:product-edit']);
        Route::post("/", [ProductController::class, 'store'])->name('product.store');
        Route::patch("/{id}", [ProductController::class, 'update'])->name('product.update');
        Route::delete("/{id}", [ProductController::class, 'destroy'])->name('product.destroy')->middleware(['check:product-delete']);
    });

    Route::prefix('roles')->group(function () {
        Route::get('/', [RolesController::class, 'index'])->name('roles.index')->middleware(['check:role-list']);
        Route::get('/create', [RolesController::class, 'create'])->name('roles.create')->middleware(['check:role-create']);
        Route::get('/{id}', [RolesController::class, 'edit'])->name('roles.edit')->middleware(['check:role-edit']);
        Route::post("/", [RolesController::class, 'store'])->name('roles.store');
        Route::patch("/{id}", [RolesController::class, 'update'])->name('roles.update');
        Route::delete("/{id}", [RolesController::class, 'destroy'])->name('roles.destroy')->middleware(['check:role-delete']);
    });
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('users.index')->middleware(['check:user-list']);
        Route::get('/create', [UserController::class, 'create'])->name('users.create')->middleware(['check:user-create']);
        Route::get('/{id}', [UserController::class, 'edit'])->name('users.edit')->middleware(['check:user-edit']);
        Route::post("/", [UserController::class, 'store'])->name('users.store');
        Route::patch("/{id}", [UserController::class, 'update'])->name('users.update');
        Route::delete("/{id}", [UserController::class, 'destroy'])->name('users.destroy')->middleware(['check:user-delete']);
    });
});

require __DIR__.'/auth.php';
