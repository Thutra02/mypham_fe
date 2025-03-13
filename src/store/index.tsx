import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authService';
import addressReducer from './../features/address/addressSlice';
import authReducer from './../features/auth/authSlice';
import blogReducer from './../features/blog/blogSlice';
import blogCategoryReducer from './../features/blogCategory/blogCategorySlice';
import brandReducer from './../features/brand/brandSlice';
import cartReducer from './../features/cart/cartSlice';
import categoryReducer from './../features/category/categorySlice';
import contactReducer from './../features/contact/contactSlice';
import discountReducer from './../features/discount/discountSlice';
import orderReducer from './../features/order/orderSlice';
import productReducer from './../features/product/productSlice';
import reportReducer from './../features/report/reportSlice';
import tagReducer from './../features/tag/tagSlice';
import userReducer from './../features/users/userSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        address: addressReducer,
        categories: categoryReducer,
        brands: brandReducer,
        products: productReducer,
        blogCategories: blogCategoryReducer,
        blogs: blogReducer,
        discounts: discountReducer,
        tags: tagReducer,
        orders: orderReducer,
        users: userReducer,
        carts: cartReducer,
        report: reportReducer,
        contact : contactReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
})
// Định nghĩa các type cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;