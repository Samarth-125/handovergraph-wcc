import './globals.css';

export const metadata = {
  title: 'HandoverGraph',
  description: 'Turn a departing developer\'s scattered work into a handover you can check.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-800 antialiased">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-3xl px-5 py-4 text-lg font-semibold tracking-tight">
            Handover<span className="text-teal-700">Graph</span>
          </div>
        </header>
        <main className="mx-auto max-w-3xl space-y-8 px-5 py-8">{children}</main>
      </body>
    </html>
  );
}
