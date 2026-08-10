import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface SubItem {
  icon: string;
  title: string;
  description: string;
  to: string;
}

interface DropdownMenuItemData {
  icon: string;
  title: string;
  description: string;
  to: string;
  subItems?: SubItem[];
}

// ─── Sub-dropdown panel (appears to the right on hover) ───────────────────────

const SubDropdownPanel = ({
  items,
  iconBasePath = "/img/",
}: {
  items: SubItem[];
  iconBasePath?: string;
}) => (
  <div className="absolute left-full top-0 w-72 bg-primary-green rounded-md shadow-xl py-1 z-[70] p-2 pointer-events-auto">
    {items.map((item, idx) => (
      <Link
        key={idx}
        to={item.to}
        className="px-3 py-3 border-b border-gray-500 last:border-0 mb-1 last:mb-0 group text-sm hover:bg-[#6FCF97] hover:rounded-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <img src={`${iconBasePath}${item.icon}`} alt="" className="w-6 shrink-0" />
          <div>
            <p className="font-semibold text-white">{item.title}</p>
            <p className="text-xs font-extralight text-gray-300 group-hover:text-white">
              {item.description}
            </p>
          </div>
        </div>
        <svg
          className="w-4 h-4 ml-1 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
    ))}
  </div>
);

// ─── Single dropdown menu item ─────────────────────────────────────────────────

const DropdownMenuItem = ({
  icon,
  title,
  description,
  to,
  subItems,
  iconBasePath = "/img/",
}: DropdownMenuItemData & { iconBasePath?: string }) => {
  const hasSubItems = subItems && subItems.length > 0;

  if (hasSubItems) {
    // Hover-based sub-dropdown: NOT clickable, only shows sub-dropdown on hover
    return (
      <div className="relative group/subitem mb-5">
        {/* Trigger row: NOT a link, only shows sub-dropdown on hover */}
        <div className="px-3 py-3 border-b border-gray-500 text-sm group-hover/subitem:bg-[#6FCF97] group-hover/subitem:rounded-sm flex items-center justify-between cursor-default">
          <div className="flex items-center gap-4">
            <img src={`${iconBasePath}${icon}`} alt="" className="w-6 shrink-0" />
            <div>
              <p className="font-semibold text-white">{title}</p>
              <p className="text-xs font-extralight text-gray-300 group-hover/subitem:text-white">
                {description}
              </p>
            </div>
          </div>
          {/* Arrow pointing right → indicates sub-menu */}
          <svg
            className="w-4 h-4 ml-1 shrink-0 text-gray-300 group-hover/subitem:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Sub-dropdown: hidden by default, shown on group hover */}
        <div className="absolute left-full top-0 hidden group-hover/subitem:block">
          <SubDropdownPanel items={subItems!} iconBasePath={iconBasePath} />
        </div>
      </div>
    );
  }


  // Plain link item
  return (
    <Link
      to={to}
      className="px-3 py-3 border-b border-gray-500 mb-5 last:mb-0 group text-sm hover:bg-[#6FCF97] hover:rounded-sm flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <img src={`${iconBasePath}${icon}`} alt="" className="w-6 shrink-0" />
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="text-xs font-extralight text-gray-300 group-hover:text-white">
            {description}
          </p>
        </div>
      </div>
      <svg
        className="w-4 h-4 ml-1 shrink-0 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </Link>
  );
};

// ─── Main dropdown panel ───────────────────────────────────────────────────────

interface DropdownMenuProps {
  isOpen: boolean;
  title: string;
  items: DropdownMenuItemData[];
  iconBasePath?: string;
}

const DropdownMenu = ({ isOpen, title, items, iconBasePath }: DropdownMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute mt-7 w-80 bg-primary-green rounded-md shadow-lg py-1 z-50 p-2">
      <h1 className="px-3 py-3 font-semibold text-gray-300 text-md">{title}</h1>
      {items.map((item, index) => (
        <DropdownMenuItem
          key={index}
          {...item}
          iconBasePath={iconBasePath}
        />
      ))}
    </div>
  );
};

// ─── Dropdown arrow ────────────────────────────────────────────────────────────

const DropdownArrow = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

// ─── Interfaces for Navbar ─────────────────────────────────────────────────────

interface NavItem {
  name: string;
  path?: string;
  dropdownKey?: string;
  hasDropdown: boolean;
}

interface DropdownMenuData {
  [key: string]: {
    title: string;
    items: DropdownMenuItemData[];
  };
}

interface NavbarProps {
  navItems: NavItem[];
  dropdownMenus: DropdownMenuData;
  iconBasePath?: string;
  className?: string;
  containerClassName?: string;
  activeItemClassName?: string;
  defaultClassName?: string;
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

const Navbar = ({
  navItems,
  dropdownMenus,
  iconBasePath = "/img/",
  className = "xl:flex space-x-12 text-white hidden bg-primary-green w-fit text-sm p-2.5 rounded-full",
  containerClassName = "px-40",
  activeItemClassName = "",
  defaultClassName = "",
}: NavbarProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={containerClassName} ref={navRef}>
      <ul className={className}>
        {navItems.map((item) => (
          <li key={item.name} className="relative">
            {item.hasDropdown ? (
              <>
                <button
                  className={`flex items-center focus:outline-none cursor-pointer ${
                    openDropdown === item.dropdownKey ? activeItemClassName : defaultClassName
                  }`}
                  onClick={() => toggleDropdown(item.dropdownKey!)}
                >
                  {item.name}
                  <DropdownArrow isOpen={openDropdown === item.dropdownKey} />
                </button>
                <DropdownMenu
                  isOpen={openDropdown === item.dropdownKey}
                  title={item.dropdownKey ? dropdownMenus[item.dropdownKey].title : ""}
                  items={item.dropdownKey ? dropdownMenus[item.dropdownKey]?.items ?? [] : []}
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
