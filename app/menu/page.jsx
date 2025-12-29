"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, ChefHat, X, Plus, Minus, ArrowLeft } from 'lucide-react';
import { VegIcon, NonVegIcon } from '@/components/Icons';
import toast, { Toaster } from 'react-hot-toast';

export default function MenuPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  const { items: cartItems, addItem, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsData.filter(item => item.inStock));
      setFilteredItems(itemsData.filter(item => item.inStock));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = items;
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item =>
        selectedCategory === 'veg' ? item.isVeg : !item.isVeg
      );
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, items]);

  const handleAddToCart = (item) => {
    addItem(item);
    toast.success(`${item.name} added to cart!`, {
      icon: '🛒',
      style: {
        background: '#10B981',
        color: '#fff',
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-700 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Our Menu
            </span>
          </div>
          
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-slate-700" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-full focus:outline-none focus:border-purple-500 transition-colors shadow-sm"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'veg', label: '🌱 Vegetarian' },
              { id: 'non-veg', label: '🍗 Non-Veg' }
            ].map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={item.imageURL || 'https://placehold.co/600x400/f1f5f9/475569?text=No+Image'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  {item.isVeg ? <VegIcon /> : <NonVegIcon />}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-900 mb-2">{item.name}</h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{item.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    ₹{item.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:scale-105 transition-transform shadow-md flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-slate-500">No items found</p>
          </div>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4 bg-slate-50 p-4 rounded-xl">
                        <img
                          src={item.imageURL || 'https://placehold.co/100x100/f1f5f9/475569?text=No+Image'}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{item.name}</h3>
                          <p className="text-purple-600 font-bold mb-2">₹{item.price}</p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center transition-colors hover:scale-110"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            removeItem(item.id);
                            toast.success('Item removed');
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t border-slate-200 p-6 space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-slate-700">Total</span>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                      ₹{getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      router.push('/checkout');
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
