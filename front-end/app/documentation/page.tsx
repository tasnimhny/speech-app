// app/documentation/page.tsx
import Link from "next/link";

export default function Documentation() {
  return (
    <main className="bg-gray-900 text-white min-h-screen p-12">
      <h1 className="text-4xl font-bold text-center mb-8">Documentation</h1>
      <section className="max-w-4xl mx-auto space-y-8">
        {/* Introduction */}
        <div>
          <h2 className="text-2xl font-semibold">Introduction</h2>
          <p className="text-gray-400 mt-2">
            Our AI-powered speech-to-code extension allows developers to write code hands-free. Speak your code, and watch it appear instantly.
          </p>
        </div>
        {/* Installation */}
        <div>
          <h2 className="text-2xl font-semibold">Installation & Setup</h2>
          <p className="text-gray-400 mt-2">Follow these steps to install:</p>
          <pre className="bg-gray-800 p-4 rounded mt-4">
            <code className="text-green-400">npm install speech-to-code-ai</code>
          </pre>
        </div>
        {/* Commands */}
        <div>
          <h2 className="text-2xl font-semibold">Voice Commands</h2>
          <ul className="mt-2 list-disc pl-5 text-gray-400">
            <li>Say "Create a function called fetchData" → Generates a JavaScript function</li>
            <li>Say "Add a console log inside" → Inserts a `console.log()` statement</li>
          </ul>
        </div>
        {/* Features */}
        <div>
          <h2 className="text-2xl font-semibold">Features</h2>
          <ul className="mt-2 list-disc pl-5 text-gray-400">
            <li>🎙️ Real-Time Speech-to-Code</li>
            <li>⚡ Supports JavaScript, Python, and more</li>
            <li>🚀 Works with VS Code & Web Apps</li>
          </ul>
        </div>
        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-semibold">FAQs</h2>
          <p className="text-gray-400 mt-2"><strong>Why isn't my microphone working?</strong></p>
          <p className="text-gray-500">Make sure you've granted microphone access in browser settings.</p>
        </div>
        {/* Contact */}
        <div>
          <h2 className="text-2xl font-semibold">Contact & Support</h2>
          <p className="text-gray-400 mt-2">Need help? Reach out to us:</p>
          <ul className="mt-2 list-disc pl-5 text-gray-400">
            <li>📧 Email: support@yourdomain.com</li>
            <li>💬 Discord: <Link href="https://discord.gg/example" className="text-blue-400">Join Our Server</Link></li>
            <li>📝 GitHub: <Link href="https://github.com/yourrepo" className="text-blue-400">Open an Issue</Link></li>
          </ul>
        </div>
      </section>
    </main>
  );
}