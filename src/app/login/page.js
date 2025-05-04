"use client";

import LoginForm from '../components/LoginForm';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 mb-4">
            <Image
              src="/images/logo.svg"
              alt="SmartFin Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to SmartFin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your all-in-one financial management solution
          </p>
        </div>
        <LoginForm />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Create a new account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}