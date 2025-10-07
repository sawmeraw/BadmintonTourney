import { Geist, Inter, Public_Sans } from 'next/font/google';

export const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-publicSans',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export const geist = Geist({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-geist'
});