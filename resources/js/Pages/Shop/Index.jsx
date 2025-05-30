import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

const ProductCard = ({ product, onOrder }) => (
  <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col items-center text-center border border-gray-100">
    <div className="w-full h-48 overflow-hidden rounded-xl mb-4">
      <img
        src={`/storage/${product.photo}`}
        alt={product.title}
        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
      />
    </div>
    <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>
    <p className="text-sm text-gray-500 mb-2">
      By <span className="font-medium text-gray-700">{product.user?.name|| 'Unknown'}</span>
    </p>
    <div className="flex flex-wrap justify-center gap-1 mb-3">
      {product.tags?.map((tag, index) => (
        <span
          key={index}
          className={`px-2 py-1 text-xs rounded-full ${tag === 'spicy'
            ? 'bg-red-100 text-red-700'
            : tag === 'gluten'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700'
            }`}
        >
          {tag === 'spicy' ? '🌶️ Spicy' : tag === 'gluten' ? '🍞 Gluten' : tag}
        </span>
      ))}
    </div>
    <p className="text-lg font-bold text-orange-600 mb-4">${Number(product.price).toFixed(2)}</p>
    <button
      onClick={() => onOrder(product)}
      className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-medium transition-colors duration-200 w-full"
    >
      Order now
    </button>
  </div>
);

const CartSidebar = ({ cart, onCheckout, onRemoveItem }) => {
  const items = Object.values(cart);
  const total = items.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4 border border-gray-200 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🛒 Your Order</h2>

      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">
                    {item.qty} × {item.title}
                  </span>
                  <span className="text-gray-400 text-xs">${Number(item.price).toFixed(2)} each</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-semibold">
                    ${(Number(item.price) * item.qty).toFixed(2)}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 text-sm text-gray-600">
            <div className="flex justify-between mb-1">
              <span>Delivery</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Tip</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-3 mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            className="mt-5 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow transition duration-200"
          >
            🧾 Go to Checkout
          </button>
        </>
      )}
    </div>
  );
};


const CheckoutModal = ({ open, onClose, onSubmit, loading }) => {
  const { auth } = usePage().props;
  const [name, setName] = useState(auth?.user?.name || '');
  const [address, setAddress] = useState('');

  const handleSubmit = () => {
    if (name && address) {
      onSubmit(name, address);
    } else {
      alert('Please fill in all fields.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center px-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Checkout</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 123 Main Street"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

const InvoiceModal = ({ open, order, onClose }) => {
  if (!open || !order) return null;
  const total = order.items.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center px-4 print:block">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg print:w-full print:shadow-none print:rounded-none">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Invoice</h2>
        <p className="mb-1"><strong>Name:</strong> {order.customer_name}</p>
        <p className="mb-3"><strong>Address:</strong> {order.delivery_address}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Item</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{item.title}</td>
                  <td className="border px-2 py-1">{item.qty}</td>
                  <td className="border px-2 py-1">${Number(item.price).toFixed(2)}</td>
                  <td className="border px-2 py-1">
                    ${(Number(item.price) * item.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="border px-2 py-1 font-bold text-right">Total</td>
                <td className="border px-2 py-1 font-bold">${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4 gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Print Invoice
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderHistoryModal = ({ open, orders, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start pt-10 px-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            🧾 Order History
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✖
          </button>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No orders found.</p>
        ) : (
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
            {orders.map((order, index) => {
              const total = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );

              return (
                <div
                  key={index}
                  className="border rounded-xl p-4 shadow hover:shadow-md transition bg-gray-50"
                >
                  {/* Order header */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      Order #{order.id}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Items */}
                  <ul className="space-y-2 text-sm text-gray-700 mb-3">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex justify-between items-center">
                        <span>
                          <span className="font-medium">{item.quantity}×</span>{' '}
                          <span className="inline-block bg-white border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-800">
                            {item.product?.title ?? 'Unknown'}
                          </span>
                        </span>
                        <span className="text-right font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Total */}
                  <div className="flex justify-between text-sm font-semibold text-gray-800 border-t pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end mt-4 sticky bottom-0 bg-white pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


export default function ProductList() {
  const { products } = usePage().props;
  console.log(products, 'products');
  
  const [category, setCategory] = useState(products[0]?.category || 'All');
  const [cart, setCart] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyOrders, setHistoryOrders] = useState([]);

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get('/orders/history');
      
      setHistoryOrders(response.data);
      setHistoryOpen(true);
    } catch (error) {
      console.error(error);
      alert('Failed to load order history.');
    }
  };
  const addToCart = (product) => {
    setCart((prev) => {
      const item = prev[product.id] || { ...product, qty: 0 };
      item.qty += 1;
      return { ...prev, [product.id]: item };
    });
  };
  const handleRemoveItem = (itemId) => {
  setCart(prev => {
    const newCart = { ...prev };
    delete newCart[itemId];
    return newCart;
  });
};
  const handleCheckout = () => {
    setModalOpen(true);
  };

  const submitOrder = async (customer_name, delivery_address) => {
    const cartItems = Object.values(cart);
    setLoading(true);
    try {
      await axios.post('/orders', {
        customer_name,
        delivery_address,
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.qty,
          price: item.price,
          title: item.title,
        })),
      });

      setOrderData({
        customer_name,
        delivery_address,
        items: cartItems,
      });

      setCart({});
      setModalOpen(false);
      setInvoiceOpen(true);
    } catch (error) {
      console.error(error);
      alert('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-3 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">🍽️ Menu</h1>
          <button
            onClick={fetchOrderHistory}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-full border border-gray-300 transition"
          >
            📜 View Order History
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products
            .filter((p) => category === 'All' || p.category === category)
            .map((product) => (
              <ProductCard key={product.id} product={product} onOrder={addToCart} />
            ))}
        </div>
      </div>

      <div className="md:col-span-1">
        <CartSidebar cart={cart} onRemoveItem={handleRemoveItem} onCheckout={handleCheckout} />
      </div>
      <CheckoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={submitOrder}
        loading={loading}
      />
      <InvoiceModal
        open={invoiceOpen}
        order={orderData}
        onClose={() => setInvoiceOpen(false)}
      />

      <OrderHistoryModal
        open={historyOpen}
        orders={historyOrders}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
