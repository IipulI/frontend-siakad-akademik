import ProfileLogo from "../../public/img/profile_logo.png";
import Navbar from "./Navbar";
import HamburgerMenu from "./HamburgerMenu";

const Header = () => {
  return (
    <div className="bg-primary-green text-white py-4 w-full absolute top-0 z-40 xl:h-30 items-center px-5 md:px-10">
      {/* aksesoris navbar */}
      <img
        src="/img/aksesoris_navbar.png"
        alt=""
        className="h-full absolute right-0 top-0 bottom-0"
      />

      <div className="container mx-auto max-w-6xl">
        <div className="w-full py-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              {/* menu hamburger */}
              <HamburgerMenu />
              {/* logo */}
              <img
                className="bg-white p-1 rounded-lg hidden md:block"
                width={50}
                src="/img/logo_uika.png"
                alt=""
              />
              <div>
                <div>
                  <h1 className="text-xs sm:text-sm">SIM Akademik</h1>
                  <h1 className="font-semibold text-sm sm:text-md">
                    Universitan Ibn Khaldun
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex space-x-4 items-center">
              <h1>Bel</h1>
              <img className="rounded-full" width={30} src={ProfileLogo} />
            </div>
          </div>
        </div>
        <Navbar />
      </div>
    </div>
  );
};

export default Header;
