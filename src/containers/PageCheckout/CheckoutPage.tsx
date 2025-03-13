import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import Label from "../../components/Label/Label";
import Prices from "../../components/Prices";
import { fetchCart, fetchUrlMomo } from "../../features/cart/cartSlice";
import { applyDiscount } from "../../features/discount/discountSlice";
import { addOrder } from "../../features/order/orderSlice";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import Input from "../../shared/Input/Input";
import { AppDispatch, RootState } from "../../store";
import { Address, CartItem, OrderRequest } from "../../types";
import formatCurrencyVND from "../../utils/formatMoney";
import PaymentMethod from "./PaymentMethod";
import ShippingAddress from "./ShippingAddress";

const CheckoutPage = () => {
  const [tabActive, setTabActive] = useState<
    "ContactInfo" | "ShippingAddress" | "PaymentMethod"
  >("ShippingAddress");

  const { cart } = useSelector((state: RootState) => state.carts);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [discount, setDiscount] = useState<number>(0);
  const [discountCode, setDiscountCode] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const handleApplyDiscount = async () => {
    try {
      const dt = await dispatch(applyDiscount(discountCode)).unwrap();
      setDiscount(dt);

    } catch (error : any) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    const orderData: OrderRequest = {
      username: "username",
      paymentMethod: selectedPaymentMethod,
      discountCode: discountCode,
      orderItems:
        cart?.cartItems.map((item: CartItem) => {
          return {
            productId: item.product.id,
            quantity: item.quantity,
            price: item.unitPrice,
          };
        }) || [],
      totalAmount:
        cart?.cartItems.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0
        ) ?? 0,
      discountAmount: discount,
      finalAmount:
        (cart?.cartItems ?? []).reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0
        ) -
        discount,
      address: selectedAddress.id,
    };
    try {
      console.log(orderData)
      const res = await dispatch(addOrder(orderData)).unwrap();
      if (orderData.paymentMethod === "COD") {
        navigate("/account-my-order");
        await dispatch(fetchCart()).unwrap();
        toast.success("Đặt hàng thành công");
        await dispatch(fetchCart()).unwrap();
        return;
      } else {
        const url = await dispatch(
          fetchUrlMomo({
            orderId: res.orderId.toString(),
            total: orderData.finalAmount,
          })
        ).unwrap();
        toast.success("Đặt hàng thành công");

        window.open(url, "_blank", "noopener,noreferrer");

        await dispatch(fetchCart()).unwrap();
      }
    } catch (error :any) {
      console.log(error);
      toast.error(error);
    }
  };

  const renderProduct = (item: CartItem, index: number) => {
    const { unitPrice, product, quantity } = item;

    return (
      <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
        <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={product?.productImages[0]?.image || "/default-image.jpg"}
            alt={product?.name || "Product Image"}
            className="h-full w-full object-contain object-center"
          />
          <Link to="/product-detail" className="absolute inset-0"></Link>
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="flex-[1.5] ">
                <h3 className="text-base font-semibold">
                  <Link to={`/cua-hang/${product?.id}`}>{product?.name}</Link>
                </h3>
                <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.35 1.94995L9.69 3.28992"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.07 11.92L17.19 11.26"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 22H16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span>{product?.brand?.name}</span>
                  </div>
                  <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 9V3H15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 15V21H9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 3L13.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.5 13.5L3 21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span>{product?.category?.name}</span>
                  </div>
                </div>
              </div>

              <div className="hidden flex-1 sm:flex justify-end">
                <Prices price={unitPrice} className="mt-0.5" />
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            <div className="hidden sm:block text-center relative">
              {`Qty ${quantity}`}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <div id="ShippingAddress" className="scroll-mt-24">
          <ShippingAddress
            isActive={tabActive === "ShippingAddress"}
            onOpenActive={() => {
              navigate("/account-address");
            }}
            onCloseActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
            onSelectAddress={setSelectedAddress}
          />
        </div>

        <div id="PaymentMethod" className="scroll-mt-24">
          <PaymentMethod
            isActive={tabActive === "PaymentMethod"}
            onOpenActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
            onCloseActive={() => setTabActive("ShippingAddress")}
            onSelectPaymentMethod={setSelectedPaymentMethod}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="nc-CheckoutPage">
      <title>Checkout || fashionFactory Ecommerce Template</title>

      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            Thanh toán
          </h2>
          <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
            <Link to={"/#"} className="">
              Trang chủ
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <span className="underline">Thanh toán</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">{renderLeft()}</div>

          <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16 "></div>

          <div className="w-full lg:w-[36%] ">
            <h3 className="text-lg font-semibold">Thông tin đơn hàng</h3>
            <div className="mt-8 divide-y divide-slate-200/70 dark:divide-slate-700 ">
              {cart && cart?.cartItems?.length > 0 ? (
                cart?.cartItems.map((item, index) => renderProduct(item, index))
              ) : (
                <div className="flex items-center justify-center   ">
                  <div className="text-red-500">
                    Bạn chưa có sản phẩm nào cả
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 pt-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700 ">
              <div>
                <Label className="text-sm">Mã giảm giá</Label>
                <div className="flex mt-1.5">
                  <Input
                    sizeClass="h-10 px-4 py-3"
                    className="flex-1"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <button
                    className="text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 rounded-2xl px-4 ml-3 font-medium text-sm bg-neutral-200/70 dark:bg-neutral-700 dark:hover:bg-neutral-800 w-24 flex justify-center items-center transition-colors"
                    type="button"
                    onClick={handleApplyDiscount}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-between py-2.5">
                <span>Tổng tiền</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {formatCurrencyVND(
                    cart?.cartItems?.reduce(
                      (total, item) => total + item.unitPrice * item.quantity,
                      0
                    ) ?? 0
                  )}
                </span>
              </div>

              <div className="flex justify-between py-2.5">
                <span>Giảm giá</span>
                <span className="font-semibold text-red-600 dark:text-slate-200">
                  - {formatCurrencyVND(discount)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                <span>Tổng thanh toán</span>
                <span>
                  {formatCurrencyVND(
                    (cart?.cartItems ?? []).reduce(
                      (total, item) => total + item.unitPrice * item.quantity,
                      0
                    ) -
                    discount  
                  )}
                </span>
              </div>
            </div>
            <ButtonPrimary onClick={handleConfirmOrder} className="mt-8 w-full">
              Xác nhận
            </ButtonPrimary>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
