export const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Tourney. All rights reserved.</p>
      </div>
    </footer>
  );
};