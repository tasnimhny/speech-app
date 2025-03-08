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

        {/* Download & Installation */}
        <div>
          <h2 className="text-2xl font-semibold">Download & Install</h2>
          <p className="text-gray-400 mt-2">
            You can download the latest version of the Speech-to-Code extension from our GitHub repository.
          </p>
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <Link 
              href="https://github.com/tasnimhny/speech-app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500 px-6 py-3 rounded text-white font-bold text-center block hover:bg-blue-600"
            >
              ⬇️ Download Latest Version
            </Link>
          </div>
          <h3 className="text-xl font-semibold mt-6">Run the Extension Locally</h3>
          <p className="text-gray-400 mt-2">Follow these steps to run it on your local machine:</p>
          <pre className="bg-gray-800 p-4 rounded mt-4">
            <code className="text-green-400">
{`# Clone the repository
git clone https://github.com/tasnimhny/speech-app.git
cd speech-app

# Install dependencies
npm install

# Run the Next.js app
npm run dev`}
            </code>
          </pre>
        </div>

        {/* Load the Extension in VS Code */}
        <div>
          <h2 className="text-2xl font-semibold">Load the Extension in VS Code</h2>
          <p className="text-gray-400 mt-2">To use the extension in VS Code:</p>
          <ul className="mt-2 list-disc pl-5 text-gray-400">
            <li>Clone the repository and navigate to the project folder.</li>
            <li>Open **VS Code** and go to **File → Open Folder...**</li>
            <li>Select the **extension/** folder inside the project.</li>
            <li>Run `npm install` inside the **extension/** folder (if required).</li>
            <li>Press `F5` to start debugging (or go to **Run → Start Debugging**).</li>
            <li>A new VS Code window will open with the extension enabled.</li>
            <li>Open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).</li>
            <li>Search for **"Enable Speech-to-Code"** and activate the extension.</li>
          </ul>
        </div>

        {/* Voice Commands */}
        <div>
          <h2 className="text-2xl font-semibold">Voice Commands</h2>
          <ul className="mt-2 list-disc pl-5 text-gray-400">
            <li>Say <strong>"Create a function called fetchData"</strong> → Generates a JavaScript function.</li>
            <li>Say <strong>"Add a console log inside"</strong> → Inserts a `console.log()` statement.</li>
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
          <p className="text-gray-500">Make sure you've granted microphone access in your system settings.</p>
        </div>

        {/* Contact & Support */}
        <div>
          <h2 className="text-2xl font-semibold">Contact & Support</h2>
          <p className="text-gray-400 mt-2">Need help? Reach out to us:</p>
          <ul className="mt-2 list-disc pl-5 text-gray-400">
            <li>📧 Email: support@yourdomain.com</li>
            <li>💬 Discord: <Link href="https://discord.gg/example" target="_blank" rel="noopener noreferrer" className="text-blue-400">Join Our Server</Link></li>
            <li>📝 GitHub: <Link href="https://github.com/tasnimhny/speech-app/issues" target="_blank" rel="noopener noreferrer" className="text-blue-400">Open an Issue</Link></li>
          </ul>
        </div>

      </section>
    </main>
  );
}
