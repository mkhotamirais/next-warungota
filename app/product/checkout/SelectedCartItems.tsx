import { CartItemProps } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

interface SelectedCartItemsProps {
  cartItems: CartItemProps[] | null | undefined;
}

export default function SelectedCartItems({ cartItems }: SelectedCartItemsProps) {
  if (cartItems?.length === 0) {
    return (
      <div className="text-center p-4 border rounded-lg bg-gray-50 text-gray-500">
        Tidak ada item yang dipilih untuk proses checkout.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg divide-y divide-gray-200">
        {cartItems?.map((item) => (
          <div key={item.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Gambar Produk */}
              <div className="w-16 h-16 flex-shrink-0 border rounded-md overflow-hidden">
                <Image
                  src={item.Product.imageUrl || "/logo-warungota.png"}
                  width={100}
                  height={100}
                  alt={item.Product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <Link
                  href={`/product/detail/${item.Product.slug}`}
                  className="text-base font-medium text-gray-800 hover:text-blue-600"
                >
                  {item.Product.name}
                </Link>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} | Stok: {item.Product.stock}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-md font-semibold text-gray-900">
                Rp{(item.quantity * item.Product.price).toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-gray-500">Rp{item.Product.price.toLocaleString("id-ID")}/item</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
