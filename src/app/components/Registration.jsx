"use client";

import Link from 'next/link';

const Registration = () => {
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/signup" className="text-indigo-600 hover:text-indigo-500">
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default Registration;
