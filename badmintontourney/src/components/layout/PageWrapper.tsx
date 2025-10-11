import clsx from "clsx";

export const PageWrapper = ({
    children,
    classname,
}: {
    children: React.ReactNode;
    classname?: string;
}) => {
    return (
        <main
            className={clsx(
                "flex flex-col flex-grow container mx-auto max-w-7xl px-4 py-4",
                classname
            )}
        >
            {children}
        </main>
    );
};
