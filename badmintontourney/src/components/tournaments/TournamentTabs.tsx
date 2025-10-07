'use client';

import { useState } from 'react';
import { 
  CalendarDaysIcon, MapPinIcon, UsersIcon, TrophyIcon,
  InformationCircleIcon, SparklesIcon, BeakerIcon, PhoneIcon
} from '@heroicons/react/24/outline';
import Button from '@mui/material/Button';
import { StatusBadge } from '../utils/StatusBadge';
import { PageWrapper } from '../layout/PageWrapper';
import {  TournamentSummary } from '@/supabase/queryTypes';


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

export function TournamentTabs({ tournament }: { tournament: TournamentSummary }) {
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
                <Button href={`/tournaments/${tournament.id}/register`} variant='outlined' color='primary'>
                  Register Now
                </Button>
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
            
            <div className="min-h-[200px] ">
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

            <div className="min-h-[200px]">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Events</h3>
                
                {tournament.events && tournament.events.length > 0 ? (
                    <div className="space-y-4">
                    {tournament.events.map((event) => (
                        <div 
                        key={event.id} 
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border border-gray-200 p-4 bg-gray-50"
                        >
                        <div>
                            <p className="text-lg font-semibold text-gray-800">{event.name}</p>
                            <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                            <span>Entry Fee: <span className="font-medium text-gray-900">${event.entry_fee}</span></span>
                            <span>First Prize: <span className="font-medium text-emerald-600">${event.first_prize_money}</span></span>
                            </div>
                        </div>
                        
                        <div className="mt-4 sm:mt-0">
                            <Button 
                            href={`/tournaments/${tournament.id}/events/${event.id}`}
                            variant="outlined"
                            color='primary'
                            >
                                Open
                            </Button>
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                    <p className="text-gray-500">No events have been announced for this tournament yet.</p>
                    </div>
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
                  {location.name}, {location.city}
                </AtAGlanceItem>
              )}
              <AtAGlanceItem icon={TrophyIcon}>5 Events</AtAGlanceItem>
              <AtAGlanceItem icon={UsersIcon}>128 Registered Players</AtAGlanceItem>
            </ul>

            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="flex flex-col space-y-3">
                    <Button href="#" variant="outlined" color='primary'>View Participants</Button>
                    <Button href="#" variant="text" color="secondary">Event Rules & Regulations</Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}