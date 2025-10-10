export function getFbpCookie(): string {
  if (typeof document === 'undefined') return '';
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbp') {
      return value;
    }
  }
  return '';
}


export function getFbcCookie(): string {
  if (typeof document === 'undefined') return '';
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbc') {
      return value;
    }
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get('fbclid');
  if (fbclid) {
    const timestamp = Date.now();
    return `fb.1.${timestamp}.${fbclid}`;
  }
  
  return '';
}


export function generateEventId(eventName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${eventName}_${timestamp}_${random}`;
}


export function getFacebookTrackingData(eventName: string) {
  return {
    fbp: getFbpCookie(),
    fbc: getFbcCookie(),
    event_id: generateEventId(eventName),
    event_source_url: typeof window !== 'undefined' ? window.location.href : '',
  };
}


export function formatUserDataForMeta(userData: any = {}) {
  return {
    email: userData.email || '',
    phone: userData.phone || '',
    first_name: userData.firstName || userData.first_name || '',
    last_name: userData.lastName || userData.last_name || '',
    city: userData.city || '',
    state: userData.state || '',
    zip: userData.zip || userData.zipCode || '',
    country: userData.country || 'us', // Default to US, 2-letter code
    gender: userData.gender ? (userData.gender.toLowerCase().startsWith('m') ? 'm' : 'f') : '',
    external_id: userData.userId || userData.customerId || '',
  };
}


export async function sendMetaServerEvent(
  eventType: string,
  eventData: any,
  userData: any = {}
) {
  try {
    const trackingData = getFacebookTrackingData(eventType);
    const formattedUserData = formatUserDataForMeta(userData);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meta-events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        eventData: {
          ...eventData,
          event_id: trackingData.event_id,
        },
        userData: {
          ...formattedUserData,
          fbp: trackingData.fbp,
          fbc: trackingData.fbc,
          source_url: trackingData.event_source_url,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✅ Meta server event sent: ${eventType}`, result);
    
    return { success: true, event_id: trackingData.event_id, result };

  } catch (error) {
    console.error(`❌ Error sending Meta server event: ${eventType}`, error);
    return { success: false, error };
  }
}
