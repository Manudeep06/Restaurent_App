"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { 
  ChefHat, 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  LogOut, 
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { VegIcon, NonVegIcon, UploadIcon } from '@/components/Icons';
import { StockToggle, FloatingActionButton, LoadingSpinner } from '@/components/UIComponents';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'items'), orderBy('name'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemsData);
        setFilteredItems(itemsData);
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = items.filter(item =>
      item.name.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredItems(filteredData);
  }, [searchTerm, items]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      toast.error('Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!');
    } catch (err) {
      setError('Failed to register. Ensure password is 6+ characters.');
      toast.error('Registration failed');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Logged out successfully');
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;
    const storageRef = ref(storage, `menu_images/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
  };

  const handleAddItem = async (itemData, imageFile) => {
    try {
      let finalImageURL = itemData.imageURL;
      if (imageFile) {
        finalImageURL = await uploadImage(imageFile);
      }
      await addDoc(collection(db, 'items'), { ...itemData, imageURL: finalImageURL });
      toast.success('Item added successfully!');
    } catch (error) {
      console.error('Error adding document:', error);
      toast.error('Failed to add item');
      throw error;
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      try {
        await deleteDoc(doc(db, 'items', id));
        toast.success('Item deleted');
      } catch (error) {
        console.error('Error deleting document:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const handleUpdateItem = async (itemData, imageFile) => {
    if (!editingItem) return;
    try {
      let finalImageURL = itemData.imageURL;
      if (imageFile) {
        finalImageURL = await uploadImage(imageFile);
      }
      const itemDocRef = doc(db, 'items', editingItem.id);
      await updateDoc(itemDocRef, { ...itemData, imageURL: finalImageURL });
      toast.success('Item updated successfully!');
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update item');
      throw error;
    }
  };

  const handleStockToggle = async (item) => {
    const itemDocRef = doc(db, 'items', item.id);
    await updateDoc(itemDocRef, { inStock: !item.inStock });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage 
      authMode={authMode}
      setAuthMode={setAuthMode}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      handleEmailLogin={handleEmailLogin}
      handleRegister={handleRegister}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <Toaster position="top-center" />
      
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Admin Dashboard
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:border-purple-500 transition-colors w-64"
              />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-purple-600 font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 pb-24">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'menu', label: 'Menu Items', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'orders') router.push('/orders');
                else if (tab.id === 'analytics') router.push('/analytics');
                else setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id && tab.id === 'menu'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Search */}
        <div className="relative md:hidden mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-full focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MenuItemCard
                item={item}
                onEdit={() => setEditingItem(item)}
                onDelete={() => handleDeleteItem(item.id)}
                onStockToggle={() => handleStockToggle(item)}
              />
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No items found</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

      {/* Modals */}
      {isAddModalOpen && (
        <ItemModal
          mode="add"
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddItem}
        />
      )}
      {editingItem && (
        <ItemModal
          mode="edit"
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdateItem}
        />
      )}
    </div>
  );
}

// Login Page Component
const LoginPage = ({ authMode, setAuthMode, email, setEmail, password, setPassword, error, handleEmailLogin, handleRegister }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-blue-100 p-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')"
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md p-8 space-y-6 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl"
      >
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl inline-block mb-4">
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700 mb-2">
            Admin Portal
          </h1>
          <p className="text-slate-600">
            {authMode === 'login' ? 'Sign in to manage your restaurant' : 'Create your admin account'}
          </p>
        </div>
        
        <form onSubmit={authMode === 'login' ? handleEmailLogin : handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="admin@tastebite.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-600">
          {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="font-semibold text-purple-600 hover:text-purple-700 ml-2"
          >
            {authMode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

// Menu Item Card Component
const MenuItemCard = ({ item, onEdit, onDelete, onStockToggle }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1">
      <div className="overflow-hidden relative">
        <img
          src={item.imageURL || 'https://placehold.co/600x400/f1f5f9/475569?text=No+Image'}
          alt={item.name}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          {item.isVeg ? <VegIcon /> : <NonVegIcon />}
        </div>
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-white/90 backdrop-blur-md p-2 rounded-full text-slate-700 hover:bg-white transition shadow-lg"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl z-10 py-2 border border-slate-200">
                <button
                  onClick={() => {
                    onEdit();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-2">{item.description}</p>
        
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            ₹{item.price}
          </p>
          <StockToggle inStock={item.inStock} onToggle={onStockToggle} />
        </div>
      </div>
    </div>
  );
};

// Item Modal Component (continued in next message due to length)
const ItemModal = ({ mode, item, onClose, onSave }) => {
  const [name, setName] = useState(item?.name || '');
  const [price, setPrice] = useState(item?.price || '');
  const [description, setDescription] = useState(item?.description || '');
  const [isVeg, setIsVeg] = useState(item?.isVeg ?? true);
  const [inStock, setInStock] = useState(item?.inStock ?? true);
  
  const [imageFile, setImageFile] = useState(null);
  const [imageURLInput, setImageURLInput] = useState(item?.imageURL || '');
  const [imageInputMode, setImageInputMode] = useState('upload');
  const [imageGenPrompt, setImageGenPrompt] = useState(item?.name || '');

  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let imagePreview = null;
  if (imageInputMode === 'upload' || imageInputMode === 'generate') {
    if (imageFile) {
      imagePreview = URL.createObjectURL(imageFile);
    } else if (item?.imageURL && imageInputMode !== 'generate') {
      imagePreview = item.imageURL;
    }
  } else {
    imagePreview = imageURLInput;
  }

  const handleImageFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleGenerateDescription = async () => {
    if (!name) {
      toast.error('Please enter an item name first.');
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{
          parts: [{
            text: `Write a short, delicious, and enticing menu description for a dish called '${name}'. Keep it under 20 words.`
          }]
        }]
      };
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setDescription(text.trim());
        toast.success('Description generated!');
      } else {
        throw new Error('Failed to generate description.');
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't generate description");
    }
    setIsGeneratingDesc(false);
  };

  const handleGenerateImage = async () => {
    if (!imageGenPrompt) {
      toast.error('Please enter a description for the image.');
      return;
    }
    
    setIsGeneratingImage(true);
    setImageFile(null);
    setImageURLInput('');
    
    try {
      // Use Unsplash API for better food images
      const response = await fetch(`https://source.unsplash.com/600x400/?food,${encodeURIComponent(imageGenPrompt)}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const file = new File([blob], `${imageGenPrompt.replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
        setImageFile(file);
        toast.success('Image generated!');
      } else {
        throw new Error('Failed to generate image');
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't generate image. Try uploading one instead.");
    }
    setIsGeneratingImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let fileToUpload = null;
    let urlToSave = (imageInputMode === 'link') ? imageURLInput : (item?.imageURL || null);

    if (imageInputMode === 'upload' || imageInputMode === 'generate') {
      if (imageFile) {
        fileToUpload = imageFile;
        urlToSave = null;
      }
    }
    
    const itemData = {
      name,
      price: parseFloat(price),
      description,
      isVeg,
      inStock,
      imageURL: urlToSave
    };
    
    try {
      await onSave(itemData, fileToUpload);
      onClose();
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            {mode === 'add' ? 'Add New Item' : 'Edit Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Image Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Item Image</label>
              <div className="relative w-full h-56 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <UploadIcon />
                    <p className="mt-2 text-sm text-slate-500">Image Preview</p>
                  </div>
                )}
                {isGeneratingImage && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                    <LoadingSpinner />
                    <p className="mt-3 text-sm text-slate-600 font-semibold">Generating Image...</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                {['upload', 'link', 'generate'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setImageInputMode(mode)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      imageInputMode === mode
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {mode === 'upload' && '📤 Upload'}
                    {mode === 'link' && '🔗 Link'}
                    {mode === 'generate' && '✨ AI Generate'}
                  </button>
                ))}
              </div>
              
              {imageInputMode === 'upload' && (
                <label className="block w-full border-2 border-slate-300 border-dashed rounded-xl p-4 text-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <span className="text-sm text-slate-600">
                    {imageFile ? imageFile.name : '📁 Choose a file to upload'}
                  </span>
                </label>
              )}
              
              {imageInputMode === 'link' && (
                <input
                  type="url"
                  value={imageURLInput}
                  onChange={(e) => setImageURLInput(e.target.value)}
                  placeholder="Paste image URL here..."
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                />
              )}
              
              {imageInputMode === 'generate' && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageGenPrompt}
                    onChange={(e) => setImageGenPrompt(e.target.value)}
                    placeholder="Describe the dish for AI..."
                    className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {isGeneratingImage ? <LoadingSpinner size="sm" /> : 'Generate'}
                  </button>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Item Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Margherita Pizza"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="199.00"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this delicious dish..."
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDesc}
                    title="AI Generate Description"
                    className="absolute top-3 right-3 p-2 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isGeneratingDesc ? <LoadingSpinner size="sm" /> : '✨'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVeg(true)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                        isVeg
                          ? 'bg-green-100 text-green-700 border-2 border-green-500'
                          : 'bg-slate-100 text-slate-600 border-2 border-slate-200'
                      }`}
                    >
                      🌱 Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsVeg(false)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                        !isVeg
                          ? 'bg-red-100 text-red-700 border-2 border-red-500'
                          : 'bg-slate-100 text-slate-600 border-2 border-slate-200'
                      }`}
                    >
                      🍗 Non-Veg
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Availability</label>
                  <div className="flex items-center justify-between bg-slate-50 border-2 border-slate-200 rounded-lg px-4 py-2 h-[46px]">
                    <span className="text-slate-700 font-medium">In Stock</span>
                    <StockToggle inStock={inStock} onToggle={() => setInStock(!inStock)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" className="border-white" />
              ) : (
                mode === 'add' ? 'Add Item' : 'Save Changes'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
