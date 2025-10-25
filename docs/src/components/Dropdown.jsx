import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"

function Dropdown({ label, items }) {
  const [open, setOpen] = useState(false)
  const [maxHeight, setMaxHeight] = useState(0)
  const ulRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (ulRef.current) {
      setMaxHeight(ulRef.current.scrollHeight)
    }
  }, [items])

  return (
    <div className="w-full font-inter border-b-2 border-gray-900 pb-2">
      
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-2xl pt-2 pl-6 cursor-pointer transition-colors duration-300 flex justify-between items-center ${
          open ? "text-red-600" : "text-white"
        }`}
      >
        {label}
        <ChevronRight
          className={`transition-transform duration-500 ease-in-out ${
            open ? "rotate-90 text-red-600" : "rotate-0 text-white"
          }`}
          size={22}
        />
      </button>

      
      <ul
        ref={ulRef}
        className={`text-left overflow-hidden transition-all duration-500 ease-in-out pl-10`}
        style={{
          maxHeight: open ? `${maxHeight}px` : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        {items.map((item, i) => (
          <li
            key={i}
            onClick={() => {
              if (item.onClick) item.onClick()
              if (item.path) navigate(item.path)
            }}
            className="cursor-pointer py-2 text-lg text-white hover:text-red-600 transition-colors duration-300"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dropdown
