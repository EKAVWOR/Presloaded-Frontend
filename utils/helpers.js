import { CURRENCY } from "./constants";

export const formatPrice = (price) => {
  if (!price && price !== 0) return "";
  return `${CURRENCY}${Number(price).toLocaleString()}`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length <= maxLength
    ? text
    : text.substring(0, maxLength) + "...";
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const generateReference = () => {
  return `TA_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

export const getDiscountPercent = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};