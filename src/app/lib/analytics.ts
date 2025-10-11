import { generateEventId } from './meta-helpers';

declare global {
  interface Window {
    dataLayer: any[];
    fbq: any;
    _fbq: any;
  }
}

export const trackAddToCart = (
  product: any,
  size: string,
  selectedColor?: string,
  quantity: number = 1
) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];

  const price =
    product.salePrice && Number(product.salePrice) > 0
      ? Number(product.salePrice)
      : Number(product.price || 0);

  window.dataLayer.push({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'USD',
      value: price * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category?.name || 'Jackets',
          item_variant: `${size}${selectedColor ? ` - ${selectedColor}` : ''}`,
          price: price,
          quantity: quantity,
        },
      ],
    },
  });

  if (window.fbq) {
    const eventId = generateEventId('AddToCart');
    window.fbq(
      'track',
      'AddToCart',
      {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: price * quantity,
        currency: 'USD',
        num_items: quantity,
      },
      {
        eventID: eventId,
      }
    );
  }
};

export const trackBeginCheckout = (cartItems: any[]) => {
  if (typeof window === 'undefined') return;

  // Prevent duplicate tracking within the same session
  const checkoutTracked = sessionStorage.getItem('checkout-tracked');
  if (checkoutTracked) return;

  window.dataLayer = window.dataLayer || [];

  const items = cartItems.map((item) => ({
    item_id: item.product.id,
    item_name: item.product.name,
    item_category: item.product.category?.name || 'Jackets',
    item_variant: `${item.size}${item.selectedColor ? ` - ${item.selectedColor}` : ''}`,
    price: item.unitPrice,
    quantity: item.quantity,
  }));

  const totalValue = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  window.dataLayer.push({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'USD',
      value: totalValue,
      items: items,
    },
  });

  if (window.fbq) {
    const eventId = generateEventId('InitiateCheckout');
    const contentIds = cartItems.map((item) => item.product.id);
    const contents = cartItems.map((item) => ({
      id: item.product.id,
      quantity: item.quantity,
      item_price: item.unitPrice,
    }));

    window.fbq(
      'track',
      'InitiateCheckout',
      {
        content_ids: contentIds,
        contents: contents,
        content_type: 'product',
        value: totalValue,
        currency: 'USD',
        num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      },
      {
        eventID: eventId,
      }
    );
  }

  // Mark checkout as tracked for this session
  sessionStorage.setItem('checkout-tracked', 'true');
};

export const trackPurchase = (
  orderId: string,
  orderItems: any[],
  totalPrice: string
) => {
  if (typeof window === 'undefined') return;

  // Prevent duplicate tracking
  const purchaseTracked = sessionStorage.getItem(`purchase-tracked-${orderId}`);
  if (purchaseTracked) return;

  window.dataLayer = window.dataLayer || [];

  const items = orderItems.map((item) => ({
    item_id: item.id,
    item_name: item.name,
    item_category: 'Jackets',
    item_variant: `${item.size || ''}${item.color ? ` - ${item.color}` : ''}`.trim(),
    price: parseFloat(item.price || '0'),
    quantity: item.quantity || 1,
  }));

  const value = parseFloat(totalPrice || '0');

  // Google Tag Manager
  window.dataLayer.push({
    event: 'purchase',
    ecommerce: {
      transaction_id: orderId,
      value: value,
      currency: 'USD',
      items: items,
    },
  });

  if (window.fbq) {
    const eventId = `purchase_${orderId}`;
    const contentIds = orderItems.map((item) => item.id);
    const contents = orderItems.map((item) => ({
      id: item.id,
      quantity: item.quantity || 1,
      item_price: parseFloat(item.price || '0'),
    }));

    window.fbq(
      'track',
      'Purchase',
      {
        content_ids: contentIds,
        content_type: 'product',
        contents: contents,
        value: value,
        currency: 'USD',
        num_items: orderItems.reduce(
          (sum, item) => sum + (item.quantity || 1),
          0
        ),
      },
      {
        eventID: eventId,
      }
    );
  }

  sessionStorage.setItem(`purchase-tracked-${orderId}`, 'true');

  // Clear checkout tracking so future checkouts can be tracked
  sessionStorage.removeItem('checkout-tracked');
};

// Helper function to clear checkout tracking (call when starting a new checkout session)
export const clearCheckoutTracking = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('checkout-tracked');
};

export const trackViewContent = (product: any) => {
  if (typeof window === 'undefined') return;

  const price =
    product.salePrice && Number(product.salePrice) > 0
      ? Number(product.salePrice)
      : Number(product.price || 0);

  if (window.fbq) {
    const eventId = generateEventId('ViewContent');
    window.fbq(
      'track',
      'ViewContent',
      {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        content_category: product.category?.name || 'Jackets',
        value: price,
        currency: 'USD',
      },
      {
        eventID: eventId,
      }
    );
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'view_item',
    ecommerce: {
      currency: 'USD',
      value: price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category?.name || 'Jackets',
          price: price,
        },
      ],
    },
  });
};

export const trackSearch = (searchQuery: string) => {
  if (typeof window === 'undefined') return;

  if (window.fbq) {
    const eventId = generateEventId('Search');
    window.fbq(
      'track',
      'Search',
      {
        search_string: searchQuery,
      },
      {
        eventID: eventId,
      }
    );
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'search',
    search_term: searchQuery,
  });
};

export const trackAddToWishlist = (product: any) => {
  if (typeof window === 'undefined') return;

  const price =
    product.salePrice && Number(product.salePrice) > 0
      ? Number(product.salePrice)
      : Number(product.price || 0);

  if (window.fbq) {
    const eventId = generateEventId('AddToWishlist');
    window.fbq(
      'track',
      'AddToWishlist',
      {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: price,
        currency: 'USD',
      },
      {
        eventID: eventId,
      }
    );
  }
};

export const trackAddPaymentInfo = (totalValue: number) => {
  if (typeof window === 'undefined') return;

  if (window.fbq) {
    const eventId = generateEventId('AddPaymentInfo');
    window.fbq(
      'track',
      'AddPaymentInfo',
      {
        value: totalValue,
        currency: 'USD',
      },
      {
        eventID: eventId,
      }
    );
  }
};
