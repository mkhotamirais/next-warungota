import React from "react";
import Logo from "../Logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="">
      <div className="bg-gray-800 text-white">
        <div className="container pt-12 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Logo />
            <div>
              <Link href="/baas/appwrite">Appwrite</Link>
            </div>
            <div>menu2</div>
            <div>
              <p>Client Side</p>
              <div>
                <Link href="/client/public-api/jsonplaceholder">Jsonplaceholder</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 py-4">
          <div className="container">footer bottom</div>
        </div>
      </div>
    </footer>
  );
}
