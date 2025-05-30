import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    // console.log(auth?.user.roles[0].name == 'Admin', 'auth');

    const handleImageError = () => {
        document.getElementById('background')?.classList.add('hidden');
    };

    const products = [
        {
            id: 1,
            name: "Margherita Pizza",
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            price: "$12.99",
        },
        {
            id: 2,
            name: "Classic Burger",
            image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500",
            price: "$10.50",
        },
        {
            id: 3,
            name: "Avocado Salad",
            image: "https://images.unsplash.com/photo-1641283339694-f7bc5b3673ca?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            price: "$8.25",
        },
        {
            id: 4,
            name: "Spaghetti Carbonara",
            image: "https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            price: "$13.99",
        },
        {
            id: 5,
            name: "Sushi Platter",
            image: "https://images.unsplash.com/photo-1676037150408-4b59a542fa7c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            price: "$18.75",
        },
        {
            id: 6,
            name: "Chocolate Cake",
            image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=2304&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            price: "$6.50",
        },
    ];

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-orange-50 text-black/80 dark:bg-black dark:text-white/80">
                <img
                    id="background"
                    className="absolute left-0 top-0 max-w-[877px] opacity-10"
                    src="https://laravel.com/assets/img/welcome/background.svg"
                    onError={handleImageError}
                />
                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-16">
                    {/* Header */}
                    <header className="w-full max-w-6xl flex justify-between items-center py-6">
                        <div className="text-2xl font-bold text-orange-600">Eaters Collective Restaurants</div>
                        <nav className="space-x-4">
                            {auth.user ? (
                                <>
                                    {auth.user.roles[0]?.name && auth.user.roles[0]?.name !== "User" ? (
                                        <Link href={route('dashboard')} className="text-gray-800 dark:text-white hover:underline">
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <Link href={route('shop.index')} className="text-gray-800 dark:text-white hover:underline">
                                            Order
                                        </Link>
                                    )}
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        type="button"
                                        className="text-gray-800 dark:text-white hover:underline"
                                    >
                                        Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-gray-800 dark:text-white hover:underline">
                                        Login
                                    </Link>
                                    <Link href={route('register')} className="text-gray-800 dark:text-white hover:underline">
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>


                    </header>

                    {/* Hero */}
                    <section className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Welcome to Eaters Collective Restaurants
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Enjoy our best-selling dishes! 🍽️
                        </p>
                    </section>

                    {/* Product Grid */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-xl transition"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded mb-4"
                                />
                                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                                <p className="text-orange-600 font-bold">{product.price}</p>
                            </div>
                        ))}
                    </section>

                    {/* Footer */}
                    <footer className="mt-16 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        Laravel v{laravelVersion} (PHP v{phpVersion})
                    </footer>
                </div>
            </div>
        </>
    );
}
