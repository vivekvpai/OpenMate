import { useLocation, useNavigate } from "react-router-dom";

export default function RightSidebar({ title, links, basePath }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    
    // Extract the anchor ID from link.href (e.g., "#what-is-openmate" -> "what-is-openmate")
    const anchorId = link.href.replace("#", "");
    
    // Navigate to the current page with the hash
    navigate(`${location.pathname}#${anchorId}`);
    
    // Scroll to the element
    setTimeout(() => {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  return (
    <div className="w-full p-4 text-sm text-white font-inter sticky top-0 h-screen overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2 w-full">
        {title}
      </h2>
      <ul className="space-y-2 text-[17px]">
        {links.map((link, i) => (
          <li key={i}>
            <a
              href={link.href}
              onClick={(e) => handleLinkClick(e, link)}
              className="cursor-pointer hover:text-red-600 transition"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
