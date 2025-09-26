export const FormLabel = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium leading-6 text-gray-900">
    {children}
  </label>
);

