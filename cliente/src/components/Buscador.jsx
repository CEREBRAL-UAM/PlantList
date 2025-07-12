import { Search } from "lucide-react";

export function Buscador({ onChange, placeholder, value }) {
  const manejadorCambios = (e) => {
    onChange(e.target.value);
  };

  return (
    <div
      className="
        flex w-1/2 
        text-end pr-10
         justify-end 
         items-center
    "
    >
      <div
        className="
          bg-pl_gray_input 
          rounded-2xl shadow-lg 
          w-1/2 flex pl-2 p-0.5 
          items-center
          dark:bg-pl_gray_dark_input
          dark:text-pl_white_a
        "
      >
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={manejadorCambios}
          className="w-full focus:outline-none"
        />

        <Search className="ml-2 mr-2 text-pl_green_b w-6 h-6 dark:text-pl_gray_input" />
      </div>
    </div>
  );
}
