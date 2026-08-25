import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface SubItem {
  icon?: string;
  title: string;
  description: string;
  to: string;
}

interface DropdownSubItemProps {
  title: string;
  description: string;
  to?: string;
  children?: DropdownSubItemProps[];
}

interface DropdownMenuItemData {
  icon?: string;
  title: string;
  description: string;
  to?: string;
  subItems?: SubItem[];
  children?: DropdownSubItemProps[];
}

// ─── Sub-dropdown panel for icon-based subItems (appears to the right on hover) ──

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
          {item.icon && (
            <img src={`${iconBasePath}${item.icon}`} alt="" className="w-6 shrink-0" />
          )}
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

// ─── Sub-menu item for children (level 2+, no icon, recursive) ─────────────────

const DropdownSubMenuItem = ({ title, description, to, children }: DropdownSubItemProps) => {
  const hasChildren = children && children.length > 0;

  if (hasChildren) {
    // Nested sub-dropdown: opens further to the right on hover
    return (
      <div className="relative group/nested">
        <div className="px-3 py-2.5 text-sm flex items-center justify-between cursor-default group-hover/nested:bg-[#6FCF97] group-hover/nested:rounded-sm">
          <div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs font-extralight text-gray-300 group-hover/nested:text-white">
              {description}
            </p>
          </div>
          <svg
            className="w-4 h-4 ml-1 shrink-0 transition-transform duration-200 -rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="absolute left-full top-0 ml-1 w-72 max-h-[70vh] overflow-y-auto bg-primary-green rounded-md shadow-lg px-2 pt-3 pb-3 z-[70] hidden group-hover/nested:block">
          {children!.map((child, index) => (
            <DropdownSubMenuItem key={index} {...child} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      to={to || "#"}
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
};

// ─── Single dropdown menu item ─────────────────────────────────────────────────

const DropdownMenuItem = ({
  icon,
  title,
  description,
  to,
  subItems,
  children,
  iconBasePath = "/img/",
}: DropdownMenuItemData & { iconBasePath?: string }) => {
  const hasSubItems = subItems && subItems.length > 0;
  const hasChildren = children && children.length > 0;

  if (hasSubItems) {
    // Hover-based sub-dropdown (icon variant): NOT clickable, only shows sub-dropdown on hover
    return (
      <div className="relative group/subitem mb-5">
        <div className="px-3 py-3 border-b border-gray-500 text-sm group-hover/subitem:bg-[#6FCF97] group-hover/subitem:rounded-sm flex items-center justify-between cursor-default">
          <div className="flex items-center gap-4">
            {icon && <img src={`${iconBasePath}${icon}`} alt="" className="w-6 shrink-0" />}
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

  if (hasChildren) {
    // Hover-based sub-dropdown (children variant, no icons)
    return (
      <div className="relative border-b-1 mb-1 last:border-b-0 last:mb-0 border-gray-400 group/subitem">
        <div className="px-3 py-3 group text-sm flex items-center justify-between cursor-default group-hover/subitem:bg-[#6FCF97] group-hover/subitem:rounded-sm">
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

        {/* Sub-menu (level 2+) — overflow must stay visible so nested flyouts (level 3+) aren't clipped */}
        <div className="absolute left-full top-0 ml-1 w-72 bg-primary-green rounded-md shadow-lg px-2 pt-3 pb-3 z-[60] hidden group-hover/subitem:block">
          {children!.map((subItem, index) => (
            <DropdownSubMenuItem key={index} {...subItem} />
          ))}
        </div>
      </div>
    );
  }

  // Plain link item
  return (
    <Link
      to={to || "#"}
      className="px-3 py-3 border-b border-gray-500 mb-1 last:mb-0 group text-sm hover:bg-[#6FCF97] hover:rounded-sm flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        {icon && <img src={`${iconBasePath}${icon}`} alt="" className="w-6 shrink-0" />}
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="text-xs font-extralight text-gray-300 group-hover:text-white">
            {description}
          </p>
        </div>
      </div>
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

const DropdownMenu = ({ isOpen, items, iconBasePath }: DropdownMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute mt-7 w-80 bg-primary-green rounded-md shadow-lg px-2 pt-3 pb-3 z-50">
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
  className?: string;
  containerClassName?: string;
  activeItemClassName?: string;
  defaultClassName?: string;
  iconBasePath?: string;
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

const Navbar = ({
  navItems,
  dropdownMenus,
  className = "xl:flex space-x-6 text-white hidden bg-primary-green w-fit text-sm py-2.5 px-6 rounded-full",
  containerClassName = "px-40",
  activeItemClassName = "",
  defaultClassName = "",
  iconBasePath = "/img/",
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
