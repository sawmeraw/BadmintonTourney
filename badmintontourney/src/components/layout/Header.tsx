import Link from 'next/link';
import Button from '@mui/material/Button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center px-4">
        <Link href="/" className="text-2xl font-bold tracking-tighter cursor-pointer">
          <span className="text-gray-900">Tour</span>
          <span className="text-emerald-600">ney</span>
        </Link>
        <div className='flex-grow'></div>
        <nav className="flex items-center gap-4">
            <Button href="/tournaments" variant='contained' color='primary'>
              Tournaments
            </Button>
            <Button href="/players" variant='contained' color='primary'>
              Players
            </Button>
        </nav>
      </div>
    </header>
  );
};