import React from "react";
import DashboardDesktop from "./DashboardDesktop";
import DashboardMobile from "@/app/dashboard/DashboardMobile";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-4">
      <div className="container">
        <div className="flex gap-8">
          <div className="w-[250px] hidden sm:block">
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
