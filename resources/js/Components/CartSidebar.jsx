export function CartSidebar({ cart, onCheckout }) {
  const total = Object.values(cart).reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  return (
    <div className="bg-white p-4 rounded shadow-md sticky top-4">
      <h2 className="text-xl font-semibold mb-2">Your order</h2>
      {Object.values(cart).map((item, idx) => (
        <div key={idx} className="flex justify-between mb-1">
          <span>{item.qty} x {item.title}</span>
          <span>${(item.price * item.qty).toFixed(2)}</span>
        </div>
      ))}
      <div className="border-t my-2"></div>
      <p className="text-sm text-gray-500">Delivery: FREE</p>
      <p className="text-sm text-gray-500">Tip: $0.00</p>
      <div className="flex justify-between font-bold text-lg mt-2">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <button
        onClick={onCheckout}
        className="w-full mt-4 bg-orange-500 text-white py-2 rounded-full"
      >
        Go to checkout
      </button>
    </div>
  );
}
