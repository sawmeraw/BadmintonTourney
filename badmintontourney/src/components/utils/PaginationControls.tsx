"use client";

import Button from "@mui/material/Button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PaginationControlsProps {
    totalCount: number;
    pageSize: number;
    currentPage: number;
}

export const PaginationControls = ({
    totalCount,
    pageSize,
    currentPage,
}: PaginationControlsProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(newPage));
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="mt-12 flex items-center justify-between my-2">
            <div>
                <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    variant="outlined"
                    color="secondary"
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    variant="outlined"
                    color="secondary"
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};
