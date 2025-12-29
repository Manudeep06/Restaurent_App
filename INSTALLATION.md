## Installation Guide

Follow these steps to set up and run the TasteBite Restaurant App:

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Firebase account
- Google Gemini API key

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Enable Storage
6. Copy your Firebase configuration

### Step 3: Environment Variables
The `.env.local` file is already created with the configuration. If you need to use your own Firebase project:
1. Update the values in `.env.local` with your Firebase credentials
2. Add your Gemini API key

### Step 4: Run Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### Step 5: Create Admin Account
1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Click "Sign Up"
3. Create your admin account
4. Start managing your restaurant!

## Production Deployment

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Firestore Security Rules

Add these rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Items collection - read for all, write for authenticated users only
    match /items/{item} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Orders collection - read/write for authenticated users only
    match /orders/{order} {
      allow read, write: if request.auth != null;
      allow create: if true; // Allow customers to create orders
    }
  }
}
```

## Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /menu_images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Issue: Module not found errors
**Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Issue: Firebase connection errors
**Solution**: Check your `.env.local` file and ensure all Firebase credentials are correct

### Issue: Images not loading
**Solution**: Check `next.config.js` has the correct image domains configured

### Issue: Build fails
**Solution**: Run `npm run lint` to check for errors, then `npm run build` again

## Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Support

For issues or questions, please open an issue on GitHub or contact support.
