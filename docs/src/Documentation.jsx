import React from "react";
import Header from "./components/Header.jsx";
import { Routes, Route, useLocation,Navigate } from "react-router-dom";
import Dropdown from "./components/Dropdown.jsx";
import RightSidebar from "./components/RightSidebar.jsx";
import WhatIsOpenMate from "./pages/WhatIsOpenMate.jsx";
import HowDoesItWork from "./pages/HowDoesItWork.jsx";
import Installation from "./pages/Installation.jsx";
import ListingPathUtilities from "./pages/ListingPathUtilities.jsx";
import AddingRemovingRepositories from "./pages/AddingRemovingRepositories.jsx";
import OpeningProjectsEditors from "./pages/OpeningProjectsEditors.jsx";
import Collections from "./pages/Collections.jsx";
import Initialization from "./pages/Initialization.jsx";
import CLI from "./pages/CLI.jsx";
import DataFileStorageFormat from "./pages/DataFileStorageFormat.jsx";
import { rightSideBarConfig } from "./components/rightSideBarConfig.js";
import Footer from "./components/Footer.jsx"
function Documentation() {
  return (
    <>
      <Header />
      <AppBody />
      <Footer />
    </>
  );
}

function AppBody() {
  const location = useLocation();
  const sidebarData = rightSideBarConfig[location.pathname];

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <div className="flex w-1/5 h-screen flex-col justify-start items-start font-inter">
        <Dropdown
          label="Introduction"
          items={[
            { label: "What is OpenMate?", path: "/docs/what-is-openmate" },
            { label: "How does it work?", path: "/docs/how-does-it-work" },
          ]}
        />
        <Dropdown
          label="Getting Started"
          items={[
            { label: "Installation", path: "/docs/installation" },
            { label: "Initialization", path: "/docs/initialization" },
            { label: "Adding/Removing Repositories", path: "/docs/adding-removing-repositories" },
            { label: "Opening Projects/Editors", path: "/docs/opening-projects-editors" },
            { label: "Collections", path: "/docs/collections" },
            { label: "Listing & Path Utilities", path: "/docs/listing-path-utilities" },
          ]}
        />
        <Dropdown
          label="Reference"
          items={[
            { label: "CLI Commands", path: "/docs/cli-commands" },
            { label: "Data File / Storage Format", path: "/docs/data-file-storage-format" },
          ]}
        />
      </div>

      {/* Middle Content */}
      <div className="flex w-3/5 min-h-screen border-l-2 border-l-gray-900 border-r-2 border-r-gray-900" id="content-area">
        <Routes>
          <Route index element={<Navigate to="what-is-openmate" replace />} />
          <Route path="what-is-openmate" element={<WhatIsOpenMate />} />
          <Route path="how-does-it-work" element={<HowDoesItWork />} />
          <Route path="installation" element={<Installation />} />
          <Route path="initialization" element={<Initialization />} />
          <Route path="adding-removing-repositories" element={<AddingRemovingRepositories />} />
          <Route path="opening-projects-editors" element={<OpeningProjectsEditors />} />
          <Route path="collections" element={<Collections />} />
          <Route path="listing-path-utilities" element={<ListingPathUtilities />} />
          <Route path="cli-commands" element={<CLI />} />
          <Route path="data-file-storage-format" element={<DataFileStorageFormat />} />
        </Routes>
      </div>

      {/* Right Sidebar */}
      <div className="flex w-1/5 h-screen">
        {sidebarData ? (
          <RightSidebar title={sidebarData.title} links={sidebarData.links} />
        ) : (
          <RightSidebar title="Overview" links={[]} />
        )}
      </div>
    </div>
    
  );
}

export default Documentation;
