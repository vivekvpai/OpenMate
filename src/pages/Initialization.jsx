import React from "react";
import CopyBox from "../components/CopyBox.jsx"

function Initialization()
{
    return(
        <>
        <div className="w-full flex flex-col mb-20">

        <div className=" font-inter text-6xl pl-8 pt-4 border-b-2 border-b-gray-900 w-full pb-4">
        <h1>Getting Started<span className="text-red-600">.</span></h1>
        </div>

        <div className="font-inter text-4xl pl-[37px] pt-8">
            <h2>Initialization<span className="text-red-600">.</span></h2>
        </div>

        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[350] tracking-wide leading-10.5 pr-[37px]">
            <p>
            The easiest way to add a project to OpenMate is to navigate into its directory and initialize it.
            The om init {`<name>`} command registers the current working directory as a new repository with the name you provide.
            </p>

            <h2 className="pt-8 font-[500]">Step-by-Step:</h2>
            <h2 className="pt-8 font-[500]" id="navigate">{`1)`} Open your terminal and navigate to your project folder: </h2>
            <CopyBox language={`Terminal`} code={`cd /path/to/my-project`} />

            <h2 className="pt-8 font-[500]" id="run-init">{`2)`} Run the init command with a short, memorable name: </h2>
            <CopyBox language={`Terminal`} code={`om init my-project`} />

            <h2 className="pt-8 font-[500]" id="confirmation">{`3)`} OpenMate will confirm that the repository has been added: </h2>
            <CopyBox language={`Terminal`} code={`Added "my-project" -> /path/to/my-project`} />

            <h2 className="pt-8 font-[500]" id="pitfalls">Common Pitfalls:</h2>
            <p className="pt-8">
                Name Conflicts, Repository names must be unique. 
                If you try to use a name that is already taken, the command will fail.
                Choose a distinct name for each project.
            </p>
        </div>
    
    </div>
    </>
    )
}

export default Initialization