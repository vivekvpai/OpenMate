import React from "react";
import CopyBox from "../components/CopyBox.jsx"

function Collections(){
    return(
        
        <>
        <div className="w-full flex flex-col mb-20">

        <div className=" font-inter text-6xl pl-8 pt-4 border-b-2 border-b-gray-900 w-full pb-4">
        <h1>Getting Started<span className="text-red-600">.</span></h1>
        </div>

        <div className="font-inter text-4xl pl-[37px] pt-8">
            <h2>Collections<span className="text-red-600">.</span></h2>
        </div>


        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[300] tracking-wide leading-10.5 pr-[37px]">
            <p>
                A collection is a group of related repositories that you can manage and open together.
            </p>
            <ul className="list-disc pl-8 mt-4 space-y-8">

            <li>
            <p>
            <h2 className="pt-8 font-[500]" id="add-c">{`Add.`}</h2>
            Creates a new collection or updates an existing one with a list of repository names. The repository names should be separated by commas with no spaces.
            </p>
            <CopyBox language={`Terminal`} code={`om add -c <name> <repo1,repo2,...>`} />
            </li>

            <li>
            <h2 className="pt-8 font-[500]" id="list-c">{`List.`}</h2>
            Use om list -c to see all your collections. Use om list {`<collection-name>`} to see a detailed list of the repositories inside a specific collection.
            <CopyBox language={`Terminal`} code={`om list <collection-name>`} />
            <CopyBox language={`Terminal`} code={`om list -c

#Collections:
┌─────┬──────────┬──────────┬───────────────────────────┐
│ #   │ Name     │ Repos    │ Repository Names          │
├─────┼──────────┼──────────┼───────────────────────────┤
│ 1   │ webapp   │ 2        │ api, web-client           │
└─────┴──────────┴──────────┴───────────────────────────┘`} />
            </li>
           
           <li>
            <h2 className="pt-8 font-[500]" id="update-c">{`Update.`}</h2>
            Overwrites the list of repositories in an existing collection.
           <CopyBox language={`Terminal`} code={`om update -c <name> <repo1,...>`} />
           </li>
           <li>
            <h2 className="pt-8 font-[500]" id="remove-c">{`Remove.`}</h2>
            Deletes a collection. This does not remove the individual repositories within it.
           <CopyBox language={`Terminal`} code={`om remove -c <name>`} />
           </li>
            </ul>
            
        </div>
        </div>
        </>
    )
}
export default Collections