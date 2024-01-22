import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './Providers';
import { ColorModeScript } from '@chakra-ui/react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ColorModeScript initialColorMode='dark' />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
