import './globals.css';

export const metadata = {
  title: 'HandoverGraph',
  description: 'Turn a departing developer\'s scattered work into a handover you can check.',
};

// Runs before the page paints, so a dark-mode visitor never sees a white flash.
const THEME = `try{var t=localStorage.theme;if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME }} /></head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
