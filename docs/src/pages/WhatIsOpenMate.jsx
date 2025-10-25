import React from "react";

function WhatIsOpenMate ()
{

    return(
        <>
        <div className="w-full flex flex-col mb-20">
        <div className=" font-inter text-6xl pl-8 pt-4 border-b-2 border-b-gray-900 w-full pb-4">
        <h1>INTRODUCTION<span className="text-red-600">.</span></h1>
        </div>
        <div className="font-inter text-4xl pl-[37px] pt-8">
        <h2 id="what-is-openmate?">What is <span className="font-robotoslab">OpenMate<span className="text-red-600 font-inter">?</span></span></h2>
        </div>
        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[350] tracking-wide leading-10.5 pr-[37px]">
            <p>OpenMate is a command-line interface (CLI) tool designed to streamline the workflow of developers
                who work with multiple local projects<span className="text-red-600">.</span> It provides a fast and simple way to manage your
                local project folders (referred to as "repositories") 
                and open them in your favourite code editors using quick shortcuts<span className="text-red-600">.</span> It supports VS Code,
                Windsurf, Cursor, IntelliJ IDEA, and PyCharm<span className="text-red-600">.</span></p>
        </div>
        </div>

        </>
    )
}
export default WhatIsOpenMate