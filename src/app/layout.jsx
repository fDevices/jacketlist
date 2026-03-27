import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'JacketList | The list worth reading. In the right order.',
  description:
    'Weekly bestsellers ranked from NYT, The Guardian, and Goodreads — plus reading order guides for popular book series.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        {/* Replace ca-pub-5836194435861990 with your real AdSense publisher ID once approved */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5836194435861990"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-surface text-on-surface">
        <Nav />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
