export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>My Next.js App</title>
      </head>
      <body className="min-h-screen bg-white text-black">
        {children}
      </body>
    </html>
  );
}
