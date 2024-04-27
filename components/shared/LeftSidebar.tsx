"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

import { sidebarLinks } from "@/constants";

const LeftSidebar = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const handleClick = () => {
    const dashboardUrl = process.env.DASHBOARD_URL || "http://localhost:3000";
    window.location.href = dashboardUrl;
  };

  return (
    <section className="primary-leftsidebar light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          if (link.route === "/profile") {
            if (userId) {
              link.route = `${link.route}/${userId}`;
            } else {
              return null;
            }
          }

          return (
            <Link
              key={link.route}
              href={link.route}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-light-900"
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={20}
                height={20}
                className={`${isActive ? "text-light-900" : ""}`}
              />
              <p
                className={`${
                  isActive ? "base-bold" : "base-medium"
                } max-lg:hidden`}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* <SignedOut> */}

      {/* </SignedOut> */}
    </section>
  );
};

export default LeftSidebar;
