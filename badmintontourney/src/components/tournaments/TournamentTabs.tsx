'use client';

import { useState } from 'react';
import type { Database } from '@/supabase/types';
import { 
  CalendarDaysIcon, MapPinIcon, UsersIcon, TrophyIcon,
  InformationCircleIcon, SparklesIcon, BeakerIcon, PhoneIcon
} from '@heroicons/react/24/outline';
import { LinkButton } from '../utils/LinkButton';
import { StatusBadge } from '../utils/StatusBadge';
import { PageWrapper } from '../layout/PageWrapper';
import { Event, Location, TournamentSummary } from '@/supabase/queryTypes';


const AtAGlanceItem = ({ icon: Icon, children }: { icon: React.ElementType, children: React.ReactNode }) => (
  <li className="flex items-start">
    <Icon className="h-6 w-6 text-emerald-600 mr-4 flex-shrink-0" />
    <span className="text-gray-700">{children}</span>
  </li>
);

const InfoItem = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <div>
    <dt className="flex items-center">
      <Icon className="h-5 w-5 text-gray-500 mr-3" aria-hidden="true" />
      <p className="text-md font-semibold text-gray-800">{title}</p>
    </dt>
    <dd className="mt-2 ml-8 text-base text-gray-600 prose max-w-none">{children}</dd>
  </div>
);


export function TournamentDetailClient({ tournament }: { tournament: TournamentSummary }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Venue & Logistics', 'Rules & Info', 'Contact'];
  
  const location = tournament.locations;

  return (
    <PageWrapper>
      <div className="bg-white rounded shadow-sm border border-gray-200 flex flex-col flex-grow h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <StatusBadge status={tournament.status} />
              <h1 className="mt-2 text-md font-bold tracking-tight text-gray-900 sm:text-2xl">{tournament.name}</h1>
              {tournament.banner_url && (
                <img
                  src={tournament.banner_url}
                  alt={`${tournament.name} banner`}
                  className="w-full mt-4 rounded-lg shadow-sm object-cover max-h-60"
                />
              )}
            </div>
            <div className="mt-4 md:mt-2 md:ml-6 flex-shrink-0">
              {!tournament.is_registration_closed && (
                <LinkButton href={`/tournaments/${tournament.id}/register`} size="lg">
                  Register Now
                </LinkButton>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 flex-grow">
          
          <div className="lg:col-span-2 p-6 flex flex-col">
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${
                      activeTab === tab
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="min-h-[300px] flex-grow">
              {activeTab === 'Overview' && (
                <div className="prose max-w-none text-gray-600">
                  <p>{tournament.description}</p>
                </div>
              )}
              {activeTab === 'Venue & Logistics' && (
                <dl className="space-y-8">
                  <InfoItem icon={MapPinIcon} title="Parking">
                    {tournament.parking_info}
                  </InfoItem>
                  <InfoItem icon={SparklesIcon} title="Food & Refreshments">
                    {tournament.food_info}
                  </InfoItem>
                </dl>
              )}
              {activeTab === 'Rules & Info' && (
                <dl className="space-y-8">
                  <InfoItem icon={BeakerIcon} title="Shuttlecocks">
                    {tournament.shuttle_info}
                  </InfoItem>
                   <InfoItem icon={InformationCircleIcon} title="Additional Information">
                    {tournament.misc_info}
                  </InfoItem>
                </dl>
              )}
              {activeTab === 'Contact' && (
                <dl className="space-y-8">
                   <InfoItem icon={PhoneIcon} title="Contact Us">
                     {tournament.contact_info || "Contact information not provided."}
                   </InfoItem>
                </dl>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 p-6 bg-gray-50/70 border-l border-gray-200 rounded-r-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">At a Glance</h3>
            <ul className="space-y-4">
              <AtAGlanceItem icon={CalendarDaysIcon}>
                {new Date(tournament.start_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} - {new Date(tournament.end_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </AtAGlanceItem>
              {location && (
                <AtAGlanceItem icon={MapPinIcon}>
                  {location[0].name}, {location[0].city}
                </AtAGlanceItem>
              )}
              <AtAGlanceItem icon={TrophyIcon}>5 Events</AtAGlanceItem>
              <AtAGlanceItem icon={UsersIcon}>128 Registered Players</AtAGlanceItem>
            </ul>

            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="flex flex-col space-y-3">
                    <LinkButton href="#" variant="secondary">View Participants</LinkButton>
                    <LinkButton href="#" variant="ghost">Event Rules & Regulations</LinkButton>
                </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}