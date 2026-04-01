import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header>
      <nav className="flex items-center justify-between text-sm py-5 md:py-4 mb-5 border-b border-b-gray-400 w-[100%]">
        <img
          onClick={() => navigate("/")}
          className="w-40 md:w-44 cursor-pointer"
          src={assets.logo}
          alt="logo"
        />

        <ul className="hidden md:flex items-start gap-5 text-xs md:text-sm font-medium">
          <NavLink to="/">
            <li className="py-1">HOME</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/doctors">
            <li className="py-1">ALL DOCTORS</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/about">
            <li className="py-1">ABOUT</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
          <NavLink to="/contact">
            <li className="py-1">CONTACT</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
        </ul>

        <div className="flex items-center">
          {token && userData ? (
            <div className="relative">

              {/* Profile Button */}
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img
                  className="w-8 rounded-full"
                  src={userData.image}
                  alt="profile"
                />
                <img
                  className="w-2.5"
                  src={assets.dropdown_icon}
                  alt="dropdown"
                />
              </div>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 text-base font-medium text-gray-600 z-20">
                  <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg">
                    <p
                      onClick={() => {
                        navigate("/my-profile");
                        setShowDropdown(false);
                      }}
                      className="hover:text-black cursor-pointer"
                    >
                      My Profile
                    </p>

                    <p
                      onClick={() => {
                        navigate("/my-appointments");
                        setShowDropdown(false);
                      }}
                      className="hover:text-black cursor-pointer"
                    >
                      My Appointments
                    </p>

                    <p
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="hover:text-black cursor-pointer"
                    >
                      Logout
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-5 py-3 rounded-full font-light cursor-pointer hidden md:block"
            >
              Create Account
            </button>
          )}

          <img
            onClick={() => setShowMenu(true)}
            className="w-6 md:hidden ml-4"
            src={assets.menu_icon}
            alt="menu"
          />
          <div
            className={`${showMenu ? "fixed w-full" : "h-0 w-0"
              } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-full duration-300`}
          >
            <div className="flex items-center justify-between px-5 py-6">
              <img className="w-36" src={assets.logo} alt="logo" />
              <img
                className="w-7"
                onClick={() => setShowMenu(false)}
                src={assets.cross_icon}
                alt="cross"
              />
            </div>
            <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-md font-medium">
              <NavLink
                className="px-4 py-2 rounded inline-block"
                onClick={() => setShowMenu(false)}
                to="/"
              >
                HOME
              </NavLink>
              <NavLink
                className="px-4 py-2 rounded inline-block"
                onClick={() => setShowMenu(false)}
                to="/doctors"
              >
                ALL DOCTORS
              </NavLink>
              <NavLink
                className="px-4 py-2 rounded inline-block"
                onClick={() => setShowMenu(false)}
                to="/about"
              >
                ABOUT
              </NavLink>
              <NavLink
                className="px-4 py-2 rounded inline-block"
                onClick={() => setShowMenu(false)}
                to="/contact"
              >
                CONTACT
              </NavLink>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
