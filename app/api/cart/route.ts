import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "USER") {
      return Response.json({ cartItems: [], cartQty: 0, totalPrice: 0 }, { status: 200 });
    }

    const userId = session.user.id as string;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { CartItem: { include: { Product: true }, orderBy: { updatedAt: "desc" } } },
    });

    if (!cart) {
      return Response.json({ cartItems: [], cartQty: 0, totalPrice: 0 }, { status: 200 });
    }

    const cartQty = cart.CartItem.reduce((total, item) => total + item.quantity, 0);

    const totalPrice = cart.CartItem.reduce((total, item) => {
      if (item.isChecked) {
        return total + item.quantity * item.Product.price;
      }
      return total;
    }, 0);

    return Response.json({ cartItems: cart.CartItem, cartQty, totalPrice }, { status: 200 });
  } catch (error) {
    console.error("API Cart Error:", error);
    return Response.json({ message: "Failed to fetch cart data." }, { status: 500 });
  }
}

const revalidateCart = () => {
  revalidatePath("/product/cart");
};

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "USER") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id as string;
  const { productId, qty } = await req.json();
  const quantity = parseInt(qty);

  if (!productId) {
    return Response.json({ message: "Product ID is required" }, { status: 400 });
  }

  try {
    let cart = await prisma.cart.findUnique({ where: { userId }, include: { CartItem: true } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId }, include: { CartItem: true } });
    }

    const existingCartItem = cart.CartItem.find((item) => item.productId === productId);
    const product = await prisma.product.findUnique({ where: { id: productId }, select: { slug: true } });

    if (!product) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }

    if (existingCartItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity, isChecked: true },
      });
      const sumQty = await prisma.cartItem.aggregate({ where: { Cart: { userId } }, _sum: { quantity: true } });
      const cartQty = sumQty._sum.quantity || 0;

      revalidateCart();
      return Response.json({ message: "Item quantity updated", item: updatedItem, cartQty });
    } else {
      const newCartItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity, isChecked: true },
      });
      const sumQty = await prisma.cartItem.aggregate({ where: { Cart: { userId } }, _sum: { quantity: true } });
      const cartQty = sumQty._sum.quantity || 0;

      revalidateCart();
      return Response.json({ message: "Item added to cart", item: newCartItem, cartQty });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
};

export const PUT = async (req: Request) => {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "USER") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id as string;
  const { productId, qty, check } = await req.json();
  const quantity = parseInt(qty);

  if (!productId || typeof quantity !== "number" || quantity < 1) {
    return Response.json({ message: "Invalid product ID or quantity" }, { status: 400 });
  }

  try {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return Response.json({ message: "Cart not found" }, { status: 404 });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId: productId } },
      data: { quantity: quantity, isChecked: check },
    });

    revalidateCart();
    return Response.json({ message: "Item updated", item: updatedItem });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
};

export const PATCH = async (req: Request) => {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "USER") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id as string;
  const body = await req.json();

  const { productId, isChecked } = body;

  if (!productId || typeof isChecked !== "boolean") {
    return Response.json({ message: "Invalid product ID or isChecked status" }, { status: 400 });
  }

  try {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return Response.json({ message: "Cart not found" }, { status: 404 });
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
      data: { isChecked: isChecked },
    });

    revalidateCart();
    return Response.json({ message: "Check status updated", item: updatedItem });
  } catch (error) {
    console.error("Error updating isChecked status:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "USER") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id as string;
  const { productId } = await req.json();

  if (!productId) {
    return Response.json({ message: "Product ID is required" }, { status: 400 });
  }

  try {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return Response.json({ message: "Cart not found" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    revalidateCart();
    return Response.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
};
