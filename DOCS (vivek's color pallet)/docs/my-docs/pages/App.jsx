import Docs from "./Documentation.jsx";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import { useState, useEffect } from "react";

function App() {
  const [theme, setTheme] = useState("light");

  // Apply theme to the document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-20 right-8 z-50 px-4 py-2 rounded font-inter shadow-lg"
        style={{ backgroundColor: "var(--primary-color)", color: "white" }}
      >
        Toggle Theme
      </button>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div
                className="overflow-x-hidden box-border scrollbar overflow-y-scroll"
                style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
              >
                {/* Header */}
                <header className="fixed top-0 inset-x-0 z-50 w-screen flex mx-auto justify-between border-b border-b-gray-800 h-15 backdrop-blur-md">
                  <h1 className="text-2xl my-auto ml-6 font-robotoslab">OpenMate</h1>
                  <div className="flex font-inter text-lg px-8">
                    <nav className="flex my-auto">
                      <Link
                        to="/docs"
                        className="font-medium hover:text-red-600 hover:font-medium"
                      >
                        DOCS
                      </Link>
                    </nav>
                  </div>
                </header>

                {/* Section 1 */}
                <section id="part-1" className="relative grid place-items-start min-h-screen px-6 py-[200px]">
                  <h1>
                    <span className="font-robotoslab text-9xl font-medium">OpenMate:</span>
                    <br /><br /><br />
                    <span className="font-inter text-4xl font-light ml-[10px]">
                      One-key access to any local project in your favorite
                      <span className="ml-[10px]">
                        editor<span className="text-red-600">.</span>
                      </span>
                    </span>
                  </h1>
                </section>

                {/* Section 2 */}
                <section id="part-2" className="px-6">
                  <h1 className="font-inter text-7xl">
                    What does OpenMate do<span className="text-red-600">?</span>
                  </h1>

                  {/* Feature #1 */}
                  <div className="py-20 border-t-2 border-t-gray-800">
                    <div className="flex">
                      <div className="w-1/3 flex font-inter text-7xl justify-center pt-3">
                        <span className="text-red-600">#</span>1
                      </div>
                      <div className="w-2/3 flex font-inter text-[32px]">
                        <p className="leading-relaxed font-light">
                          Save project folders under short names and open them instantly in your preferred IDE with simple CLI commands
                          <span className="text-red-600 font-bold">.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature #2 */}
                  <div className="py-20 border-t-2 border-t-gray-800">
                    <div className="flex">
                      <div className="w-2/3 flex font-inter text-[32px]">
                        <p className="leading-relaxed font-light">
                          Group related repositories into collections so entire stacks can be launched together with one command
                          <span className="text-red-600 font-bold">.</span>
                        </p>
                      </div>
                      <div className="w-1/3 flex font-inter text-7xl justify-center pt-3">
                        <span className="text-red-600">#</span>2
                      </div>
                    </div>
                  </div>

                  {/* Feature #3 */}
                  <div className="py-20 border-t-2 border-t-gray-800">
                    <div className="flex">
                      <div className="w-1/3 flex font-inter text-7xl justify-center pt-3">
                        <span className="text-red-600">#</span>3
                      </div>
                      <div className="w-2/3 flex font-inter text-[32px]">
                        <p className="leading-relaxed font-light">
                          Manage everything fast from the terminal: add, update, remove, list, print paths, and get smart suggestions for partial names
                          <span className="text-red-600 font-bold">.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature #4 */}
                  <div className="py-20 border-t-2 border-t-gray-800 border-b-2 border-b-gray-800">
                    <div className="flex">
                      <div className="w-2/3 flex font-inter text-[32px]">
                        <p className="leading-relaxed font-light">
                          Use the Windows desktop UI for the same workflow with search, default-editor selection, dark/light modes, and easy repo or collection editing
                          <span className="text-red-600 font-bold">.</span>
                        </p>
                      </div>
                      <div className="w-1/3 flex font-inter text-7xl justify-center pt-3">
                        <span className="text-red-600">#</span>4
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3 */}
                <section id="part-3" className="pt-72 px-6">
                  <h1 className="text-7xl font-inter">
                    Editor's supported<span className="text-red-600">:</span>
                  </h1>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center pt-30">
                    {/* VS Code */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 sm:w-24 md:w-28 lg:w-32 aspect-square rounded-3xl shadow-lg flex items-center justify-center p-2">
                        <img src="/vscode.svg" alt="VS Code" className="w-2/3 h-2/3 object-contain" />
                      </div>
                      <p className="font-inter text-2xl mt-3">
                        VS Code<span className="text-red-600 font-bold">.</span>
                      </p>
                    </div>
                    {/* WindSurf */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 sm:w-24 md:w-28 lg:w-32 aspect-square rounded-3xl shadow-lg flex items-center justify-center p-2">
                        <img src="/WS.svg" alt="WindSurf" className="w-2/3 h-2/3 object-contain" />
                      </div>
                      <p className="font-inter text-2xl mt-3">
                        WindSurf<span className="text-red-600 font-bold">.</span>
                      </p>
                    </div>
                    {/* PyCharm */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 sm:w-24 md:w-28 lg:w-32 aspect-square rounded-3xl shadow-lg flex items-center justify-center p-2">
                        <img src="/PyCharm_Icon.svg" alt="PyCharm" className="w-2/3 h-2/3 object-contain" />
                      </div>
                      <p className="font-inter text-2xl mt-3">
                        PyCharm<span className="text-red-600 font-bold">.</span>
                      </p>
                    </div>
                    {/* Cursor */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 sm:w-24 md:w-28 lg:w-32 aspect-square rounded-3xl shadow-lg flex items-center justify-center p-2">
                        <img src="/CUBE_2D_DARK.svg" alt="Cursor" className="w-2/3 h-2/3 object-contain" />
                      </div>
                      <p className="font-inter text-2xl mt-3">
                        Cursor<span className="text-red-600 font-bold">.</span>
                      </p>
                    </div>
                    {/* IntelliJ */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 sm:w-24 md:w-28 lg:w-32 aspect-square rounded-3xl shadow-lg flex items-center justify-center p-2">
                        <img src="/IntelliJ_IDEA_Icon.svg" alt="IntelliJ IDEA" className="w-2/3 h-2/3 object-contain" />
                      </div>
                      <p className="font-inter text-2xl mt-3">
                        IntelliJ IDEA<span className="text-red-600 font-bold">.</span>
                      </p>
                    </div>
                  </div>
                </section>
              </div>
              <Footer />
            </>
          }
        />
        <Route path="/docs/*" element={<Docs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
