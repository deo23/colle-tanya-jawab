import Link from "next/link";
import Image from "next/image";

import { SignedIn, UserButton } from "@clerk/nextjs";

// import Theme from "@/components/shared/navbar/Theme";
import Mobile from "@/components/shared/navbar/Mobile";
import GlobalSearch from "@/components/shared/search/GlobalSearch";

const Navbar = () => {
  return (
    <nav className="flex-between light:shadow-none shadow-300 bg-light fixed z-50 mr-5 w-full gap-5 p-6 sm:px-12">
      <Link href="/" className="ml-[-20px] flex items-center  gap-3">
        <Image
          src="/assets/images/LogoSidebar.png"
          width={35}
          height={35}
          alt="Colle Logo"
        />

        <p className="h2-bold text-left font-spaceGrotesk text-base text-white  max-sm:hidden">
          Colle - Tanya Jawab
        </p>
      </Link>

      <GlobalSearch />

      <div className="flex-between gap-5">
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
