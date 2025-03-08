"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAuth();

  // Reset inputs when modal opens/closes
  useEffect(() => {
    if (!showLogin) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setError(null);
    }
  }, [showLogin]);

  const handleGoogleLogin = async () => {
    setShowLogin(false);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError("Google login failed. Try again.");
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

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLogin(false);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      setShowLogin(false);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError("Error signing up. Try again.");
      }
    }
  };

  return (
    <>
      <header className="bg-gray-800 sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          {/* Logo and Brand Name */}
          <div className="flex items-center lg:flex-1 space-x-3">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
              <Image 
                src="/images/SpeechCode.png"
                width={35} 
                height={35} 
                alt="Code Whisperer Logo" 
                className="rounded-full"
              />
              <span className="font-bold text-xl text-white">Code Whisperer</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex lg:gap-x-12">
            <Link href="/" className="text-sm font-semibold text-white hover:text-gray-300">Home</Link>
            <Link href="/pricing" className="text-sm font-semibold text-white hover:text-gray-300">Pricing</Link>
            <Link href="/documentation" className="text-sm font-semibold text-white hover:text-gray-300">Documentation</Link>
            <Link href="/analytics" className="text-sm font-semibold text-white hover:text-gray-300">Analytics</Link>
          </div>

          {/* User Login/Profile Section */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end relative">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="flex items-center gap-2 text-sm font-semibold text-white hover:text-gray-300"
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
                  <span>{user.displayName || "User"}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded shadow-lg z-10">
                    <div className="px-4 py-3 border-b border-gray-600">
                      <p className="text-sm">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="block w-full px-4 py-2 text-left hover:bg-gray-600">
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="text-sm font-semibold text-white hover:text-gray-300">
                Log in &rarr;
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Login/Sign Up Modal */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-white">{isSignUp ? "Sign Up" : "Login"}</h2>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <form className="mt-4" onSubmit={isSignUp ? handleSignUp : handleEmailLogin}>
              {isSignUp && (
                <>
                  <input type="text" placeholder="First Name" className="w-full p-2 rounded-md bg-gray-800 text-white" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  <input type="text" placeholder="Last Name" className="w-full p-2 mt-2 rounded-md bg-gray-800 text-white" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </>
              )}
              <input type="email" placeholder="Email" className="w-full p-2 mt-2 rounded-md bg-gray-800 text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" className="w-full p-2 mt-2 rounded-md bg-gray-800 text-white" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="mt-4 w-full bg-white text-black font-semibold py-2 rounded">{isSignUp ? "Sign Up" : "Login"}</button>
            </form>

            <button onClick={handleGoogleLogin} className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded">
              Continue with Google
            </button>

            <button onClick={() => setShowLogin(false)} className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded">
              Go Back
            </button>
          </div>
        </div>
      )}
    </>
  );
}
