let paypalSdkPromise: Promise<void> | null = null;
let isPaypalLoaded = false;
let loadedComponents: string[] = [];

export async function loadPayPalSDK(clientId: string, requiredComponents: string[] = ['buttons', 'card-fields', 'googlepay']): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("PayPal SDK can only be loaded in browser environment");
  }

  const componentsStr = requiredComponents.join(',');
  
  // Check if we need to reload with different components
  const needsReload = !isPaypalLoaded || 
    !window.paypal || 
    !requiredComponents.every(comp => loadedComponents.includes(comp));

  if (!needsReload) {
    return Promise.resolve();
  }

  // Reset if we need different components
  if (paypalSdkPromise && needsReload) {
    paypalSdkPromise = null;
    isPaypalLoaded = false;
  }

  // If loading is in progress, return the existing promise
  if (paypalSdkPromise) {
    return paypalSdkPromise;
  }

  // Start loading
  paypalSdkPromise = new Promise<void>((resolve, reject) => {
    // Remove existing script
    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&currency=USD&intent=capture&components=${componentsStr}&enable-funding=paylater,card&disable-funding=venmo`;
    script.async = true;
    
    script.onload = () => {
      isPaypalLoaded = true;
      loadedComponents = [...requiredComponents];
      resolve();
    };
    
    script.onerror = () => {
      paypalSdkPromise = null;
      reject(new Error("Failed to load PayPal SDK"));
    };
    
    document.head.appendChild(script);
  });

  return paypalSdkPromise;
}

export function isPayPalLoaded(): boolean {
  return isPaypalLoaded && typeof window !== "undefined" && !!window.paypal;
}

export function resetPayPalSDK(): void {
  paypalSdkPromise = null;
  isPaypalLoaded = false;
  loadedComponents = [];
}