# TasteBite - Restaurant Management System

A modern, production-ready restaurant management and food ordering platform built with Next.js 14, Firebase, and Tailwind CSS.

## 🚀 Features

### For Customers
- **Beautiful Landing Page** - Eye-catching hero section with smooth animations
- **Browse Menu** - Filter by vegetarian/non-vegetarian, search functionality
- **Shopping Cart** - Real-time cart management with Zustand state management
- **Easy Checkout** - Simple order placement with customer details
- **Order Confirmation** - Clear confirmation with estimated delivery time

### For Restaurant Owners/Admins
- **Secure Authentication** - Firebase Auth for admin login
- **Menu Management** - Add, edit, delete menu items with images
- **AI-Powered Features**:
  - Auto-generate food descriptions using Gemini AI
  - AI image generation for menu items
- **Orders Dashboard** - Real-time order tracking and management
- **Analytics** - Beautiful charts showing:
  - Revenue trends (last 7 days)
  - Orders by status (pie chart)
  - Top selling items (bar chart)
  - Key metrics (total revenue, orders, avg order value, customers)
- **Stock Management** - Toggle item availability in real-time

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **AI Integration**: Google Gemini AI

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Restaurent_App-main
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env.local` file in the root directory with your Firebase and Gemini API credentials (see `.env.local` for structure).

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel
The easiest way to deploy is using Vercel:
```bash
npm i -g vercel
vercel
```

## 📁 Project Structure

```
├── app/
│   ├── admin/           # Admin dashboard
│   ├── analytics/       # Analytics page
│   ├── checkout/        # Checkout page
│   ├── menu/            # Customer menu page
│   ├── orders/          # Orders management
│   ├── order-confirmation/  # Order success page
│   ├── layout.js        # Root layout
│   ├── page.jsx         # Landing page
│   └── globals.css      # Global styles
├── components/
│   ├── Icons.jsx        # SVG icon components
│   └── UIComponents.jsx # Reusable UI components
├── lib/
│   ├── firebase.js      # Firebase configuration
│   └── store.js         # Zustand store
├── .env.local           # Environment variables
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies
└── tailwind.config.js   # Tailwind configuration
```

## 🔐 Environment Variables

Required environment variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_GEMINI_API_KEY`

## 🎨 Color Scheme

The app uses a beautiful gradient color scheme:
- Primary: Blue (#3B82F6) to Purple (#8B5CF6)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Danger: Red (#EF4444)
- Background: Slate with purple/blue gradient overlays

## 📱 Responsive Design

Fully responsive design that works beautifully on:
- Mobile devices (320px+)
- Tablets (768px+)
- Laptops (1024px+)
- Desktops (1280px+)

## 🔒 Security Features

- Firebase Authentication for admin access
- Environment variables for sensitive data
- Secure Firebase rules (configure in Firebase Console)
- Input validation and sanitization

## 📊 Database Structure

### Collections:
1. **items** - Menu items
   - name, price, description, isVeg, inStock, imageURL

2. **orders** - Customer orders
   - items[], total, customerInfo{}, paymentMethod, status, timestamp

## 🎯 Future Enhancements

- Customer authentication
- Order history for customers
- Push notifications
- Table reservations
- Multiple restaurant locations
- Delivery tracking
- Payment gateway integration
- Reviews and ratings

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Icons by Lucide React
- Images from Unsplash
- UI inspiration from modern food delivery apps

## 📞 Support

For support, email support@tastebite.com or open an issue in the repository.

---

Made with ❤️ for restaurant owners and food lovers
