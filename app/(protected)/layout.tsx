import AuthProvider from "@/components/providers/AuthProvider";
import AsideMenuDesktop from "./AsideMenuDesktop";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="container py-3">
        <div className="flex items-start">
          <div className="hidden md:block md:w-1/4 sticky top-16">
            <AsideMenuDesktop />
          </div>
          <div className="w-full md:w-3/4">{children}</div>
        </div>
      </div>
    </AuthProvider>
  );
}
