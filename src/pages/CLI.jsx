import React from "react";
import CopyBox from "../components/CopyBox.jsx"

function CLI()
{
    
    
    return(
        <>
        <div className="w-full flex flex-col mb-20">

        <div className=" font-inter text-6xl pl-8 pt-4 border-b-2 border-b-gray-900 w-full pb-4">
        <h1>Command Reference<span className="text-red-600">.</span></h1>
        </div>

        <div className="font-inter text-4xl pl-[37px] pt-8">
            <h2 id="commands">CLI Commands<span className="text-red-600">.</span></h2>
        </div>

        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[300] tracking-wide leading-10.5 pr-[37px]">
            <p className="pb-8">
                This section provides a detailed reference for all available om commands.
            </p>
<div className="space-y-18">

            <p>
                <h2 id="init-cli"><span className="font-[500]">{`1)`} Initialization.</span></h2>
                <p>
                    Initializes the current directory as a repository.
                    <CopyBox language={`Terminal`} code={`om init <name>`} />
                </p>

            </p>
            <p>
                <h2 id="add-cli"><span className="font-[500]">{`2)`} Add.</span></h2>
                <p>
                    Adds a new repository or a new collection.
                </p>
                <p>
                    <span className="font-[500]">Repo Syntax</span>
                </p>
                <CopyBox language={`Terminal`} code={`om add <name> "<path/to/repo>"`} />
                <p>
                    <span className="font-[500]">Collection Syntax</span>
                </p>
                <CopyBox language={`Terminal`} code={`om add -c <name> <repo1,repo2,...>`} />
                <p>
                    <span className="font-[500]">Flags:</span> -c to specify that you are updating a collection.
                </p>

            </p>
            <p>
                <h2 id="update-cli"><span className="font-[500]">{`3)`} Update.</span></h2>
                <p>
                    Updates the path of an existing repository or the contents of a collection.
                </p>
                <p>
                    <span className="font-[500]">Repo Syntax</span>
                </p>
                <CopyBox language={`Terminal`} code={`om update <name> "<new/path>"`} />
                <p>
                    <span className="font-[500]">Collection Syntax</span>
                </p>
                <CopyBox language={`Terminal`} code={`om update -c <name> <repo1,repo2,...>`} />
                <p>
                    <span className="font-[500]">Flags:</span> -c to specify that you are updating a collection.
                </p>
            </p>
            <p>
                <h2 id="remove-cli"><span className="font-[500]">{`4)`} Remove.</span></h2>
                <p>
                    Removes a stored repository or collection.
                </p>
                <p>
                    <span className="font-[500]">Repo Syntax</span>
                </p>
                <CopyBox language={`Terminal`} code={`om remove <name>`} />
                <p>
                    <span className="font-[500]">Collection Syntax</span>
                </p>
                <CopyBox language={`Terminal`} code={`om remove -c <name>`} />
                <p>
                    <span className="font-[500]">Flags:</span> -c to specify that you are updating a collection.
                </p>
            </p>
            <p>
                <h2 id="list-cli"><span className="font-[500]">{`5)`} List.</span></h2>
                <p>
                    Lists all stored repositories and collections, or filters the list.
                </p>
                <p>
                    <span className="font-[500]">Syntax</span>
                </p>
                <CopyBox language={`Terminal`} code={`om list`} />
                <p>
                    <span className="font-[500]">OR</span>
                </p>
                <CopyBox language={`Terminal`} code={`om list <collection-name>`} />
                
                <p>
                    <span className="font-[500]">Flags:</span> 
                </p>
                <ul className="list-disc pl-8 mt-4 space-y-3">
                    <li>
                        -r: List only repositories.
                    </li>
                    <li>
                        -c: List only collections.
                    </li>
                </ul>
            </p>
                <p>
                <h2 id="path-cli"><span className="font-[500]">{`6)`} Path.</span></h2>
                <p>
                    Prints the stored path of a repository.
                    <CopyBox language={`Terminal`} code={`om path <name>`} />
                </p>

                </p>

                <p>
                <h2 id="repos-cli"><span className="font-[500]">{`7)`} Opening repos on editors.</span></h2>
                <p>
                    <span className="font-[500]">Editors:</span>
                    <ul className="list-disc pl-8 mt-4 space-y-3">
                        <li>
                            <span className="font-[375]">VScode.</span>
                            <CopyBox language={`Terminal`} code={`om vs <name>`} />
                        </li>
                        <li>
                            <span className="font-[375]">WindSurf.</span>
                            <CopyBox language={`Terminal`} code={`om ws <name>`} />
                        </li>
                        <li>
                            <span className="font-[375]">Cursor.</span>
                            <CopyBox language={`Terminal`} code={`om cs <name>`} />
                        </li>
                        <li>
                            <span className="font-[375]">IntelliJ IDEA.</span>
                            <CopyBox language={`Terminal`} code={`om ij <name>`} />
                        </li>
                        <li>
                            <span className="font-[375]">PyCharm.</span>
                            <CopyBox language={`Terminal`} code={`om pc <name>`} />
                        </li>
                    
                    </ul>
                </p>

                </p>
            
</div>
        </div>
        </div>
        
        
        </>
    )
}
export default CLI