"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/UIComponents';
import toast, { Toaster } from 'react-hot-toast';

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push('/admin');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));
        setOrders(ordersData);
        
        // Calculate stats
        const newStats = {
          pending: ordersData.filter(o => o.status === 'pending').length,
          preparing: ordersData.filter(o => o.status === 'preparing').length,
          completed: ordersData.filter(o => o.status === 'completed').length,
          cancelled: ordersData.filter(o => o.status === 'cancelled').length
        };
        setStats(newStats);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      toast.success(`Order ${newStatus}!`);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'preparing':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'preparing':
        return <Package className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
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
            onClick={() => router.push('/admin')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Orders Management
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pending', count: stats.pending, color: 'from-yellow-400 to-orange-500', icon: <Clock className="w-6 h-6" /> },
            { label: 'Preparing', count: stats.preparing, color: 'from-blue-400 to-purple-500', icon: <Package className="w-6 h-6" /> },
            { label: 'Completed', count: stats.completed, color: 'from-green-400 to-emerald-500', icon: <CheckCircle2 className="w-6 h-6" /> },
            { label: 'Cancelled', count: stats.cancelled, color: 'from-red-400 to-pink-500', icon: <XCircle className="w-6 h-6" /> }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl shadow-lg text-white`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium opacity-90">{stat.label}</span>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold">{stat.count}</div>
            </motion.div>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No orders yet</p>
            </div>
          ) : (
            orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-slate-900">Order #{order.id.slice(-6)}</h3>
                      <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      {order.timestamp?.toLocaleString() || 'Just now'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                      ₹{order.total?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                {order.items && (
                  <div className="mb-4 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded-lg">
                        <span className="text-slate-700">{item.name} x {item.quantity}</span>
                        <span className="font-semibold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Customer Info */}
                {order.customerInfo && (
                  <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm font-semibold text-slate-900 mb-1">{order.customerInfo.name}</p>
                    <p className="text-sm text-slate-600">{order.customerInfo.phone}</p>
                    <p className="text-sm text-slate-600">{order.customerInfo.address}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                      >
                        Mark Complete
                      </button>
                    )}
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
