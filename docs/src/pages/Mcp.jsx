import { Terminal } from "lucide-react"
import CopyBox from "../components/CopyBox"

function Mcp(){
return(
     <>
        <div className="w-full flex flex-col mb-20">

        <div className=" font-inter text-6xl pl-8 pt-4 border-b-2 border-b-gray-900 w-full pb-4">
        <h1>OpenMate MCP Server<span className="text-red-600">.</span></h1>
        </div>

        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[350] tracking-wide leading-10.5 pr-[37px]">
            <p>
                An MCP (Model Context Protocol) server for managing repositories and collections with OpenMate.
            </p>
            <p>
            <span className="text-red-600 font-bold">Note:</span> This MCP server works only when OpenMate CLI is installed.
            </p>
        </div>

        <div className="font-inter text-4xl pl-[37px] pt-8">
            <h2 id="features">Features.</h2>
        </div>
        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[350] tracking-wide leading-10.5 pr-[37px] ">
            <p className="font-[500]">Open repositories in your favorite editor:</p>
            <ul className="list-disc list-inside pl-10">
                <li>VS Code</li>
                <li>WindSurf</li>
                <li>Cursor</li>
                <li>Intellij IDEA</li>
                <li>PyCharm</li>
                <li>Antigravity</li>
            </ul>
        </div>
        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[350] tracking-wide leading-10.5 pr-[37px] ">
            <p className="font-[500]">Preferred editor support:</p>
            <ul className="list-disc list-inside pl-10">
                <li>Set a default IDE per repo or collection{`(om ide <name> <ide>)`}</li>
                <li>Open without specifying IDE → uses default {`(om d <name>)`}</li>
            </ul>
        </div>
        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[350] tracking-wide leading-10.5 pr-[37px] ">
            <p className="font-[500]">Repository management:</p>
            <ul className="list-disc list-inside pl-10">
                <li>Add a new repository</li>
                <li>List repositories</li>
                <li>Show repository path</li>
                <li>Remove repository</li>
            </ul>
        </div>
        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[350] tracking-wide leading-10.5 pr-[37px] ">
            <p className="font-[500]">Collection management:</p>
            <ul className="list-disc list-inside pl-10">
                <li>Add a collection</li>
                <li>Delete a collection</li>
                <li>List collection contents</li>
                <li>Add repo to collection</li>
                <li>Remove repo from collection</li>
                <li>Add common directory</li>
            </ul>
        </div>

         <div className="font-inter text-4xl pl-[37px] pt-8 pr-[37px]">
            <h2 id="installation">Installation.</h2>
            <CopyBox language={`Terminal`} code={`npm install -g openmate-mcp`} />
        </div>
         <div className="font-inter text-4xl pl-[37px] pt-8 pr-[37px]">
            <h2 id="use-with">Use with Claude Desktop / Windsurf / Cursor / Antigravity.</h2>
            <CopyBox language={`JSON`} code={`{
  "mcpServers": {
    "openmate": {
      "command": "openmate-mcp"
    }
  }
}
`} />
        </div>
        <div className="font-inter pl-[37px] pt-8 text-[22px] font-[350] tracking-wide leading-10.5 pr-[37px] ">
            <p className="font-[500]" id="Available Tools">Available Tools:</p>
            <ul className="list-disc list-inside pl-10">
                <li>list-repos: List all repositories and collections</li>
                <li>add-repo: Add a new repository</li>
                <li>get-repo: Get path of a repository</li>
                <li>remove-repo: Remove a repository</li>
                <li>add-collection: Add a collection</li>
                <li>delete-collection: Delete a collection</li>
                <li>list-collection: List collections</li>
                <li>set-ide: Set preferred IDE per repo or collection</li>
                <li>open-repo: Open a repository (IDE optional: default IDE if omitted)</li>
                <li>open-collection: Open all repos in a collection (IDE optional: default IDE if omitted)</li>
            </ul>
        </div>


        </div>
        </>
)
}
export default Mcp