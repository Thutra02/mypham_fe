function formatCurrencyVND(amount: number): string {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// Ví dụ sử dụng
console.log(formatCurrencyVND(1000000)); // Output: "1.000.000 ₫"

export default formatCurrencyVND;