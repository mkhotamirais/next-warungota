export const menu = {
  mainMenu: [
    { label: "Home", url: "/" },
    { label: "About", url: "/about" },
    { label: "Contact", url: "/contact" },
    { label: "Product", url: "/product" },
    { label: "Blog", url: "/blog" },
  ],
  allRoleMenu: [
    { label: "Dashboard", url: "/dashboard" },
    { label: "Profile", url: "/dashboard/account" },
  ],
  userMenu: [
    { label: "Address", url: "/dashboard/account/address" },
    //
  ],
  adminMenu: [
    { label: "Product", url: "/dashboard/admin/product" },
    { label: "Create Product", url: "/dashboard/admin/product/create-product" },
    { label: "Product Category", url: "/dashboard/admin/product-category" },
    { label: "Blog", url: "/dashboard/admin/blog" },
    { label: "Create Blog", url: "/dashboard/admin/blog/create-blog" },
    { label: "Blog Category", url: "/dashboard/admin/blog-category" },
  ],
};

export const content = {
  home: {
    hero: {
      title: "Belanja dan Fotokopi dalam Satu Tempat",
      description:
        "WarungOta menyediakan sembako, ATK, serta layanan fotokopi, cetak dokumen dan foto, laminating, transfer, tarik tunai, isi saldo, pulsa, dan token listrik.",
    },
  },
  about: {
    title: "About Us",
    description: "About use description",
  },
  contact: {
    title: "Contact Us",
    description: "Contact us description",
  },
  blog: {
    title: "Blog",
    description: "Blog description",
  },
  product: {
    title: "Product",
    description: "Product description",
  },
};
