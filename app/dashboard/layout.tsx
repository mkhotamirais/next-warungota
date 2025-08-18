import React from "react";
import Link from "next/link";
import { menu as m } from "@/lib/content";
import DashboardHeader from "@/app/dashboard/DashboardHeader";
import { signOut } from "@/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-4">
      <div className="container">
        <div className="flex gap-8">
          <div className="w-[250px] hidden sm:block">
            {m.dashboardMenu.map((item, i) => (
              <Link
                href={item.url}
                key={i}
                className="px-3 py-2 block border-b hover:bg-gray-100 text-sm text-gray-600"
              >
                {item.label}
              </Link>
            ))}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/signin" });
              }}
            >
              <button
                type="submit"
                className="px-3 py-2 block w-full text-left bg-gray-600 text-white rounded mt-2 text-sm hover:bg-gray-500"
              >
                Sign Out
              </button>
            </form>
            {/* <button
              type="button"
              onClick={() => signOut({ redirectTo: "/signin" })}
              className="px-3 py-2 block border-b hover:bg-gray-100 text-sm text-gray-600"
            >
              Sign Out
            </button> */}
          </div>

          <div className="w-full">
            <DashboardHeader />
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
