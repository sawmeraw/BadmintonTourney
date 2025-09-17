import Link from 'next/link';
import {LinkButton} from '@/components/utils/LinkButton';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          <span className="text-gray-900">Tour</span>
          <span className="text-emerald-600">ney</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
            <LinkButton href="/tournaments">
              Tournaments
            </LinkButton>
            <LinkButton href="/players">
              Players
            </LinkButton>
        </nav>
      </div>
    </header>
  );
};