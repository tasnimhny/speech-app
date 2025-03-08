"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DraggableContact from "../components/DraggableContact"; // Import the component

export default function Pricing() {
  const router = useRouter();
  const [showContactForm, setShowContactForm] = useState(false); // State to show/hide contact form

  return (
    <main className="py-12 px-4">
      <section className="max-w-7xl mx-auto p-12 bg-gray-800 text-center rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-white">Pricing</h2>
        <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
          Choose the perfect plan for your needs. All plans include our core speech-to-code features.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Free Trial Plan */}
          <div className="p-6 bg-gray-700 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Free Trial</h3>
            <div className="mt-4 text-3xl font-bold">$0</div>
            <p className="text-gray-300 mt-2">7 days of full access</p>
            <ul className="mt-6 text-gray-400 text-left space-y-2">
              <li>✓ Basic voice commands</li>
              <li>✓ JavaScript support</li>
              <li>✓ VS Code integration</li>
            </ul>
            <button 
              className="mt-8 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => router.push("/documentation#download")}
            >
              Get Started
            </button>
          </div>
          
          {/* Pro Plan */}
          <div className="p-6 bg-gray-700 shadow-lg rounded-lg border-2 border-blue-500 transform scale-105 relative">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs absolute -top-3 left-1/2 transform -translate-x-1/2">
              MOST POPULAR
            </span>
            <h3 className="text-xl font-semibold">Pro</h3>
            <div className="mt-4 text-3xl font-bold">$20</div>
            <p className="text-gray-300 mt-2">per user/month (Annual billing)</p>
            <ul className="mt-6 text-gray-400 text-left space-y-2">
              <li>✓ All Free features</li>
              <li>✓ Advanced voice commands</li>
              <li>✓ Multi-language support</li>
              <li>✓ Custom shortcuts</li>
              <li>✓ Priority support</li>
            </ul>
            <button 
              className="mt-8 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => router.push("/checkout")}
            >
              Start Free Trial
            </button>
          </div>
          
          {/* Enterprise Plan */}
          <div className="p-6 bg-gray-700 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Enterprise</h3>
            <div className="mt-4 text-3xl font-bold">Custom</div>
            <p className="text-gray-300 mt-2">For teams of 10+</p>
            <ul className="mt-6 text-gray-400 text-left space-y-2">
              <li>✓ All Pro features</li>
              <li>✓ Dedicated account manager</li>
              <li>✓ Custom integrations</li>
              <li>✓ Team analytics</li>
              <li>✓ SSO & advanced security</li>
            </ul>
            <button 
              className="mt-8 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setShowContactForm(true)} // ✅ Opens the contact form
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Render the draggable contact form only if showContactForm is true */}
      {showContactForm && <DraggableContact onClose={() => setShowContactForm(false)} />}
    </main>
  );
}
