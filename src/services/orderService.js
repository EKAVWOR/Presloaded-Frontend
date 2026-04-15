import API from "./api";

export const createOrder = (orderData) => API.post("/orders", orderData);
export const verifyPayment = (reference) =>
  API.post("/orders/verify-payment", { reference });
export const getMyOrders = () => API.get("/orders/my-orders");
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const downloadAdmissionLetter = (orderId, courseId) =>
  API.get(`/orders/${orderId}/admission-letter/${courseId}`, {
    responseType: "blob",
  });