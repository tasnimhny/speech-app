export default function Home() {
  return (
    <main>
      <section className="p-20 bg-black text-center grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-5xl font-bold text-white">Transform Speech into Code Instantly</h1>
          <p className="mt-4 text-gray-400 text-lg">
            Our AI-powered speech-to-code extension lets you code faster and more efficiently.
            Speak your code, and watch it appear in real-time.
          </p>
        </div>
        <div className="bg-gray-800 h-64 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Video placeholder</p>
        </div>
      </section>
    </main>
  );
}
