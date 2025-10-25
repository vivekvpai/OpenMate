import React from "react";
import CopyBox from "../components/CopyBox.jsx"

function AddingRemovingRepositories()
{
    return(
        <>
        <div className="w-full flex flex-col min-h-screen mb-20">

        <div className=" font-inter text-6xl pl-8 pt-4 border-b-2 border-b-gray-900 w-full pb-4">
        <h1>Getting Started<span className="text-red-600">.</span></h1>
        </div>

        <div className="font-inter text-4xl pl-[37px] pt-8">
            <h2>Adding/Removing Repositories<span className="text-red-600">.</span></h2>
        </div>

        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[350] tracking-wide leading-10.5 pr-[37px]">
            <p>
            You can manage your repositories from any directory using the add, remove, and update commands.
            </p>

            <h2 className="pt-8 font-[500]" id="add">{`1)`} Add.</h2>
            <p>
                Use the following commad to add a repository without navigating into its directory first. 
                This is useful for adding multiple projects quickly.
            </p>
            <CopyBox language={`Terminal`} code={`om add my-api "/Users/dev/projects/my-api"`} />

            <h2 className="pt-8 font-[500]" id="remove">{`2)`} Remove.</h2>
            <p>
                Use this to delete a repository from the OpenMate index. 
                This does not affect the actual project files on your disk.
            </p>
            <CopyBox language={`Terminal`} code={`om remove my-api`} />

            <h2 className="pt-8 font-[500]" id="update">{`3)`} Update.</h2>
            <p>
                Use this to change the stored path for an existing repository if you move the project folder to a new location.
            </p>
            <CopyBox language={`Terminal`} code={`om update my-api "/Users/dev/new-location/my-api"`} />

            <h2 className="pt-8 font-[500]" id="recommended-prac">Recommended practice:</h2>
            <p className="pt-8">
            <ul className="list-disc pl-8 mt-4 space-y-8">
            <li>
            Naming: Use short, lowercase, and hyphenated names (e.g., client-app, admin-portal) for easy typing.
            </li>
            <li>
            Paths: Always use absolute paths to avoid ambiguity. On Windows, enclose paths in double quotes.
            </li>
            </ul>
            </p>
        </div>
    
    </div>
    </>
    )
}

export default AddingRemovingRepositories