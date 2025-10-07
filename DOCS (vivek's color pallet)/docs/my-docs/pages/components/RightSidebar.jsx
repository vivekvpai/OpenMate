export default function RightSidebar({ title, links }) {
  return (
    <div className="w-full p-4 text-sm text-gray-200 font-inter sticky top-0 h-screen overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2 w-full">
        {title}
      </h2>
      <ul className="space-y-2">
        {links.map((link, i) => (
          <li key={i}>
            <a
              href={link.href}
              className="cursor-pointer hover:text-blue-400 transition"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
