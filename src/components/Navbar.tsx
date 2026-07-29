import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Props interface for dropdown menu sub-items (level 2)
interface DropdownSubItemProps {
  title: string;
  description: string;
  to: string;
}

// Props interface for dropdown menu items (level 1)
interface DropdownMenuItemProps {
  title: string;
  description: string;
  to?: string;
  children?: DropdownSubItemProps[];
}

// Create component for dropdown sub-menu items (level 2)
const DropdownSubMenuItem = ({
  title,
  description,
  to,
}: DropdownSubItemProps) => (
  <Link
    to={to}
    className="px-3 py-2.5 text-sm hover:bg-[#6FCF97] hover:rounded-sm flex items-center justify-between group"
  >
    <div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs font-extralight text-gray-300 group-hover:text-white">
        {description}
      </p>
    </div>
  </Link>
);

// Create separate component for dropdown menu items
const DropdownMenuItem = ({
  title,
  description,
  to,
  children,
}: DropdownMenuItemProps) => {
  const [isSubOpen, setIsSubOpen] = useState(false);
  const hasChildren = children && children.length > 0;

  // If item has children, render as a hoverable parent with sub-menu
  if (hasChildren) {
    return (
      <div
        className="relative border-b-1 mb-1 last:border-b-0 last:mb-0 border-gray-400"
        onMouseEnter={() => setIsSubOpen(true)}
        onMouseLeave={() => setIsSubOpen(false)}
      >
        <div
          className={`px-3 py-3 group text-sm flex items-center justify-between cursor-pointer ${
            isSubOpen ? "bg-[#6FCF97] rounded-sm" : "hover:bg-[#6FCF97] hover:rounded-sm"
          }`}
        >
          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-xs font-extralight text-gray-300 group-hover:text-white">
              {description}
            </p>
          </div>
          {/* Arrow pointing right to indicate sub-menu */}
          <svg
            className="w-4 h-4 ml-1 transition-transform duration-200 -rotate-90"
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
          </svg>
        </div>

        {/* Sub-menu (level 2) */}
        {isSubOpen && (
          <div className="absolute left-full top-0 ml-1 w-72 bg-primary-green rounded-md shadow-lg px-2 pt-3 pb-3 z-[60]">
            {children.map((subItem, index) => (
              <DropdownSubMenuItem
                key={index}
                title={subItem.title}
                description={subItem.description}
                to={subItem.to}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Regular item without children (original behavior)
  return (
    <Link
      to={to || "#"}
      className="px-3 py-3 border-b-1 mb-1 last:border-b-0 last:mb-0 border-gray-400 group text-sm hover:bg-[#6FCF97] hover:rounded-sm flex items-center justify-between first:mt-0"
    >
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-xs font-extralight text-gray-300 group-hover:text-white">
          {description}
        </p>
      </div>
    </Link>
  );
};

// Props interface for dropdown menu
interface DropdownMenuProps {
  isOpen: boolean;
  items: {
    title: string;
    description: string;
    to?: string;
    children?: {
      title: string;
      description: string;
      to: string;
    }[];
  }[];
}

// Create separate component for dropdown menus
const DropdownMenu = ({ isOpen, items }: DropdownMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute mt-7 w-80 bg-primary-green rounded-md shadow-lg px-2 pt-3 pb-3 z-50">
      {items.map((item, index) => (
        <DropdownMenuItem
          key={index}
          title={item.title}
          description={item.description}
          to={item.to}
          children={item.children}
        />
      ))}
    </div>
  );
};

// Define dropdown arrow component
const DropdownArrow = ({ isOpen }) => (
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
      to?: string;
      children?: {
        icon: string;
        title: string;
        description: string;
        to: string;
      }[];
    }[];
  };
}

// Main Navbar props interface
interface NavbarProps {
  navItems: NavItem[];
  dropdownMenus: DropdownMenuData;
  className?: string;
  containerClassName?: string;
  activeItemClassName?: string;
  defaultClassName?: string;
}

const Navbar = ({
  navItems,
  dropdownMenus,
  className = "xl:flex space-x-6 text-white hidden bg-primary-green w-fit text-sm p-2.5 rounded-full",
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
                <button
                  className={`flex items-center focus:outline-none cursor-pointer ${
                    openDropdown === item.dropdownKey
                      ? activeItemClassName
                      : defaultClassName
                  }`}
                  onClick={() => toggleDropdown(item.dropdownKey)}
                >
                  {item.name}
                  <DropdownArrow isOpen={openDropdown === item.dropdownKey} />
                </button>
                <DropdownMenu
                  isOpen={openDropdown === item.dropdownKey}
                  items={
                    item.dropdownKey
                      ? dropdownMenus[item.dropdownKey]?.items
                      : []
                  }
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
