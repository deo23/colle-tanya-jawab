"use client";

import Image from "next/image";

import { SignedIn, UserButton } from "@clerk/nextjs";

import Theme from "@/components/shared/navbar/Theme";
import Mobile from "@/components/shared/navbar/Mobile";
import GlobalSearch from "@/components/shared/search/GlobalSearch";

const Navbar = () => {
  // Function to handle redirection
  const handleClick = () => {
    const dashboardUrl = process.env.DASHBOARD_URL || "http://localhost:3000";
    window.location.href = dashboardUrl;
  };

  return (
    <nav className="flex-between fixed z-50 mr-5 w-full gap-5 bg-black p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <div // Wrap the Link component with a div and attach onClick event
        className="flex items-center gap-3"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <Image
          src="/assets/images/LogoOrange.png"
          width={35}
          height={35}
          alt="Colle Logo"
        />
        <p className="h2-bold font-spaceGrotesk text-base text-white max-sm:hidden">
          Colle - Tanya Jawab
        </p>
      </div>

      <GlobalSearch />

      <div className="flex-between gap-5">
        <Theme />
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#000000",
              },
            }}
          />
        </SignedIn>
        <Mobile />
      </div>
    </nav>
  );
};

export default Navbar;
