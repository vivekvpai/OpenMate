import React from "react";
import CopyBox from "../components/CopyBox.jsx"

function OpeningProjectsEditors()
{
    return(
         <>
        <div className="w-full flex flex-col mb-20">

        <div className=" font-inter text-6xl pl-8 pt-4 border-b-2 border-b-gray-900 w-full pb-4">
        <h1>Getting Started<span className="text-red-600">.</span></h1>
        </div>

        <div className="font-inter text-4xl pl-[37px] pt-8">
            <h2>Opening Projects/Editors<span className="text-red-600">.</span></h2>
        </div>

        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[350] tracking-wide leading-10.5 pr-[37px]">
        <p>
            OpenMate uses specific subcommands to launch different editors.
        </p>

    <h2 id="vs-code" className="pt-8 font-[500]">{`1)`} VS Code.</h2>
    <CopyBox language={`Terminal`} code={`om vs <name>`} />

    <h2 id="wind-surf" className="pt-8 font-[500]">{`2)`} WindSurf.</h2>
    <CopyBox language={`Terminal`} code={`om ws <name>`} />

    <h2 id="cursor" className="pt-8 font-[500]">{`3)`} Cursor.</h2>
    <CopyBox language={`Terminal`} code={`om cs <name>`} />

    <h2 id="intellij-idea" className="pt-8 font-[500]">{`4)`} IntelliJ IDEA.</h2>
    <CopyBox language={`Terminal`} code={`om ij <name>`} />

    <h2 id="pycharm" className="pt-8 font-[500]">{`5)`} PyCharm.</h2>
    <CopyBox language={`Terminal`} code={`om pc <name>`} />

    <h2 id="how-editor-launching-works" className="pt-8 font-[500]">How Editor Launching Works:</h2>
            <p className="pt-8">
            <ul className="list-disc pl-8 mt-4 space-y-8">
                <li>
                    <span className="font-[500]">Windows:</span> Requires that the editor's command-line tool (e.g., code.exe, cursor.exe) 
                    is in your system's PATH.
                </li>
                <li>
                    <span className="font-[500]">MacOS:</span> Works out-of-the-box by using the open -a command,
                     as long as the editor is installed in the standard /Applications folder.
                </li>
            </ul>
            </p>

        </div>
        </div>
        </>
    )
}
export default OpeningProjectsEditors