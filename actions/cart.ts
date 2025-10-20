import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getCarts = async () => {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "USER") {
    return { cartItems: [], cartQty: 0, totalPrice: 0 };
  }

  const userId = session.user.id as string;
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { CartItem: { include: { Product: true }, orderBy: { updatedAt: "desc" } } },
  });

  if (!cart) {
    return { carts: [], cartQty: 0, totalPrice: 0 };
  }

  const cartQty = cart.CartItem.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cart.CartItem.reduce((total, item) => {
    if (item.isChecked) {
      return total + item.quantity * item.Product.price;
    }
    return total;
  }, 0);

  return { cartItems: cart.CartItem, cartQty, totalPrice };
};
