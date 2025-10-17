import { useState } from "react";

export default function Tooltip({ children, text, position = "top" }) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      <div
        className={`absolute ${positionClasses[position]} pointer-events-none w-max rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs text-white shadow-lg transition-all duration-200 ease-out ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-95 opacity-0"}`}
      >
        {text}
      </div>
    </div>
  );
}
