import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { LinkButton } from '@/components/utils/LinkButton';

export default function HomePage() {
  return (
    <PageWrapper>
      <section className="text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
            The Ultimate <span className="text-emerald-600">Badminton</span> Tournament Engine
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            From local clubs to national championships, manage brackets, players,
            and live scores all in one place. Effortless setup, powerful features.
          </p>
        </div>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <LinkButton href="/tournaments">
            Explore Tournaments
          </LinkButton>
          
          <LinkButton href="/players" variant="secondary" size="lg">
            View Players
          </LinkButton>

          <LinkButton href="/about" variant="ghost" size="sm">
            Learn More <ArrowRightIcon className="ml-2 h-4 w-4" />
          </LinkButton>
        </div>
      </section>

      <section className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-xl font-semibold">Live Brackets</h3>
          <p className="mt-2 text-gray-600">
            Generate and manage dynamic knockout and round-robin brackets with ease.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-xl font-semibold">Player Management</h3>
          <p className="mt-2 text-gray-600">
            Keep track of player profiles, registrations, and performance history.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-xl font-semibold">Real-time Scores</h3>
          <p className="mt-2 text-gray-600">
            Update match scores instantly and keep everyone informed as the action unfolds.
          </p>
        </div>
      </section>
    </PageWrapper>
  );
}