import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="p-20 bg-black text-center grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-5xl font-bold text-white">Transform Speech into Code Instantly</h1>
          <p className="mt-4 text-gray-400 text-lg">
            Our AI-powered speech-to-code extension lets you code faster and more efficiently.
            Speak your code, and watch it appear in real-time.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="bg-gray-800 rounded-2xl border-4 border-gray-700 shadow-lg overflow-hidden"
               style={{ width: '480px', height: '270px' }}> 
            <video 
              className="w-full h-full object-cover rounded-2xl"
              src="/videos/demo.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
            />
          </div>
        </div>
      </section>

      {/* Showcase Section (Images on Left, Text on Right) */}
      <section className="py-20 bg-black text-white grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-12">
        <div className="flex justify-center">
          <Image 
            src="/images/CodePic.png" 
            width={500} 
            height={300} 
            alt="Bibi Image" 
            className="rounded-xl shadow-lg border-4 border-gray-700"
          />
        </div>
        <div>
          <h2 className="text-4xl font-bold">Why Speech-to-Code?</h2>
          <p className="text-gray-400 mt-4 text-lg">
            Writing code can sometimes be slow and frustrating. Our Speech-to-Code extension 
            allows developers to dictate their code effortlessly, making development more efficient.
          </p>
          <ul className="mt-4 text-gray-400 list-disc list-inside text-lg">
            <li>💨 Code at lightning speed without typing.</li>
            <li>🎯 Reduce repetitive strain injuries from excessive keyboard use.</li>
            <li>🛠️ Stay focused and improve workflow efficiency.</li>
            <li>🔍 Minimize syntax errors with AI-assisted speech recognition.</li>
          </ul>
        </div>
      </section>

      {/* Founders Section */}
<section className="py-20 bg-black text-white text-center">
  <h2 className="text-4xl font-bold">Meet the Founders</h2>
  <p className="text-gray-400 mt-4 text-lg">
    The minds behind Speech-to-Code, dedicated to making development faster and smarter.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12 px-12">
    {/* Founder 1 */}
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center">
      <div className="w-40 h-40 overflow-hidden rounded-full">
        <Image 
          src="/images/AngelPic.png" 
          width={200} 
          height={200} 
          alt="Angel" 
          className="object-cover w-full h-full"
        />
      </div>
      <h3 className="text-xl font-semibold mt-4">Kerlyn Difo</h3>
    </div>

    {/* Founder 2 */}
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center">
      <div className="w-40 h-40 overflow-hidden rounded-full">
        <Image 
          src="/images/EricPic.png" 
          width={200} 
          height={200} 
          alt="Eric" 
          className="object-cover w-full h-full"
        />
      </div>
      <h3 className="text-xl font-semibold mt-4">Eric Salazar</h3>
    </div>

    {/* Founder 3 */}
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center">
      <div className="w-40 h-40 overflow-hidden rounded-full">
        <Image 
          src="/images/ShabirPic.png" 
          width={200} 
          height={200} 
          alt="Shabir" 
          className="object-cover w-full h-full"
        />
      </div>
      <h3 className="text-xl font-semibold mt-4">Shabir Zahir</h3>
    </div>

    {/* Founder 4 */}
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center">
      <div className="w-40 h-40 overflow-hidden rounded-full">
        <Image 
          src="/images/TasnimPic.png" 
          width={200} 
          height={200} 
          alt="Tasnim" 
          className="object-cover w-full h-full"
        />
      </div>
      <h3 className="text-xl font-semibold mt-4">Tasnim Hossain</h3>
    </div>
  </div>
</section>

    </main>
  );
}
