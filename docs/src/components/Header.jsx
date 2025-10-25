import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/public/logo.png";
function Header(){
    return(
        <header className="sticky top-0 inset-x-0 z-50  w-screen flex mx-auto justify-between border-b border-b-gray-900 h-15 backdrop-blur-md ">
        <Link to="/">
  <img src={logo} alt="" className="h-10 w-auto ml-6 mt-2" />
    </Link>
  
    <div className="flex font-inter text-lg">
  <nav className="flex my-auto  ">
    <a href="#" className=" font-medium text-red-600 hover:font-medium px-8">
        DOCS
    </a>
    
    
  </nav>
    </div>
</header>
    )
}

export default Header