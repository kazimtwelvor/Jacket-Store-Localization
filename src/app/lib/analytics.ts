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
};