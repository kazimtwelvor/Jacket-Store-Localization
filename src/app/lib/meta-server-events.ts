// Helper functions to send events to Meta Conversions API (Server-Side)
import { v4 as uuidv4 } from 'uuid';

// Helper to get Facebook cookies for deduplication
function getFacebookCookies() {
  if (typeof document === 'undefined') return {};

  const cookies = document.cookie.split(';');
  let fbp = '';
  let fbc = '';

  cookies.forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbp') fbp = value;
    if (name === '_fbc') fbc = value;
  });

  return { fbp, fbc };
}

// Helper to send event to your backend
async function sendToServer(eventType: string, eventData: any, userData: any = {}) {
  try {
    const { fbp, fbc } = getFacebookCookies();
    const eventId = uuidv4(); // Generate unique ID for deduplication

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meta-events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        eventData: {
          ...eventData,
          eventId, // Send same eventId to both pixel and server
        },
        userData: {
          fbp,
          fbc,
          sourceUrl: window.location.href,
          ...userData,
        },
      }),
    });

    const result = await response.json();
    console.log(`Meta CAPI ${eventType} sent:`, result);
    return { success: true, eventId };

  } catch (error) {
    console.error(`Error sending ${eventType} to Meta CAPI:`, error);
    return { success: false, error };
  }
}

// Predefined Event Functions

export async function trackViewContentBoth(
  productId: string,
  productName: string,
  price: number,
  category: string,
  userData: any = {}
) {
  // Send to Meta Pixel (Browser)
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

  // Send to Conversions API (Server)
  return await sendToServer('ViewContent', {
    productId,
    productName,
    price,
    category,
  }, userData);
}

export async function trackAddToCartBoth(
  productId: string,
  productName: string,
  price: number,
  quantity: number = 1,
  userData: any = {}
) {
  // Send to Meta Pixel (Browser)
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

  // Send to Conversions API (Server)
  return await sendToServer('AddToCart', {
    productId,
    productName,
    price,
    quantity,
  }, userData);
}

export async function trackInitiateCheckoutBoth(
  cartItems: any[],
  totalValue: number,
  userData: any = {}
) {
  const contentIds = cartItems.map(item => item.product?.id || item.id);
  const contents = cartItems.map(item => ({
    id: item.product?.id || item.id,
    quantity: item.quantity,
    item_price: item.unitPrice || item.price
  }));

  // Send to Meta Pixel (Browser)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: contentIds,
      contents,
      content_type: 'product',
      value: totalValue,
      currency: 'USD',
      num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  }

  // Send to Conversions API (Server)
  return await sendToServer('InitiateCheckout', {
    cartItems: contents,
    totalValue,
  }, userData);
}

export async function trackPurchaseBoth(
  orderId: string,
  orderItems: any[],
  totalValue: number,
  userData: any = {}
) {
  const contentIds = orderItems.map(item => item.id);
  const contents = orderItems.map(item => ({
    id: item.id,
    quantity: item.quantity || 1,
    item_price: parseFloat(item.price || '0')
  }));

  // Send to Meta Pixel (Browser)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      content_ids: contentIds,
      content_type: 'product',
      contents,
      value: totalValue,
      currency: 'USD',
      num_items: orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
    });
  }

  // Send to Conversions API (Server)
  return await sendToServer('Purchase', {
    orderId,
    orderItems: contents,
    totalValue,
  }, userData);
}

export async function trackLeadBoth(userData: any = {}) {
  // Send to Meta Pixel (Browser)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead');
  }

  // Send to Conversions API (Server)
  return await sendToServer('Lead', {}, userData);
}

export async function trackSearchBoth(searchQuery: string, userData: any = {}) {
  // Send to Meta Pixel (Browser)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Search', {
      search_string: searchQuery
    });
  }

  // Send to Conversions API (Server)
  return await sendToServer('Search', {
    searchQuery,
  }, userData);
}
