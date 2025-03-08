// app/components/Footer.tsx
'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold">Stay Updated</h2>
            <p className="mt-2 text-gray-400">Subscribe to our newsletter for the latest news.</p>
            <form className="mt-4 flex">
              <input type="email" placeholder="Your email" className="w-full p-2 rounded-l-md bg-gray-700 border-none text-white focus:ring-0" />
              <button className="px-4 py-2 bg-blue-500 rounded-r-md hover:bg-blue-600">Subscribe</button>
            </form>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white">GitHub</a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between">
          <p className="text-sm text-gray-400">&copy; 2024 SpeechCode. All rights reserved.</p>
          <div className="flex space-x-4 text-sm">
            <a href="#" className="hover:text-white">Terms & Conditions</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}