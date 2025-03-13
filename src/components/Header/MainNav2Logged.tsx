import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { FC, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { searchProducts } from "../../features/product/productSlice";
import Logo from "../../shared/Logo/Logo";
import MenuBar from "../../shared/MenuBar/MenuBar";
import Navigation from "../../shared/Navigation/Navigation";
import { AppDispatch } from "../../store";
import { Product } from "../../types";
import Prices from "../Prices";
import AvatarDropdown from "./AvatarDropdown";
import CartDropdown from "./CartDropdown";

export interface MainNav2LoggedProps { }

const MainNav2Logged: FC<MainNav2LoggedProps> = () => {
  const inputRef = React.createRef<HTMLInputElement>();
  const [showSearchForm, setShowSearchForm] = useState(false);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const results = await dispatch(searchProducts(searchTerm)).unwrap();
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchTerm, dispatch]);

  const renderMagnifyingGlassIcon = () => {
    return (
      <svg
        width={22}
        height={22}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 22L20 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const renderSearchResults = () => {
    return (
      <ul className="absolute bg-white dark:bg-neutral-900 w-full mt-2 rounded shadow-lg">
        {searchResults.slice(0,5).map((product, index) => (
          <div key={index} className="relative flex py-4 first:pt-0 last:pb-3">
            <div className="relative h-32 w-5 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
              <img
                src={product?.productImages[0]?.image || "/default-image.jpg"}
                alt={product?.name || "Product Image"}
                className="h-full w-full object-contain object-center"
              />
            </div>
            <Link to={`/cua-hang/${product?.id}`} onClick={() => {
              setShowSearchForm(false)
              setSearchTerm("")
            }}>

              <div className="ml-3 sm:ml-6 flex flex-1 flex-col mt-1">

                <div className="flex-[1.5] ">
                  <h3 className="text-base font-semibold">
                    {product?.name}
                  </h3>
                </div>

                <div className="flex mt-1">
                  <Prices price={product?.salePrice || product?.price} className="mt-0.5" />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </ul>
    );
  };

  const renderSearchForm = () => {
    return (
      <>
        <div className="relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
               
            }}
            className="flex-1 py-2 text-slate-900 dark:text-slate-100"
          >
            <div className="bg-slate-50 dark:bg-slate-800 flex items-center space-x-1.5 px-5 h-full rounded">
              {renderMagnifyingGlassIcon()}
              <input
                ref={inputRef}
                type="text"
                placeholder="Gõ để tìm kiếm"
                className="border-none bg-transparent focus:outline-none focus:ring-0 w-full text-base"
                autoFocus
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="button" onClick={() => setShowSearchForm(false)}>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <input type="submit" hidden value="" />
          </form>
          {searchResults.length > 0 && renderSearchResults()}
        </div>
      </>
    );
  };

  const renderContent = () => {
    return (
      <div className="h-20 flex justify-between">
        <div className="flex items-center lg:hidden flex-1">
          <MenuBar />
        </div>

        <div className="lg:flex-1 flex items-center">
          <Logo className="flex-shrink-0" />
        </div>

        <div className="flex-[2] hidden lg:flex justify-center mx-4">
          {showSearchForm ? renderSearchForm() : <Navigation />}
        </div>

        <div className="flex-1 flex items-center justify-end text-slate-700 dark:text-slate-100">
          {!showSearchForm && (
            <button
              className="hidden lg:flex w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none items-center justify-center"
              onClick={() => setShowSearchForm(!showSearchForm)}
            >
              {renderMagnifyingGlassIcon()}
            </button>
          )}
          <AvatarDropdown />
          <CartDropdown />
        </div>
      </div>
    );
  };

  return (
    <div className="nc-MainNav2Logged relative z-10 bg-white dark:bg-neutral-900 border-b border-slate-100 dark:border-slate-700">
      <div className="container ">{renderContent()}</div>
    </div>
  );
};

export default MainNav2Logged;
