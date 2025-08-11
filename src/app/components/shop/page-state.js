"use client";

// Simple module to persist shop page state between navigations
let currentShopPage = 1;

export const setShopPage = (page) => {
  currentShopPage = page;
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('SHOP_PAGE', page.toString());
  }
};

export const getShopPage = () => {
  if (typeof window !== 'undefined') {
    const stored = window.sessionStorage.getItem('SHOP_PAGE');
    if (stored) {
      currentShopPage = parseInt(stored, 10);
    }
  }
  return currentShopPage;
};