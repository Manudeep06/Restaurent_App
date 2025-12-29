"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, DollarSign, ShoppingBag, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalCustomers: 0
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
      const ordersQuery = query(collection(db, 'orders'));
      const itemsQuery = query(collection(db, 'items'));

      const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));
        setOrders(ordersData);
        calculateAnalytics(ordersData);
      });

      const unsubItems = onSnapshot(itemsQuery, (snapshot) => {
        const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemsData);
        setLoading(false);
      });

      return () => {
        unsubOrders();
        unsubItems();
      };
    }
  }, [user]);

  const calculateAnalytics = (ordersData) => {
    const completedOrders = ordersData.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = completedOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const uniqueCustomers = new Set(completedOrders.map(o => o.customerInfo?.phone)).size;

    setAnalytics({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalCustomers: uniqueCustomers
    });
  };

  const getRevenueByDay = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toDateString(),
        revenue: 0
      };
    });

    orders.forEach(order => {
      if (order.status === 'completed' && order.timestamp) {
        const orderDate = order.timestamp.toDateString();
        const dayData = last7Days.find(d => d.date === orderDate);
        if (dayData) {
          dayData.revenue += order.total || 0;
        }
      }
    });

    return last7Days.map(({ name, revenue }) => ({ name, revenue: Math.round(revenue) }));
  };

  const getOrdersByStatus = () => {
    const statusCount = {
      pending: 0,
      preparing: 0,
      completed: 0,
      cancelled: 0
    };

    orders.forEach(order => {
      if (statusCount.hasOwnProperty(order.status)) {
        statusCount[order.status]++;
      }
    });

    return [
      { name: 'Pending', value: statusCount.pending, color: '#F59E0B' },
      { name: 'Preparing', value: statusCount.preparing, color: '#8B5CF6' },
      { name: 'Completed', value: statusCount.completed, color: '#10B981' },
      { name: 'Cancelled', value: statusCount.cancelled, color: '#EF4444' }
    ];
  };

  const getTopSellingItems = () => {
    const itemSales = {};

    orders.forEach(order => {
      if (order.status === 'completed' && order.items) {
        order.items.forEach(item => {
          if (!itemSales[item.name]) {
            itemSales[item.name] = 0;
          }
          itemSales[item.name] += item.quantity;
        });
      }
    });

    return Object.entries(itemSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
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
            Analytics Dashboard
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: `₹${analytics.totalRevenue.toFixed(2)}`, icon: <DollarSign className="w-6 h-6" />, color: 'from-green-400 to-emerald-500' },
            { label: 'Total Orders', value: analytics.totalOrders, icon: <ShoppingBag className="w-6 h-6" />, color: 'from-blue-400 to-purple-500' },
            { label: 'Avg Order Value', value: `₹${analytics.averageOrderValue.toFixed(2)}`, icon: <TrendingUp className="w-6 h-6" />, color: 'from-orange-400 to-pink-500' },
            { label: 'Total Customers', value: analytics.totalCustomers, icon: <Users className="w-6 h-6" />, color: 'from-purple-400 to-indigo-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl shadow-lg text-white`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium opacity-90">{stat.label}</span>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Revenue (Last 7 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getRevenueByDay()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="url(#colorGradient)" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 5 }} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Orders by Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">Orders by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getOrdersByStatus()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getOrdersByStatus().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Selling Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">Top Selling Items</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getTopSellingItems()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value) => [value, 'Sold']}
                />
                <Bar dataKey="quantity" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
