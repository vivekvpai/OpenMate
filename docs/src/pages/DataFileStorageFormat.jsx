import React from "react";
import CopyBox from "../components/CopyBox.jsx"
function DataFileStorageFormat()
{
    return(
        <>
        <div className="w-full flex flex-col mb-20">

        <div className=" font-inter text-6xl pl-8 pt-4 border-b-2 border-b-gray-900 w-full pb-4">
        <h1>Command Reference<span className="text-red-600">.</span></h1>
        </div>

        <div className="font-inter text-4xl pl-[37px] pt-8">
            <h2 id="data-file">Data File Storage Format<span className="text-red-600">.</span></h2>
        </div>

        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[300] tracking-wide leading-10.5 pr-[37px]">
            <p>All data is stored in ~/.openmate/repos.json. The structure of this file is as follows:</p>
            <CopyBox language={`Terminal`} code={`{
  "repos": {
    "repo1": "C:\\Projects\\repo1",
    "repo2": "C:\\Projects\\repo2"
  },
  "collections": {
    "collection1": [
      "repo1",
      "repo2"
    ]
  }
}`} />
        <p>
            <ul className="list-disc pl-8 mt-4 space-y-3">
                <li>
                    <p><span className="font-[500]">repos:</span> An object where each key is the repository's alias and the
                     value is its absolute path.</p>
                </li>
                <li>
                    <p><span className="font-[500]">collections:</span> An object where each key is the collection's name 
                    and the value is an array of repository aliases included in that collection.</p>
                </li>
            </ul>
        </p>
        </div>
        </div>
        </>
    )
}
export default DataFileStorageFormat