import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Props interface for dropdown menu items
interface DropdownMenuItemProps {
  icon: string;
  title: string;
  description: string;
  to: string;
  iconBasePath?: string;
}

// Create separate component for dropdown menu items
<<<<<<< HEAD
const DropdownMenuItem = ({ icon, title, description, to, iconBasePath = "/img/" }: DropdownMenuItemProps) => (
  <Link to={to} className="px-3 py-3 border-b-1 mb-5 border-gray-400 group text-sm hover:bg-[#6FCF97] hover:rounded-sm flex items-center justify-between group first:mt-0">
=======
const DropdownMenuItem = ({
  icon,
  title,
  description,
  to,
  iconBasePath = "/img/",
}: DropdownMenuItemProps) => (
  <Link
    to={to}
    className="px-3 py-3 border-b-1 mb-5 border-gray-400 group text-sm hover:bg-[#6FCF97] hover:rounded-sm flex items-center justify-between group first:mt-0"
  >
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
    <div className="flex items-center gap-5">
      <img src={`${iconBasePath}${icon}`} alt="" className="w-6" />
      <div>
        <p className="font-semibold">{title}</p>
<<<<<<< HEAD
        <p className="text-xs font-extralight text-gray-300 group-hover:text-white">{description}</p>
      </div>
    </div>
    <svg className="w-4 h-4 ml-1 transition-transform duration-200 -rotate-90 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
=======
        <p className="text-xs font-extralight text-gray-300 group-hover:text-white">
          {description}
        </p>
      </div>
    </div>
    <svg
      className="w-4 h-4 ml-1 transition-transform duration-200 -rotate-90 opacity-0 group-hover:opacity-100"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      ></path>
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
    </svg>
  </Link>
);

// Props interface for dropdown menu
interface DropdownMenuProps {
  isOpen: boolean;
  title: string;
  items: {
    icon: string;
    title: string;
    description: string;
    to: string;
  }[];
  iconBasePath?: string;
}

// Create separate component for dropdown menus
<<<<<<< HEAD
const DropdownMenu = ({ isOpen, title, items, iconBasePath }: DropdownMenuProps) => {
=======
const DropdownMenu = ({
  isOpen,
  title,
  items,
  iconBasePath,
}: DropdownMenuProps) => {
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
  if (!isOpen) return null;

  return (
    <div className="absolute mt-7 w-80 bg-primary-green rounded-md shadow-lg py-1 z-50 p-2">
      <h1 className="px-3 py-3 font-semibold text-gray-300 text-md">{title}</h1>
      {items.map((item, index) => (
<<<<<<< HEAD
        <DropdownMenuItem key={index} icon={item.icon} title={item.title} description={item.description} to={item.to} iconBasePath={iconBasePath} />
=======
        <DropdownMenuItem
          key={index}
          icon={item.icon}
          title={item.title}
          description={item.description}
          to={item.to}
          iconBasePath={iconBasePath}
        />
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
      ))}
    </div>
  );
};

// Define dropdown arrow component
const DropdownArrow = ({ isOpen }) => (
<<<<<<< HEAD
  <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
=======
  <svg
    className={`w-4 h-4 ml-1 transition-transform duration-200 ${
      isOpen ? "rotate-180" : ""
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 9l-7 7-7-7"
    ></path>
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
  </svg>
);

// Interface for navbar item
interface NavItem {
  name: string;
  path?: string;
  dropdownKey?: string;
  hasDropdown: boolean;
}

// Interface for dropdown menu data
interface DropdownMenuData {
  [key: string]: {
    title: string;
    items: {
      icon: string;
      title: string;
      description: string;
      to: string;
    }[];
  };
}

// Main Navbar props interface
interface NavbarProps {
  navItems: NavItem[];
  dropdownMenus: DropdownMenuData;
  iconBasePath?: string;
  className?: string;
  containerClassName?: string;
  activeItemClassName?: string;
  defaultClassName?: string;
}

const Navbar = ({
  navItems,
  dropdownMenus,
  iconBasePath = "/img/",
  className = "xl:flex space-x-12 text-white hidden bg-primary-green w-fit text-sm p-2.5 rounded-full",
  containerClassName = "px-40",
  activeItemClassName = "",
  defaultClassName = "",
}: NavbarProps) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <div className={containerClassName}>
      <ul className={className}>
        {navItems.map((item) => (
          <li key={item.name} className="relative">
            {item.hasDropdown ? (
              <>
<<<<<<< HEAD
                <button className={`flex items-center focus:outline-none cursor-pointer ${openDropdown === item.dropdownKey ? activeItemClassName : defaultClassName}`} onClick={() => toggleDropdown(item.dropdownKey)}>
=======
                <button
                  className={`flex items-center focus:outline-none cursor-pointer ${
                    openDropdown === item.dropdownKey
                      ? activeItemClassName
                      : defaultClassName
                  }`}
                  onClick={() => toggleDropdown(item.dropdownKey)}
                >
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
                  {item.name}
                  <DropdownArrow isOpen={openDropdown === item.dropdownKey} />
                </button>
                <DropdownMenu
                  isOpen={openDropdown === item.dropdownKey}
<<<<<<< HEAD
                  title={item.dropdownKey ? dropdownMenus[item.dropdownKey].title : ""}
                  items={item.dropdownKey ? dropdownMenus[item.dropdownKey]?.items : []}
=======
                  title={
                    item.dropdownKey
                      ? dropdownMenus[item.dropdownKey].title
                      : ""
                  }
                  items={
                    item.dropdownKey
                      ? dropdownMenus[item.dropdownKey]?.items
                      : []
                  }
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
                  iconBasePath={iconBasePath}
                />
              </>
            ) : (
              <Link to={item.path || "#"} className={defaultClassName}>
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
