"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, MapPin, Phone, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cash'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cartItems,
        total: getTotalPrice(),
        customerInfo: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        },
        paymentMethod: formData.paymentMethod,
        status: 'pending',
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      toast.success('Order placed successfully!', {
        duration: 3000,
        icon: '🎉',
      });
      
      clearCart();
      
      setTimeout(() => {
        router.push('/order-confirmation');
      }, 1500);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
          <button
            onClick={() => router.push('/menu')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => router.push('/menu')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Checkout
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-6 shadow-lg space-y-6"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Delivery Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="+91 1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'cash', label: '💵 Cash on Delivery' },
                      { value: 'card', label: '💳 Card Payment' }
                    ].map(method => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                        className={`p-4 rounded-lg border-2 font-medium transition-all ${
                          formData.paymentMethod === method.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Place Order'
                )}
              </button>
            </motion.form>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg sticky top-24"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span>₹30.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (5%)</span>
                  <span>₹{(getTotalPrice() * 0.05).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-slate-900">Total</span>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  ₹{(getTotalPrice() + 30 + getTotalPrice() * 0.05).toFixed(2)}
                </span>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <p className="text-sm text-slate-700">
                  🚀 Estimated delivery time: <strong>30-45 minutes</strong>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
