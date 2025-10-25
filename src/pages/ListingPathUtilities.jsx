import React from "react";
import CopyBox from "../components/CopyBox.jsx"

function ListingPathUtilities()
{
    return(
         <>
        <div className="w-full flex flex-col mb-20">

        <div className=" font-inter text-6xl pl-8 pt-4 border-b-2 border-b-gray-900 w-full pb-4">
        <h1>Getting Started<span className="text-red-600">.</span></h1>
        </div>


        <div className="font-inter text-4xl pl-[37px] pt-8">
            <h2>Listing & Path Utilities<span className="text-red-600">.</span></h2>
        </div>

        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[350] tracking-wide leading-10.5 pr-[37px]">
        <p>OpenMate provides commands to view your indexed projects.</p>
        <ul className="list-disc pl-8 mt-4 space-y-8">
            <li>
                <span className="font-[500]" id="list-l">om list</span>
                <p>
                    Displays a formatted table of all stored repositories and collections.
                    <CopyBox language={`Terminal`} code={`om list

#Example Output->

Stored repos:
┌─────┬────────────────┬──────────────────────────────────┐
│ #   │ Name           │ Repo Path                        │
├─────┼────────────────┼──────────────────────────────────┤
│ 1   │ api-gateway    │ C:/Users/vivek/projects/api      │
│ 2   │ frontend-app   │ C:/Users/vivek/projects/frontend │
└─────┴────────────────┴──────────────────────────────────┘

Collections:
┌─────┬──────────────┬──────────┬───────────────────────────┐
│ #   │ Name         │ Repos    │ Repository Names          │
├─────┼──────────────┼──────────┼───────────────────────────┤
│ 1   │ main-project │ 2        │ api-gateway, frontend-app │
└─────┴──────────────┴──────────┴───────────────────────────┘`} />
                </p>
            </li>
            <li>
                <span className="font-[500]" id="list-r-c">om list -r / om list -c</span>
                <p>
                    Use the -r flag to list only repositories or the -c flag to list only collections.
                    <CopyBox language={`Terminal`} code={`om list -r

#Example Output-> 

Stored Repositories:
┌─────┬────────────────┬──────────────────────────────────┐
│ #   │ Name           │ Repo Path                        │
├─────┼────────────────┼──────────────────────────────────┤
│ 1   │ api-gateway    │ C:/Users/vivek/projects/api      │
│ 2   │ frontend-app   │ C:/Users/vivek/projects/frontend │
└─────┴────────────────┴──────────────────────────────────┘`} />
                    <CopyBox language={`Terminal`} code={`om list -c

#Example Output-> 

Collections:
┌─────┬──────────────┬──────────┬───────────────────────────┐
│ #   │ Name         │ Repos    │ Repository Names          │
├─────┼──────────────┼──────────┼───────────────────────────┤
│ 1   │ main-project │ 2        │ api-gateway, frontend-app │
└─────┴──────────────┴──────────┴───────────────────────────┘
`} />
                </p>
            </li>
            <li>
                <span className="font-[500]" id="path-l">{`om path <name>`}</span>
                <p>
                    Prints the stored file path for a given repository. This is useful for scripting or for quickly copying a project's location.
                </p>
                <CopyBox language={`Terminal`} code={`om path my-api`} />
            </li>
            <li>
                <span className="font-[500]" id="smart-suggestions">Smart Suggestions</span>
                <p>
                    If you try to open a project with a partial name, OpenMate will show you suggestions for repositories and collections that match.
                </p>
                <CopyBox language={`Terminal`} code={`om vs my-ap`} />
            </li>
        </ul>
        </div>
        </div>
        </>
    )
}
export default ListingPathUtilities