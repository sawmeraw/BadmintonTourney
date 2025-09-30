'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface PaginationControlsProps {
    totalCount: number;
    pageSize: number;
    currentPage: number;
}

export const PaginationControls = ({ totalCount, pageSize, currentPage }: PaginationControlsProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(newPage));
        router.push(`${pathname}?${params.toString()}`);
    };

    // if (totalPages <= 1) return null;

    return (
        <div className="mt-12 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </p>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-gray-100 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 h-10 px-4 py-2"
                >
                    Previous
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-gray-100 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 h-10 px-4 py-2"
                >
                    Next
                </button>
            </div>
        </div>
    );
};