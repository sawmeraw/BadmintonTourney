import Link from 'next/link';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function NotFound() {
  return (
    <PageWrapper classname="flex items-center justify-center">
      <div className="text-center my-auto">
        <p className="text-3xl font-semibold text-emerald-600">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-800"
          >
            Go back home
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}