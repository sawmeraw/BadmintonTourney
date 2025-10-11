"use client";

import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@mui/material";

type RouteKey = "t" | "e" | "reg";
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const routeMappings: Record<RouteKey, string> = {
    t: "Tournament",
    e: "Event",
    reg: "Registrations",
};

function isRouteKey(key: string): key is RouteKey {
    return ["t", "e", "reg"].includes(key);
}

export const Breadcrumbs = () => {
    const pathname = usePathname();
    if (pathname === "/") {
        return null;
    }

    const segments = pathname.split("/").filter(Boolean);

    return (
        <div className="bg-transparent">
            <nav
                aria-label="Breadcrumb"
                className="container mx-auto max-w-7xl px-4"
            >
                <ol role="list" className="flex items-center space-x-2 py-2">
                    <li>
                        <div>
                            <Button
                                href="/"
                                color="secondary"
                                variant="text"
                                sx={{
                                    // bgcolor: "#d3d7de",
                                    color: "#000000",
                                    px: 2,
                                    py: 0.5,
                                    textTransform: "none",
                                    fontWeight: 500,
                                    "&:hover": {
                                        bgcolor: "#e5e7eb",
                                    },
                                }}
                            >
                                Home
                            </Button>
                        </div>
                    </li>
                    {segments.map((segment, index) => {
                        const href = `/${segments
                            .slice(0, index + 1)
                            .join("/")}`;
                        const isLast = index === segments.length - 1;

                        const displayName =
                            segment.length > 20
                                ? "Details"
                                : isRouteKey(segment)
                                ? routeMappings[segment]
                                : capitalize(segment);

                        return (
                            <li key={href}>
                                <div className="flex items-center">
                                    <ChevronRightIcon
                                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    {isLast ? (
                                        <span className="ml-2 text-sm font-semibold text-gray-800">
                                            {displayName}
                                        </span>
                                    ) : (
                                        <Button
                                            href={href}
                                            color="secondary"
                                            variant="text"
                                            sx={{
                                                // bgcolor: "#d3d7de",
                                                color: "#000000",
                                                px: 2,
                                                py: 0.5,
                                                textTransform: "none",
                                                fontWeight: 500,
                                                "&:hover": {
                                                    bgcolor: "#e5e7eb",
                                                },
                                            }}
                                        >
                                            {displayName}
                                        </Button>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
};
