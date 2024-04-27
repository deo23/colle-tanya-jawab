import Link from "next/link";
import Image from "next/image";

import { SignedIn, UserButton } from "@clerk/nextjs";

import Theme from "@/components/shared/navbar/Theme";
import Mobile from "@/components/shared/navbar/Mobile";
import GlobalSearch from "@/components/shared/search/GlobalSearch";

const Navbar = () => {
  return (
    <nav className="flex-between bg-black fixed z-50 w-full gap-5 p-6 mr-5 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/assets/images/LogoSideBar.png"
          width={35}
          height={35}
          alt="Colle Logo"
        />

        <p className="h2-bold font-spaceGrotesk text-white text-base max-sm:hidden">
          Colle - Tanya Jawab
        </p>
      </Link>

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
