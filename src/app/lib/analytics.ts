declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const trackAddToCart = (product: any, size: string, selectedColor?: string, quantity: number = 1) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  
  const price = product.salePrice && Number(product.salePrice) > 0 
    ? Number(product.salePrice) 
    : Number(product.price || 0);

  window.dataLayer.push({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'USD',
      value: price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category?.name || 'Jackets',
        item_variant: `${size}${selectedColor ? ` - ${selectedColor}` : ''}`,
        price: price,
        quantity: quantity
      }]
    }
  });
};

export const trackBeginCheckout = (cartItems: any[]) => {
  if (typeof window === 'undefined') return;

  // Prevent duplicate tracking within the same session
  const checkoutTracked = sessionStorage.getItem('checkout-tracked');
  if (checkoutTracked) return;

  window.dataLayer = window.dataLayer || [];
  
  const items = cartItems.map(item => ({
    item_id: item.product.id,
    item_name: item.product.name,
    item_category: item.product.category?.name || 'Jackets',
    item_variant: `${item.size}${item.selectedColor ? ` - ${item.selectedColor}` : ''}`,
    price: item.unitPrice,
    quantity: item.quantity
  }));

  const totalValue = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  window.dataLayer.push({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'USD',
      value: totalValue,
      items: items
    }
  });

  // Mark checkout as tracked for this session
  sessionStorage.setItem('checkout-tracked', 'true');
};

export const trackPurchase = (orderId: string, orderItems: any[], totalPrice: string) => {
  if (typeof window === 'undefined') return;

  // Prevent duplicate tracking
  const purchaseTracked = sessionStorage.getItem(`purchase-tracked-${orderId}`);
  if (purchaseTracked) return;

  window.dataLayer = window.dataLayer || [];
  
  const items = orderItems.map(item => ({
    item_id: item.id,
    item_name: item.name,
    item_category: 'Jackets',
    item_variant: `${item.size || ''}${item.color ? ` - ${item.color}` : ''}`.trim(),
    price: parseFloat(item.price || '0'),
    quantity: item.quantity || 1
  }));

  window.dataLayer.push({
    event: 'purchase',
    ecommerce: {
      transaction_id: orderId,
      value: parseFloat(totalPrice || '0'),
      currency: 'USD',
      items: items
    }
  });

  sessionStorage.setItem(`purchase-tracked-${orderId}`, 'true');
  
  // Clear checkout tracking so future checkouts can be tracked
  sessionStorage.removeItem('checkout-tracked');
};

// Helper function to clear checkout tracking (call when starting a new checkout session)
export const clearCheckoutTracking = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('checkout-tracked');
};