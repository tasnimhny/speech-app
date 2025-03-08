"use client";
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP,
  measurementID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken();
      
      // Store the token in localStorage
      localStorage.setItem('vscodeAuthToken', idToken);
      
      setSuccess(true);
      
      // Redirect to token handler page after a short delay
      setTimeout(() => {
        router.push('/auth/token-handler');
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-trigger login when the page loads
  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white">
        <h1 className="text-2xl font-bold mb-4">
          {success ? 'Login Successful!' : isLoading ? 'Authenticating...' : 'Login to Voice to Code'}
        </h1>
        {error && (
          <>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Try Again
            </button>
          </>
        )}
        {success && (
          <p className="text-green-400">Completing authentication...</p>
        )}
        {isLoading && (
          <p className="text-gray-300">Please complete the Google sign-in process...</p>
        )}
      </div>
    </div>
  );
} 