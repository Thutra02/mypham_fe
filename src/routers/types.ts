import { ComponentType } from "react";

export interface LocationStates {
  "/"?: {};
  "/cua-hang"?: {};
  "/bai-viet"?: {};
  "/bai-viet/:id"?: {};
  "/thong-tin-ve-chung-toi"?: {};
  "/product-detail-2"?: {};
  "/cau-hoi-thuong-gap"?: {};
  "/page-collection-2"?: {};
  "/page-search"?: {};
  "/home-header-2"?: {};
  "/account"?: {};
  "/account-savelists"?: {};
  "/product-detail"?: {};
  "/page-collection"?: {};
  "/home2"?: {};
  "/account-change-password"?: {};
  "/account-address"?: {};
  "/account-my-order"?: {};
  "/account-my-order/review/:id"?: {};
  "/account-my-order/:id"?: {};
  "/cart"?: {};
  "/cua-hang/:id"?: {};
  "/cua-hang1/:id"?: {};
  "/checkout"?: {};
  "/blog"?: {};
  "/blog-single"?: {};
  "/about"?: {};
  "/contact"?: {};
  "/login"?: {};
  "/signup"?: {};
  "/forgot-pass"?: {};
  "/page404"?: {};
  "/lien-he"?: {};
  "/admin"?: {};
  "/admin/contact"?: {};
  "/admin/brand"?: {};
  "/admin/brand/add"?: {};
  "/admin/brand/edit/:id"?: {};
  "/admin/products"?: {};
  "/admin/products/add"?: {};
  "/admin/products/edit/:id"?: {};
  "/admin/categories"?: {};
  "/admin/categories/add"?: {};
  "/admin/categories/edit/:id"?: {};
  "/admin/orders"?: {};
  "/admin/orders/edit/:id"?: {};
  "/admin/users"?: {};
  "/admin/users/edit/:id"?: {};
  "/admin/discounts"?: {};
  "/admin/discounts/add"?: {};
  "/admin/discounts/edit/:id"?: {};
  "/admin/blog"?: {};
  "/admin/blog/add"?: {};
  "/admin/blog/edit/:id"?: {};
  "/admin/blog-categories"?: {};
  "/admin/blog-categories/add"?: {};
  "/admin/blog-categories/edit/:id"?: {};
}

export type PathName = keyof LocationStates;

export interface Page {
  path: PathName;
  component: ComponentType<Object>;
}
