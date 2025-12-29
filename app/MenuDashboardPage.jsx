"use client";

import { useState, useEffect } from 'react';
import { initializeApp, getApps } from "firebase/app";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    orderBy
} from "firebase/firestore";
import { 
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";


// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyDLem0N2teS0viEDaR7ZOQ7NHM6iwkN0pY",
  authDomain: "restarent-app-2025.firebaseapp.com",
  projectId: "restarent-app-2025",
  storageBucket: "restarent-app-2025.appspot.com", 
  messagingSenderId: "203030880490",
  appId: "1:203030880490:web:6ed818def7d714c0353793"
};

// --- Initialize Firebase ---
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// --- SVG Icons ---
const VegIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="none" stroke="#22C55E" strokeWidth="2" d="M3 21h18V3H3v18zM12 7v10" /></svg>;
const NonVegIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="none" stroke="#EF4444" strokeWidth="2" d="M3 21h18V3H3v18z" /><circle cx="12" cy="12" r="4" fill="#EF4444" stroke="none" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;
const MenuIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const OrdersIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75c-.621 0-1.125-.504-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375V17.25m0 0A2.25 2.25 0 0018.75 15h.008a2.25 2.25 0 002.242-2.25 2.25 2.25 0 00-2.25-2.25h-.008a2.25 2.25 0 00-2.242 2.25 2.25 2.25 0 002.25 2.25h.008z" /></svg>;
const AnalyticsIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
const UserIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" /></svg>;

// --- Main Component ---
export default function MenuDashboardPage() {
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const q = query(collection(db, "items"), orderBy("name"));
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
    
    const handleEmailLogin = async (e) => { e.preventDefault(); setError(''); try { await signInWithEmailAndPassword(auth, email, password); } catch(err) { setError("Invalid credentials. Please try again."); } };
    const handleRegister = async (e) => { e.preventDefault(); setError(''); try { await createUserWithEmailAndPassword(auth, email, password); } catch(err) { setError("Failed to register. Ensure password is 6+ characters."); } };
    const handleLogout = async () => { await signOut(auth); };
    
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
            await addDoc(collection(db, "items"), { ...itemData, imageURL: finalImageURL });
        } catch (error) {
             console.error("Error adding document: ", error);
             throw error; 
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm("Are you sure you want to permanently delete this item?")) {
            try { await deleteDoc(doc(db, "items", id)); } catch (error) { console.error("Error deleting document: ", error); }
        }
    };
    
    const handleUpdateItem = async (itemData, imageFile) => {
        if (!editingItem) return;
        try {
            let finalImageURL = itemData.imageURL;
            if (imageFile) {
                finalImageURL = await uploadImage(imageFile);
            }
            const itemDocRef = doc(db, "items", editingItem.id);
            await updateDoc(itemDocRef, { ...itemData, imageURL: finalImageURL });
        } catch (error) {
            console.error("Error updating document: ", error);
            throw error;
        }
    };

    const handleStockToggle = async (item) => {
        const itemDocRef = doc(db, "items", item.id);
        await updateDoc(itemDocRef, { inStock: !item.inStock });
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-100 text-slate-800">Loading...</div>;
    }

    if (!user) {
        return <LoginPage 
            authMode={authMode} setAuthMode={setAuthMode}
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            error={error} 
            handleEmailLogin={handleEmailLogin}
            handleRegister={handleRegister}
        />;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
             <div className="sticky top-0 z-30 bg-slate-800 shadow-md">
                <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white">Dashboard</h1>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-xs bg-slate-700 text-slate-200 placeholder-slate-400 p-2 rounded-full border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                </div>
            </div>
            <main className="container mx-auto px-4 pt-8 pb-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredItems.map(item => (
                        <MenuItemCard 
                            key={item.id} 
                            item={item}
                            onEdit={() => setEditingItem(item)}
                            onDelete={() => handleDeleteItem(item.id)}
                            onStockToggle={() => handleStockToggle(item)}
                        />
                    ))}
                </div>
            </main>

            <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />
            <BottomNavBar onLogout={handleLogout} />

            {isAddModalOpen && <ItemModal mode="add" onClose={() => setIsAddModalOpen(false)} onSave={handleAddItem} />}
            {editingItem && <ItemModal mode="edit" item={editingItem} onClose={() => setEditingItem(null)} onSave={handleUpdateItem} />}
        </div>
    );
}

// --- Sub-Components ---
const LoginPage = ({ authMode, setAuthMode, email, setEmail, password, setPassword, error, handleEmailLogin, handleRegister }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-200 p-4">
            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')"}}></div>
            <div className="absolute inset-0 bg-black/50"></div>
            
            <div className="relative w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700 mb-2">Owner Dashboard</h1>
                    <p className="text-slate-600">{authMode === 'login' ? 'Login to manage your restaurant' : 'Create a new owner account'}</p>
                </div>
                <form onSubmit={authMode === 'login' ? handleEmailLogin : handleRegister} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full bg-white/70 backdrop-blur-sm text-slate-800 p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full bg-white/70 backdrop-blur-sm text-slate-800 p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 shadow-lg hover:shadow-xl shadow-blue-500/40">
                        {authMode === 'login' ? 'Log In' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center text-sm text-slate-600">
                    {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="font-semibold text-blue-600 hover:text-purple-500 ml-1">
                         {authMode === 'login' ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

const BottomNavBar = ({ onLogout }) => (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 shadow-[0_-1px_10px_rgba(0,0,0,0.05)] z-40">
        <div className="container mx-auto px-4 h-16 flex justify-around items-center">
            <a href="#" className="flex flex-col items-center gap-1 text-purple-600">
                <MenuIcon className="w-6 h-6" />
                <span className="text-xs font-bold">Menu</span>
            </a>
            <a href="#" className="flex flex-col items-center gap-1 text-slate-500 hover:text-purple-600 transition-colors">
                <OrdersIcon className="w-6 h-6" />
                <span className="text-xs font-medium">Orders</span>
            </a>
            <a href="#" className="flex flex-col items-center gap-1 text-slate-500 hover:text-purple-600 transition-colors">
                <AnalyticsIcon className="w-6 h-6" />
                <span className="text-xs font-medium">Analytics</span>
            </a>
            <button onClick={onLogout} className="flex flex-col items-center gap-1 text-slate-500 hover:text-purple-600 transition-colors">
                <UserIcon className="w-6 h-6" />
                <span className="text-xs font-medium">Logout</span>
            </button>
        </div>
    </footer>
);

const FloatingActionButton = ({ onClick }) => (
    <button 
        onClick={onClick} 
        className="fixed bottom-20 right-4 sm:right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-40"
        aria-label="Add New Item"
    >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    </button>
);


const MenuItemCard = ({ item, onEdit, onDelete, onStockToggle }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden flex flex-col transition-all duration-300 group hover:shadow-xl hover:-translate-y-1">
            <div className="overflow-hidden relative">
                <img src={item.imageURL || 'https://placehold.co/600x400/f1f5f9/475569?text=No+Image'} alt={item.name} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"/>
                <div className="absolute top-2 right-2">
                    <div className="relative">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="bg-white/70 backdrop-blur-md p-1.5 rounded-full text-slate-700 hover:bg-white transition">
                            <MoreIcon />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-10 py-1 border border-slate-200">
                                <button onClick={() => { onEdit(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Edit</button>
                                <button onClick={() => { onDelete(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100">Delete</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                    {item.isVeg ? <VegIcon /> : <NonVegIcon />}
                </div>
                <p className="text-sm text-slate-500 mt-1 flex-1">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">₹{item.price}</p>
                     <StockToggle inStock={item.inStock} onToggle={onStockToggle} />
                </div>
            </div>
        </div>
    );
};

const StockToggle = ({ inStock, onToggle }) => (
    <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${inStock ? 'bg-purple-600' : 'bg-slate-300'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${inStock ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

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
        if (imageFile) { imagePreview = URL.createObjectURL(imageFile); } 
        else if (item?.imageURL && imageInputMode !== 'generate') { imagePreview = item.imageURL; }
    } else { imagePreview = imageURLInput; }

    const handleImageFileChange = (e) => { if (e.target.files[0]) { setImageFile(e.target.files[0]); } };
    
    const handleGenerateDescription = async () => {
        if (!name) { alert("Please enter an item name first."); return; }
        setIsGeneratingDesc(true);
        try {
            const apiKey = "AIzaSyAEmrzJZbrRj2RSs8EqHu2QW6Ahj3o65OA"; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const payload = { contents: [{ parts: [{ text: `Write a short, delicious, and enticing menu description for a dish called '${name}'. Keep it under 20 words.` }] }], };
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) { setDescription(text.trim()); } else { throw new Error("Failed to generate description."); }
        } catch (err) { console.error(err); alert("Sorry, couldn't generate a description right now."); }
        setIsGeneratingDesc(false);
    };

    const base64ToBlob = (base64, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(base64);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) { byteNumbers[i] = slice.charCodeAt(i); }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: contentType });
    }

    const handleGenerateImage = async () => {
        if (!imageGenPrompt) { 
            alert("Please enter a description for the image."); 
            return; 
        }
        
        setIsGeneratingImage(true);
        setImageFile(null);
        setImageURLInput('');
        
        try {
            // Try Gemini 2.0 Flash Preview Image Generation first
            const apiKey = "AIzaSyAEmrzJZbrRj2RSs8EqHu2QW6Ahj3o65OA";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`;
            
            const payload = {
                contents: [{
                    parts: [{
                        text: `Generate a professional food photography image of: ${imageGenPrompt}. The image should be high quality, appetizing, well-lit, and suitable for a restaurant menu. Focus on making the food look delicious and appealing.`
                    }]
                }]
            };
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('Gemini API Response:', result);
            
            // Check if we got a valid response with image data
            if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
                const imagePart = result.candidates[0].content.parts.find(part => part.inlineData);
                
                if (imagePart && imagePart.inlineData && imagePart.inlineData.data) {
                    // Convert base64 to blob
                    const base64Data = imagePart.inlineData.data;
                    const blob = base64ToBlob(base64Data, 'image/png');
                    const file = new File([blob], `${imageGenPrompt.replace(/\s+/g, '_')}.png`, { type: 'image/png' });
                    setImageFile(file);
                    if (!name) {
                        setName(imageGenPrompt);
                    }
                    setIsGeneratingImage(false);
                    return;
                }
            }
            
            // If Gemini API doesn't work, fall back to a food image service
            throw new Error("No image data received from Gemini API");
            
        } catch (err) {
            console.error("Gemini API failed, trying fallback:", err);
            
            try {
                // Fallback: Use a food image service with better prompt matching
                const foodImageServices = [
                    `https://source.unsplash.com/600x400/?food,${encodeURIComponent(imageGenPrompt)}`,
                    `https://picsum.photos/600/400?random=${Math.abs(imageGenPrompt.split('').reduce((a, b) => a + b.charCodeAt(0), 0))}`,
                    `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center&q=80`
                ];
                
                let imageUrl = foodImageServices[0];
                
                // Try different services based on prompt content
                if (imageGenPrompt.toLowerCase().includes('pizza') || imageGenPrompt.toLowerCase().includes('pasta')) {
                    imageUrl = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center&q=80';
                } else if (imageGenPrompt.toLowerCase().includes('burger') || imageGenPrompt.toLowerCase().includes('sandwich')) {
                    imageUrl = 'https://images.unsplash.com/photo-1551782450-a2132b4da21d?w=600&h=400&fit=crop&crop=center&q=80';
                } else if (imageGenPrompt.toLowerCase().includes('salad') || imageGenPrompt.toLowerCase().includes('vegetable')) {
                    imageUrl = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop&crop=center&q=80';
                } else if (imageGenPrompt.toLowerCase().includes('dessert') || imageGenPrompt.toLowerCase().includes('sweet')) {
                    imageUrl = 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&h=400&fit=crop&crop=center&q=80';
                }
                
                // Create a temporary image to convert to blob
                const img = new Image();
                img.crossOrigin = "anonymous";
                
                img.onload = () => {
                    try {
                        // Convert image to blob
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = 600;
                        canvas.height = 400;
                        ctx.drawImage(img, 0, 0, 600, 400);
                        
                        canvas.toBlob((blob) => {
                            if (blob) {
                                const file = new File([blob], `${imageGenPrompt.replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
                                setImageFile(file);
                                if (!name) {
                                    setName(imageGenPrompt);
                                }
                            } else {
                                throw new Error("Failed to convert image to blob");
                            }
                            setIsGeneratingImage(false);
                        }, 'image/jpeg', 0.9);
                    } catch (error) {
                        console.error("Error processing fallback image:", error);
                        alert("Image generated successfully, but there was an error processing it. Please try again.");
                        setIsGeneratingImage(false);
                    }
                };
                
                img.onerror = () => {
                    console.error("Failed to load fallback image");
                    alert("Sorry, couldn't generate an image right now. Please try uploading an image instead.");
                    setIsGeneratingImage(false);
                };
                
                img.src = imageUrl;
                
            } catch (fallbackErr) {
                console.error("Fallback image generation failed:", fallbackErr);
                alert("Sorry, couldn't generate an image right now. Please try uploading an image instead.");
                setIsGeneratingImage(false);
            }
        }
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
        const itemData = { name, price: parseFloat(price), description, isVeg, inStock, imageURL: urlToSave };
        
        try {
            await onSave(itemData, fileToUpload);
            onClose(); // Close modal on success
        } catch (error) {
            console.error("Failed to save item:", error);
            alert("There was an error saving the item. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-lg h-full sm:h-auto sm:max-h-[90vh] rounded-lg shadow-xl flex flex-col">
                <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-800">{mode === 'add' ? 'Add New Item' : 'Edit Item'}</h2>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                        
                        {/* --- Image Section --- */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700">Item Image</label>
                            <div className="relative w-full h-48 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50 overflow-hidden">
                               {imagePreview ? 
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> :
                                    <div className="text-center"><UploadIcon /><p className="mt-2 text-sm text-slate-500">Image Preview</p></div>
                                }
                                {isGeneratingImage && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="mt-2 text-sm text-slate-600 font-semibold">Generating Image...</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-300 rounded-lg w-full">
                                <button type="button" onClick={() => setImageInputMode('upload')} className={`px-3 py-2 rounded-md text-sm transition-colors flex-1 ${imageInputMode === 'upload' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md font-semibold' : 'text-slate-600 hover:bg-slate-200'}`}>Upload</button>
                                <button type="button" onClick={() => setImageInputMode('link')} className={`px-3 py-2 rounded-md text-sm transition-colors flex-1 ${imageInputMode === 'link' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md font-semibold' : 'text-slate-600 hover:bg-slate-200'}`}>Link</button>
                                <button type="button" onClick={() => setImageInputMode('generate')} className={`px-3 py-2 rounded-md text-sm transition-colors flex-1 ${imageInputMode === 'generate' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md font-semibold' : 'text-slate-600 hover:bg-slate-200'}`}>✨ AI</button>
                            </div>
                            {imageInputMode === 'upload' && (<label className="block w-full border border-slate-300 rounded-lg p-3 text-center cursor-pointer bg-slate-50 hover:bg-slate-100 text-sm text-slate-600"> <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" /> <span>{imageFile ? imageFile.name : 'Choose a file to upload'}</span> </label> )}
                            {imageInputMode === 'link' && (<input type="url" value={imageURLInput} onChange={(e) => setImageURLInput(e.target.value)} placeholder="Paste image link here (e.g., https://...)" className="w-full bg-slate-100 text-slate-700 p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/> )}
                            {imageInputMode === 'generate' && (
                                <div className="p-3 bg-slate-100 rounded-lg border border-slate-300 space-y-2">
                                    <div className="flex gap-2">
                                        <input type="text" value={imageGenPrompt} onChange={(e) => setImageGenPrompt(e.target.value)} placeholder="Describe the dish for AI image generation..." className="w-full bg-white text-slate-700 p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/>
                                        <button type="button" onClick={handleGenerateImage} disabled={isGeneratingImage} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-4 rounded-lg transition shadow-md hover:scale-105 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                                            {isGeneratingImage ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Generate'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* --- Details Section --- */}
                        <div className="space-y-4 pt-6 border-t border-slate-200">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">🍴</span>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item Name" required className="w-full bg-slate-100 text-slate-700 p-3 pl-10 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">₹</span>
                                <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required className="w-full bg-slate-100 text-slate-700 p-3 pl-10 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/>
                            </div>
                            
                            <div className="relative">
                              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short Description" rows="3" className="w-full bg-slate-100 text-slate-700 p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition pr-10"/>
                              <button type="button" onClick={handleGenerateDescription} disabled={isGeneratingDesc} title="Auto-generate Description" className="absolute top-2.5 right-2.5 text-slate-400 hover:text-purple-600 p-1 rounded-full hover:bg-slate-200 transition disabled:opacity-50">
                                <span className="sr-only">Generate Description</span>
                                {isGeneratingDesc ? <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l.08.192c.045.106.12.196.216.27.097.074.206.124.325.148l.21.042c.81.162 1.258.987.95 1.72l-.08.192c-.045.106-.12.196-.216.27-.097.074-.206.124-.325.148l-.21.042c-.81.162-1.258.987-.95 1.72l.08.192c.045.106.12.196.216.27.097.074.206.124.325.148l.21.042c.81.162 1.258.987-.95 1.72l-.08.192c-.045.106-.12.196-.216.27-.097.074-.206.124-.325.148l-.21.042c-.81.162-1.258.987-.95 1.72l.08.192c.321.772-1.415.772-1.736 0l-.08-.192c-.045-.106-.12-.196-.216-.27-.097-.074-.206-.124-.325-.148l-.21-.042c-.81-.162-1.258-.987-.95-1.72l.08-.192c.045-.106.12-.196.216-.27.097-.074.206-.124.325-.148l.21-.042c.81-.162 1.258-.987.95-1.72l-.08-.192c-.045-.106-.12-.196-.216-.27-.097-.074-.206-.124-.325-.148l-.21-.042c-.81-.162-1.258-.987-.95-1.72l.08-.192z" clipRule="evenodd" /></svg>}
                              </button>
                            </div>
                        </div>

                        {/* --- Options Section --- */}
                        <div className="space-y-4 pt-6 border-t border-slate-200">
                             <div className="flex justify-between items-center">
                                <label className="text-slate-600 font-medium">Category</label>
                                <div className="flex items-center gap-2 p-1 bg-slate-100 border border-slate-300 rounded-lg">
                                    <button type="button" onClick={() => setIsVeg(true)} className={`px-3 py-1 rounded-md text-sm transition-colors ${isVeg ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>Veg</button>
                                    <button type="button" onClick={() => setIsVeg(false)} className={`px-3 py-1 rounded-md text-sm transition-colors ${!isVeg ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>Non-Veg</button>
                                </div>
                            </div>
                             <div className="flex justify-between items-center">
                                <label className="text-slate-600 font-medium">Availability</label>
                                <StockToggle inStock={inStock} onToggle={() => setInStock(!inStock)} />
                            </div>
                        </div>

                    </div>
                    
                    <div className="flex-shrink-0 flex justify-end gap-4 p-4 border-t border-slate-200 sticky bottom-0 bg-white">
                        <button type="button" onClick={onClose} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center w-36 disabled:opacity-70">
                            {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (mode === 'add' ? 'Add Item' : 'Save Changes')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

