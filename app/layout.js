import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TasteBite - Restaurant Management System',
  description: 'Modern restaurant management and food ordering platform',
  keywords: 'restaurant, food ordering, menu management, online ordering',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
