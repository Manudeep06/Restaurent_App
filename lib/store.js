import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  
  addItem: (item) => set((state) => {
    const existingItem = state.items.find(i => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  
  removeItem: (itemId) => set((state) => ({
    items: state.items.filter(i => i.id !== itemId)
  })),
  
  updateQuantity: (itemId, quantity) => set((state) => ({
    items: state.items.map(i =>
      i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i
    ).filter(i => i.quantity > 0)
  })),
  
  clearCart: () => set({ items: [] }),
  
  getTotalPrice: () => {
    const state = get();
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getTotalItems: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }
}));
