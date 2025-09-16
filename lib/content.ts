export const menu = {
  mainMenu: [
    { label: "Home", url: "/" },
    { label: "About", url: "/about" },
    { label: "Contact", url: "/contact" },
    { label: "Product", url: "/product" },
    { label: "Blog", url: "/blog" },
  ],
  userMenu: [
    { label: "My Account", url: "/account" },
    //
  ],
  editorMenu: [
    { label: "Dashboard", url: "/dashboard" },
    { label: "Product", url: "/dashboard/product" },
    { label: "Create Product", url: "/dashboard/product/create-product" },
    { label: "Product Category", url: "/dashboard/product-category" },
    { label: "Blog", url: "/dashboard/blog" },
    { label: "Create Blog", url: "/dashboard/blog/create-blog" },
    { label: "Blog Category", url: "/dashboard/blog-category" },
  ],
  adminMenu: [
    { label: "Users", url: "/dashboard/users" },
    //
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
