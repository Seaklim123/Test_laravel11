export function ProductCard({ product, onOrder }) {
  return (
    <div className="bg-white p-4 rounded shadow-md text-center">
      <img src={product.photo} alt={product.title} className="w-full h-40 object-cover rounded mb-3" />
      <h3 className="font-semibold text-lg">{product.title}</h3>
      <div className="text-sm text-gray-500 mb-2">
        {product.tags?.map((tag) => (
          <span key={tag} className="inline-block mr-2">
            {tag === 'spicy' ? '🌶️' : tag === 'gluten' ? '🍞' : tag}
          </span>
        ))}
      </div>
      <p className="text-lg font-bold mb-3">${Number(product.price).toFixed(2)}</p>
      <button
        onClick={() => onOrder(product)}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full"
      >
        Order now
      </button>
    </div>
  );
}
