import React, { useState } from "react";
import { Link } from "react-router-dom";

// Interface for dropdown menu items
interface DropdownMenuItemProps {
  icon: string;
  title: string;
  description: string;
  to: string;
  onClick?: () => void;
  iconBasePath?: string;
}

// Component for rendering submenu items
const SubMenuItem = ({
  icon,
  title,
  description,
  to,
  onClick,
  iconBasePath = "/img/",
}: DropdownMenuItemProps) => (
  <li>
    <Link
      to={to}
      className="px-3 py-3 text-sm flex items-center justify-between group"
      onClick={onClick}
    >
      <div className="flex items-center gap-5">
        <img src={`${iconBasePath}${icon}`} alt="" className="w-6 invert" />
        <div>
          <p>{title}</p>
          <p className="text-xs font-extralight">{description}</p>
        </div>
      </div>
    </Link>
  </li>
);

// Interface for dropdown toggle button
interface DropdownToggleProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
}

// Component for dropdown toggle button
const DropdownToggle = ({ title, isOpen, onClick }: DropdownToggleProps) => (
  <div
    className="py-4 flex justify-between items-center cursor-pointer"
    onClick={onClick}
  >
    <span className="font-medium">{title}</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 transition-transform duration-300 ${
        isOpen ? "transform rotate-180" : ""
      }`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);

// Interface for hamburger icon props
interface HamburgerIconProps {
  onClick: () => void;
  customClass?: string;
}

// Component for hamburger icon
const HamburgerIcon = ({ onClick, customClass = "" }: HamburgerIconProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col justify-center items-center cursor-pointer w-10 h-10 xl:hidden focus:outline-none transition-all duration-300 border-1 shadow-sm ${customClass}`}
    aria-label="Menu"
  >
    <span className="block w-6 h-0.5 bg-white transition-transform mb-1.5"></span>
    <span className="block w-6 h-0.5 bg-white transition-opacity mb-1.5"></span>
    <span className="block w-6 h-0.5 bg-white transition-transform"></span>
  </button>
);

// Interface for close button props
interface CloseButtonProps {
  onClick: () => void;
  customClass?: string;
}

// Component for close button
const CloseButton = ({ onClick, customClass = "" }: CloseButtonProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col justify-center cursor-pointer items-center w-10 h-10 xl:hidden focus:outline-none transition-all duration-300 ${customClass}`}
    aria-label="Close Menu"
  >
    <span className="block w-6 h-0.5 bg-black transition-transform transform rotate-45 translate-y-1"></span>
    <span className="block w-6 h-0.5 bg-black opacity-0 mb-1"></span>
    <span className="block w-6 h-0.5 bg-black transition-transform transform -rotate-45 -translate-y-1"></span>
  </button>
);

// Interface for nav item
export interface NavItem {
  id: string;
  name: string;
  path?: string;
  dropdownKey?: string;
  hasDropdown: boolean;
}

// Interface for dropdown menu data
export interface DropdownMenuData {
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

// Main HamburgerMenu props interface
export interface HamburgerMenuProps {
  navItems: NavItem[];
  dropdownMenus: DropdownMenuData;
  logo?: string;
  title?: string;
  subtitle?: string;
  iconBasePath?: string;
  onMenuItemClick?: () => void;
  customClasses?: {
    container?: string;
    hamburgerButton?: string;
    closeButton?: string;
    logo?: string;
    title?: string;
    subtitle?: string;
    navContainer?: string;
    dropdownToggle?: string;
    subMenuItem?: string;
  };
}

const HamburgerMenu = ({
  navItems,
  dropdownMenus,
  logo,
  title,
  subtitle,
  iconBasePath = "/img/", // Keeping this default as it's commonly needed
  onMenuItemClick,
  customClasses = {},
}: HamburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Reset all dropdowns when closing the menu
    if (isOpen) {
      setOpenDropdowns({});
    }
    // Prevent scrolling on body when menu is open
    document.body.style.overflow = isOpen ? "auto" : "hidden";
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle menu item click
  const handleMenuItemClick = () => {
    toggleMenu();
    if (onMenuItemClick) {
      onMenuItemClick();
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <HamburgerIcon
        onClick={toggleMenu}
        customClass={customClasses.hamburgerButton}
      />

      {/* Fullscreen Menu */}
      <div
        className={`fixed inset-0 bg-white flex flex-col items-start z-40 transition-all duration-300 pt-6.5 px-5 md:px-10 overflow-y-auto xl:hidden ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none -translate-y-50"
        } ${customClasses.container || ""}`}
      >
        {/* Close button */}
        <CloseButton
          onClick={toggleMenu}
          customClass={customClasses.closeButton}
        />

        {/* University Logo and Title */}
        <div className="flex items-center mb-8 mt-10">
          <img
            src="/img/logo_uika.png"
            alt="Universitas Ibn Khaldun Logo"
            className="w-12 mr-4"
          />
          <div>
            <p className="text-green-600 text-sm font-medium">SIM Akademik</p>
            <h1 className="text-gray-900 text-xl font-bold">
              Universitas Ibn Khaldun
            </h1>
          </div>
        </div>

        <nav
          className={`w-full border-t border-gray-200 ${
            customClasses.navContainer || ""
          }`}
        >
          <ul className="w-full text-gray-800">
            {navItems.map((item) => (
              <li key={item.id} className="border-b border-gray-200">
                {item.hasDropdown ? (
                  <>
                    <DropdownToggle
                      title={item.name}
                      isOpen={openDropdowns[item.id] || false}
                      onClick={() => toggleDropdown(item.id)}
                    />

                    {openDropdowns[item.id] &&
                      item.dropdownKey &&
                      dropdownMenus[item.dropdownKey] && (
                        <ul className="ml-4 mb-3 space-y-2 text-gray-600">
                          {dropdownMenus[item.dropdownKey].items.map(
                            (subItem, idx) => (
                              <SubMenuItem
                                key={idx}
                                icon={subItem.icon}
                                title={subItem.title}
                                description={subItem.description}
                                to={String(subItem.to)}
                                onClick={handleMenuItemClick}
                                iconBasePath={iconBasePath}
                              />
                            )
                          )}
                        </ul>
                      )}
                  </>
                ) : (
                  <Link
                    to={item.path || "#"}
                    className="py-4 flex justify-between items-center"
                    onClick={handleMenuItemClick}
                  >
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenu;
