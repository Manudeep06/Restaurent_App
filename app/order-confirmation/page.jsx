"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, Package } from 'lucide-react';

export default function OrderConfirmationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="text-slate-600 mb-8">
          Thank you for your order. We've received it and our chefs are already preparing your delicious meal!
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl mb-8">
          <p className="text-sm text-slate-700 mb-2">Estimated Delivery Time</p>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            30-45 minutes
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          
          <button
            onClick={() => router.push('/menu')}
            className="w-full bg-slate-100 text-slate-700 py-3 rounded-full font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            Order More
          </button>
        </div>
      </motion.div>
    </div>
  );
}
