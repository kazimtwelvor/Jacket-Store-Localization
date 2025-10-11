// Utility functions for Microsoft Clarity tracking

declare global {
  interface Window {
    clarity: any;
  }
}

export const clarityUtils = {
  // Track custom events
  trackEvent: (eventName: string, data?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      try {
        window.clarity('event', eventName, data);
      } catch (error) {
      }
    }
  },

  setCustomTag: (key: string, value: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      try {
        window.clarity('set', key, value);
      } catch (error) {
      }
    }
  },

  identifyUser: (userId: string, sessionId?: string, pageId?: string, friendlyName?: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      try {
        window.clarity('identify', userId, sessionId, pageId, friendlyName);
      } catch (error) {
      }
    }
  },

  trackPageView: (pageName: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      try {
        window.clarity('set', 'pageTitle', pageName);
        window.clarity('event', 'page_view', { page: pageName });
      } catch (error) {
      }
    }
  },

  // Track e-commerce events
  trackPurchase: (orderId: string, value: number, currency: string = 'USD') => {
    if (typeof window !== 'undefined' && window.clarity) {
      try {
        window.clarity('event', 'purchase', {
          order_id: orderId,
          value: value,
          currency: currency
        });
      } catch (error) {
      }
    }
  },

  // Track add to cart events
  trackAddToCart: (productId: string, productName: string, price: number) => {
    if (typeof window !== 'undefined' && window.clarity) {
      try {
        window.clarity('event', 'add_to_cart', {
          product_id: productId,
          product_name: productName,
          price: price
        });
      } catch (error) {
      }
    }
  },

  trackSearch: (searchTerm: string, resultsCount?: number) => {
    if (typeof window !== 'undefined' && window.clarity) {
      try {
        window.clarity('event', 'search', {
          search_term: searchTerm,
          results_count: resultsCount
        });
      } catch (error) {
      }
    }
  }
};

export const jacketStoreEvents = {
  productView: (productId: string, productName: string, category: string) => {
    clarityUtils.trackEvent('product_view', {
      product_id: productId,
      product_name: productName,
      category: category
    });
  },
  addToCart: (productId: string, productName: string, price: number, size?: string, color?: string) => {
    clarityUtils.trackEvent('add_to_cart', {
      product_id: productId,
      product_name: productName,
      price: price,
      size: size,
      color: color
    });
  },
  removeFromCart: (productId: string, productName: string) => {
    clarityUtils.trackEvent('remove_from_cart', {
      product_id: productId,
      product_name: productName
    });
  },
  checkoutStart: (cartValue: number, itemCount: number) => {
    clarityUtils.trackEvent('checkout_start', {
      cart_value: cartValue,
      item_count: itemCount
    });
  },
  purchaseComplete: (orderId: string, totalValue: number, itemCount: number) => {
    clarityUtils.trackEvent('purchase_complete', {
      order_id: orderId,
      total_value: totalValue,
      item_count: itemCount
    });
  },
  sizeGuideOpen: (productId: string) => {
    clarityUtils.trackEvent('size_guide_open', {
      product_id: productId
    });
  },
  wishlistAdd: (productId: string, productName: string) => {
    clarityUtils.trackEvent('wishlist_add', {
      product_id: productId,
      product_name: productName
    });
  },
  categoryView: (categoryName: string) => {
    clarityUtils.trackEvent('category_view', {
      category: categoryName
    });
  },
  searchPerformed: (searchTerm: string, resultsCount: number) => {
    clarityUtils.trackEvent('search_performed', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }
};
