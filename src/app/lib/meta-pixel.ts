// Meta (Facebook) Pixel Integration
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Standard Events for Meta Pixel
export const trackViewContent = (productId: string, productName: string, price: number, category: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      content_category: category,
      value: price,
      currency: 'USD'
    });
  }
};

export const trackAddToCart = (productId: string, productName: string, price: number, quantity: number = 1) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: price * quantity,
      currency: 'USD',
      num_items: quantity
    });
  }
};

export const trackInitiateCheckout = (cartItems: any[], totalValue: number) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const contentIds = cartItems.map(item => item.product.id);
    const contentNames = cartItems.map(item => item.product.name);
    
    window.fbq('track', 'InitiateCheckout', {
      content_ids: contentIds,
      contents: cartItems.map(item => ({
        id: item.product.id,
        quantity: item.quantity,
        item_price: item.unitPrice
      })),
      content_type: 'product',
      value: totalValue,
      currency: 'USD',
      num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  }
};

export const trackAddPaymentInfo = (totalValue: number) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddPaymentInfo', {
      value: totalValue,
      currency: 'USD'
    });
  }
};

export const trackPurchase = (orderId: string, orderValue: number, orderItems: any[]) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const contentIds = orderItems.map(item => item.id);
    
    window.fbq('track', 'Purchase', {
      content_ids: contentIds,
      content_type: 'product',
      contents: orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: parseFloat(item.price || '0')
      })),
      value: orderValue,
      currency: 'USD',
      num_items: orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
    });
  }
};

export const trackSearch = (searchQuery: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Search', {
      search_string: searchQuery
    });
  }
};

export const trackLead = (email?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      ...(email && { email: email })
    });
  }
};

// Custom Events
export const trackCustomEvent = (eventName: string, params: any = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params);
  }
};
