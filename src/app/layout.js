import './globals.css';
import { Inter } from 'next/font/google';
import initDatabase from '../lib/db-init';
import ClientLayout from './ClientLayout';

// Initialize MongoDB connection when the app starts (server-side only)
if (typeof window === 'undefined') {
  initDatabase()
    .then(() => console.log('MongoDB initialized in server environment'))
    .catch(err => console.error('MongoDB initialization error:', err));
}

const inter = Inter({ subsets: ['latin'] });

// Metadata can only be exported from a Server Component
export const metadata = {
  title: 'SmartFin - Financial Management Solution',
  description: 'Modern financial management solution for businesses and individuals',
};

// This is a Server Component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
