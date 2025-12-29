"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChefHat, Clock, Star, ArrowRight, UtensilsCrossed, Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              TasteBite
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <button
              onClick={() => router.push('/menu')}
              className="px-4 py-2 text-slate-700 hover:text-purple-600 font-medium transition-colors"
            >
              Browse Menu
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              Admin Login
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Now Taking Orders Online</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Delicious Food
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Delivered Fast
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Experience culinary excellence with our chef-crafted dishes. 
                Order now and taste the difference quality makes.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => router.push('/menu')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
                >
                  Order Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push('/menu')}
                  className="px-8 py-4 bg-white text-slate-700 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors shadow-lg border-2 border-slate-200"
                >
                  View Menu
                </button>
              </div>
              
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    500+
                  </div>
                  <div className="text-sm text-slate-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    4.9★
                  </div>
                  <div className="text-sm text-slate-600">Average Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    30min
                  </div>
                  <div className="text-sm text-slate-600">Delivery Time</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop&crop=center&q=80"
                  alt="Delicious Food"
                  className="rounded-3xl shadow-2xl w-full"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl -z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose TasteBite?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We bring you the best dining experience with quality ingredients and exceptional service
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ChefHat className="w-12 h-12" />,
                title: "Expert Chefs",
                description: "Our experienced chefs craft every dish with passion and precision"
              },
              {
                icon: <Clock className="w-12 h-12" />,
                title: "Fast Delivery",
                description: "Get your favorite meals delivered hot and fresh in 30 minutes"
              },
              {
                icon: <Star className="w-12 h-12" />,
                title: "Quality Ingredients",
                description: "We use only the freshest, highest-quality ingredients"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-br from-slate-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <UtensilsCrossed className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Order?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Explore our delicious menu and get your favorite meals delivered to your doorstep
            </p>
            <button
              onClick={() => router.push('/menu')}
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl inline-flex items-center gap-2"
            >
              Browse Menu
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">TasteBite</span>
          </div>
          <p className="text-slate-400">
            © 2025 TasteBite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
