"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.FIREBASE_DOMAIN,
  projectId: process.env.FIREBASE_ID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE,
  appId: process.env.FIREBASE_APP,
  measurementID : process.env.FIREBASE_MEASUREMENT
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const scrollToPricing = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    const pricingSection = document.getElementById("pricing-section");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in:", user);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <main className="bg-gray-900 text-white min-h-screen overflow-auto">
      <header className="bg-gray-800 sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image className="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Logo" width={32} height={32} />
            </Link>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#pricing-section" onClick={scrollToPricing} className="text-sm font-semibold text-white cursor-pointer">Pricing</a>
            <Link href="#" className="text-sm font-semibold text-white">Documentation</Link>
            <Link href="#" className="text-sm font-semibold text-white">Analytics</Link>
            <Link href="#" className="text-sm font-semibold text-white">Company</Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button onClick={() => setShowLogin(true)} className="text-sm font-semibold text-white">Log in &rarr;</button>
          </div>
        </nav>
      </header>

      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-white">Login</h2>
            <button onClick={handleGoogleLogin} className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded">Login with Google</button>
            <button onClick={() => setShowLogin(false)} className="mt-4 w-full text-center text-sm text-gray-400 hover:text-white">Close</button>
          </div>
        </div>
      )}

      <section className="p-20 bg-black text-center grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-5xl font-bold text-white">Transform Speech into Code Instantly</h1>
          <p className="mt-4 text-gray-400 text-lg">Our AI-powered speech-to-code extension lets you code faster and more efficiently. Speak your code, and watch it appear in real-time.</p>
          <button onClick={scrollToPricing} className="mt-6 px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded hover:bg-orange-600">See Pricing</button>
        </div>
        <div className="bg-gray-800 h-64 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Video placeholder</p>
        </div>
      </section>

      <section id="pricing-section" className="p-12 bg-gray-800 text-center rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-white">Pricing</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-700 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Free Trial</h3>
            <p className="text-gray-300">Click here to get started on your free trial</p>
            <button className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800">Get Started</button>
          </div>
          <div className="p-6 bg-gray-700 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="text-gray-300">$20/user/month (Annual billing)</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800">Start Free Trial</button>
          </div>
          <div className="p-6 bg-gray-700 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Enterprise</h3>
            <p className="text-gray-300">$500/user/month</p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800">Contact Us</button>
          </div>
        </div>
      </section>
    </main>
  );
}
