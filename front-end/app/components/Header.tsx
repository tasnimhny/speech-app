// app/components/Header.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../lib/firebase';
import { useAuth } from './AuthProvider';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAuth();

  const handleGoogleLogin = async () => {
    setShowLogin(false);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <header className="bg-gray-800 sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="font-bold text-xl text-white">Code Whisperer</span>
            </Link>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <Link href="/" className="text-sm font-semibold text-white hover:text-gray-300">Home</Link>
            <Link href="/pricing" className="text-sm font-semibold text-white hover:text-gray-300">Pricing</Link>
            <Link href="/documentation" className="text-sm font-semibold text-white hover:text-gray-300">Documentation</Link>
            <Link href="/analytics" className="text-sm font-semibold text-white hover:text-gray-300">Analytics</Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end relative">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="flex items-center gap-2 text-sm font-semibold text-white"
                >
                  {user.photoURL ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                      <Image 
                        src={user.photoURL} 
                        alt="Profile" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                  )}
                  <span>{user.displayName || 'User'}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded shadow-lg z-10">
                    <div className="px-4 py-3 border-b border-gray-600">
                      <p className="text-sm">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="block w-full px-4 py-2 text-left hover:bg-gray-600">Log out</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="text-sm font-semibold text-white hover:text-gray-300">Log in &rarr;</button>
            )}
          </div>
        </nav>
      </header>

      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-white">Login</h2>
            <button onClick={handleGoogleLogin} className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded">Login with Google</button>
            <button onClick={() => setShowLogin(false)} className="mt-4 w-full text-center text-sm text-gray-400 hover:text-white">Close</button>
          </div>
        </div>
      )}
    </>
  );
}