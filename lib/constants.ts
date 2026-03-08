// const isProd = process.env.NODE_ENV === "production";

export const ytUrl = "https://www.googleapis.com/youtube/v3/channels";
export const googleApiKey = process.env.GOOGLE_API_KEY as string;
export const ytChannelId = "UCkXmLjEr95LVtGuIm3l2dPg";

export const metadata = {
  home: {
    title: "WarungOta - Belanja dan Fotokopi dalam Satu Tempat",
  },
};

export const menu = {
  main: [
    { label: "Home", url: "/" },
    { label: "About", url: "/about" },
    { label: "Contact", url: "/contact" },
  ],
  appwrite: [
    { label: "Home", url: "/baas/appwrite" },
    { label: "Blog", url: "/baas/appwrite/blog" },
  ],
  user: [
    { label: "User Home", url: "/user" },
    { label: "Profile", url: "/user/profile" },
    { label: "Address", url: "/user/address" },
  ],
  admin: [
    { label: "Dashboard", url: "/admin" },
    { label: "Product", url: "/admin/product" },
    //
  ],
  footer: {
    menu_1: [
      //
    ],
    menu_2: [
      //
    ],
    menu_3: [
      { label: "Components", url: "/client/components" },
      { label: "Todo", url: "/client/todo" },
      { label: "Dummyjson", url: "/client/public-api/dummyjson" },
      { label: "Jsonplaceholder", url: "/client/public-api/jsonplaceholder" },
      { label: "Youtube", url: "/client/public-api/youtube" },
      { label: "Sticky", url: "/client/others/sticky" },
      { label: "Clock", url: "/client/others/clock" },
      { label: "Stopwatch", url: "/client/others/stopwatch" },
      { label: "Symbol Color", url: "/client/others/symbol-color" },
      { label: "Ts1", url: "/client/others/ts1" },
      { label: "Ts2", url: "/client/others/ts2" },
      { label: "Ts3", url: "/client/others/ts3" },
    ],
  },
};

export const mainMenu = [
  { label: "Home", url: "/" },
  { label: "About", url: "/about" },
  { label: "Contact", url: "/contact" },
  { label: "Blog", url: "/blog" },
  { label: "Product", url: "/product" },
];

export const userMenu = [
  { label: "Profile", url: "/user/profile" },
  { label: "Address", url: "/user/address" },
  { label: "My Orders", url: "/user/my-orders" },
];

export const adminMenu = [
  { label: "Product", url: "/admin/product" },
  { label: "Create Product", url: "/admin/product/create-product" },
  { label: "Product Category", url: "/admin/product-category" },
  { label: "Blog", url: "/admin/blog" },
  { label: "Create Blog", url: "/admin/blog/create-blog" },
  { label: "Blog Category", url: "/admin/blog-category" },
];

export const superAdminMenu = [
  { label: "Super Admin Dashboard", url: "/super-admin/dashboard" },
  { label: "User Management", url: "/super-admin/users" },
  //
];

export const publicRoutes = ["/", "/about"];
export const authRoutes = ["/signin", "/signup"];
export const transactionRoutes = ["/user/cart", "/user/checkout", "/user/my-orders", "/user/payment"];
export const userRoute = "/user";
export const userWhiteListRoutes = ["/user", "/user/profile"];
export const adminRoute = "/admin";
export const verifyRoute = "/verify-email";
export const verifyPendingRoute = "/verify-email-request";

export const content = {
  metadata: {
    home: {
      title: "halo",
      description: "halo content",
    },
  },
  home: {
    hero: {
      title: "WarungOta - Belanja dan Fotokopi dalam Satu Tempat",
      description:
        "WarungOta menyediakan sembako, ATK, serta layanan fotokopi, cetak dokumen dan foto, laminating, transfer, tarik tunai, isi saldo, pulsa, dan token listrik.",
    },
  },
  about: {
    title: "Tentang Kami",
    description: "Tentang Warungota, sejarah dan lokasi",
  },
  contact: {
    title: "Kontak Kami",
    description: "Hubungi Warungota melalui alamat atau kontak yang tersedia.",
  },
  blog: {
    title: "Blog",
    description: "Artikel terkait produk dan layanan WarungOta",
  },
  product: {
    title: "Produk",
    description: "Produk dan layanan WarungOta",
  },
};

export const EXPIRY_DURATION = 1;
export const EXPIRY_UNIT = "minutes";

export const duitkuPaymentMethods = [
  // E-Wallet
  { id: "NQ", category: "qris", name: "QRIS", expiryPeriod: 15, desc: "Dana, OVO, GoPay, LinkAja (Potong Saldo)" },
  { id: "SA", category: "ewallet", name: "ShopeePay", expiryPeriod: 30, desc: "Aplikasi Shopee" },
  { id: "OV", category: "ewallet", name: "OVO", expiryPeriod: 15, desc: "Aplikasi OVO" },
  { id: "LA", category: "ewallet", name: "LinkAja", expiryPeriod: 30, desc: "Aplikasi LinkAja" },
  { id: "DA", category: "ewallet", name: "DANA", expiryPeriod: 30, desc: "Aplikasi DANA" },

  // Virtual Account
  { id: "VA", category: "va", name: "Maybank VA", expiryPeriod: 1440, desc: "Transfer Maybank" },
  { id: "BT", category: "va", name: "Permata VA", expiryPeriod: 1440, desc: "Transfer Permata" },
  { id: "B1", category: "va", name: "CIMB Niaga VA", expiryPeriod: 1440, desc: "Transfer CIMB" },
  { id: "A1", category: "va", name: "ATM Bersama", expiryPeriod: 1440, desc: "Transfer ATM Bersama" },
  { id: "I1", category: "va", name: "BNI VA", expiryPeriod: 1440, desc: "Transfer BNI" },
  { id: "NC", category: "va", name: "Neo Commerce VA", expiryPeriod: 1440, desc: "Transfer Bank Neo" },
  { id: "BR", category: "va", name: "BRI VA (BRIVA)", expiryPeriod: 1440, desc: "Transfer BRImo" },
  { id: "M2", category: "va", name: "Mandiri VA", expiryPeriod: 1440, desc: "Transfer Livin' Mandiri" },

  // Retail Store
  { id: "FT", category: "retail", name: "Pegadaian/PT POS", expiryPeriod: 1440, desc: "Gerai Pegadaian/POS" },
  { id: "AL", category: "retail", name: "Alfamart", expiryPeriod: 1440, desc: "Seluruh gerai Alfamart" },
  { id: "IR", category: "retail", name: "Indomaret", expiryPeriod: 1440, desc: "Seluruh gerai Indomaret" },

  // Paylater
  { id: "ID", category: "paylater", name: "Indodana", expiryPeriod: 60, desc: "Cicilan Indodana" },
  { id: "AT", category: "paylater", name: "Atome", expiryPeriod: 60, desc: "Cicilan Atome" },
] as const;

export const limit = 6;
