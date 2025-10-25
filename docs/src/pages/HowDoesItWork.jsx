
import React from "react";

function HowDoesItWork()
{
    return(
        <>
        <div className="w-full flex flex-col mb-20">

        <div className=" font-inter text-6xl pl-8 pt-4 border-b-2 border-b-gray-900 w-full pb-4">
        <h1>INTRODUCTION<span className="text-red-600">.</span></h1>
        </div>

        <div className="font-inter text-4xl pl-[37px] pt-8">
            <h2 id="how-does-it-work?">How does it work<span className="text-red-600">?</span></h2>
        </div>

        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[300] tracking-wide leading-10.5 pr-[37px]">
            <p>
            OpenMate's architecture is straightforward and lightweight. Its core functionality relies on a few simple principles:
            <ul className="list-disc pl-8 mt-4 space-y-8">

            <li>
	        <span className="font-[500]">JSON Storage:</span> It stores all repository aliases and their corresponding file paths in a single JSON file located at ~/.openmate/repos.json. 
            This file acts as a simple database for all your projects.
            </li>

            <li>
	        <span className="font-[500]">System Command Integration:</span> To open an editor, OpenMate invokes system commands. 
            On Windows, it relies on the editor's CLI launcher (e.g., code, cursor) being available in the system's PATH.
            On macOS, it uses the native open -a {"<AppName>"} command to launch the application.
            </li>
            
            <li>
	        <span className="font-[500]">CLI Parser:</span> The om command parses your inputs to determine the desired action, such as adding a new repository,
            listing existing ones, or opening an editor.
            </li>
            </ul>
            </p>
        </div>

        </div>
        </>
    )
}

export default HowDoesItWork