import Link from "next/link";
import React from "react";
import Button from "../ui/Button";

export default function HomeHero() {
  return (
    <section className="py-6 lg:py-10 bg-gray-200">
      <div className="container max-w-3xl flex flex-col sm:items-center justify-center text-left sm:text-center space-y-4">
        <h1 className="h1">Belanja dan Fotokopi dalam Satu Tempat</h1>
        <p>
          WarungOta menyediakan sembako, ATK, serta layanan fotokopi, cetak dokumen dan foto, laminating, transfer,
          tarik tunai, isi saldo, pulsa, dan token listrik.
        </p>

        {/* <SearchForm /> */}

        <div className="flex flex-col sm:flex-row gap-2">
          <Button as={Link} href="/product" className="text-base rounded-lg w-36">
            Semua Produk
          </Button>
          <Button as={Link} href="/contact" variant="outline" className="text-base rounded-lg w-36">
            Hubungi Kami
          </Button>
        </div>
      </div>
    </section>
  );
}
