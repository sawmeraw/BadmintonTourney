interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusStyles: { [key: string]: string } = {
    upcoming: "bg-blue-100 text-blue-800 ring-blue-600/20",
    ongoing: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
    completed: "bg-gray-200 text-gray-800 ring-gray-600/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ring-1 ring-inset ${
        statusStyles[status.toLowerCase()] || statusStyles.completed
      }`}
    >
      {status}
    </span>
  );
};