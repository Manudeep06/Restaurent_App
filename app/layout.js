import './globals.css';

export const metadata = {
  title: 'Restaurant Management',
  description: 'Owner Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-gray-900">{children}</body>
    </html>
  );
}
