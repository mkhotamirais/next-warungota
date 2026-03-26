import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// --- GET: Mengambil isi keranjang ---
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "USER")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        CartItem: {
          include: { Product: true },
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ cartItems: [], cartQty: 0, totalPrice: 0 });
    }

    const cartQty = cart.CartItem.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.CartItem.reduce((total, item) => {
      return item.isChecked ? total + item.quantity * item.Product.price : total;
    }, 0);

    return NextResponse.json({ cartItems: cart.CartItem, cartQty, totalPrice });
  } catch (error) {
    console.error("GET_CART_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// --- POST: Tambah, Update, atau Set Checked ---
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity, actionType, isChecked } = await req.json();
    const userId = session.user.id;

    if (!productId) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: { CartItem: true },
    });

    const existingItem = cart.CartItem.find((item) => item.productId === productId);
    let resultItem;
    let message = "";

    if (actionType === "INCREMENT" || actionType === "SET") {
      const qty = quantity || 1;
      const newQty = actionType === "INCREMENT" && existingItem ? existingItem.quantity + qty : qty;

      resultItem = await prisma.cartItem.upsert({
        where: { id: existingItem?.id || "new-id" }, // Hack untuk upsert jika ID tidak ada
        update: { quantity: newQty, isChecked: true },
        create: { cartId: cart.id, productId, quantity: newQty, isChecked: true },
        // Karena Prisma upsert butuh ID spesifik, lebih aman pakai create/update manual seperti sebelumnya:
      });

      // Menggunakan logika manual agar lebih presisi sesuai code awalmu:
      if (existingItem) {
        resultItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQty, isChecked: true },
        });
      } else {
        resultItem = await prisma.cartItem.create({
          data: { cartId: cart.id, productId, quantity: newQty, isChecked: true },
        });
      }
      message = `Berhasil update ${product.name}`;
    } else if (actionType === "SET_CHECKED") {
      if (!existingItem) return NextResponse.json({ error: "Item not in cart" }, { status: 404 });
      resultItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { isChecked },
      });
      message = "Status berhasil diubah";
    }

    const totalQty = await prisma.cartItem.aggregate({ _sum: { quantity: true }, where: { cartId: cart.id } });

    revalidatePath("/cart");
    return NextResponse.json({ message, item: resultItem, cartQty: totalQty._sum.quantity || 0 });
  } catch (error) {
    console.error("POST_CART_ERROR:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// --- DELETE: Hapus item dari keranjang ---
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });

    const totalQty = await prisma.cartItem.aggregate({ _sum: { quantity: true }, where: { cartId: cart.id } });

    revalidatePath("/cart");
    return NextResponse.json({ message: "Item dihapus", cartQty: totalQty._sum.quantity || 0 });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
