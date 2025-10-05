import React from "react";
import DashboardDesktop from "./DashboardDesktop";
import DashboardMobile from "./DashboardMobile";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-4">
      <div className="container">
        <div className="flex gap-8 items-start">
          <div className="w-[250px] hidden sm:block sticky top-20">
            <DashboardDesktop />
          </div>

          <div className="w-full">
            <DashboardMobile />
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
