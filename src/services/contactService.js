import API from "./api";

export const submitContact = (data) => API.post("/contact", data);
export const subscribeNewsletter = (email) =>
  API.post("/newsletter", { email });