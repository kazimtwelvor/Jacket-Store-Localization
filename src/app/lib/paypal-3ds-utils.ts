/**
 * PayPal 3D Secure Utilities
 * Minimal utility functions for 3DS authentication handling
 */

export interface ThreeDSResult {
  liability_shift: "POSSIBLE" | "NO" | "UNKNOWN";
  authentication_status: "Y" | "N" | "U" | "A" | "C" | "R" | "UNKNOWN";
  enrollment_status: "Y" | "N" | "U" | "B" | "UNKNOWN";
}

export interface PayPalOrderStatus {
  id: string;
  status:
    | "CREATED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "COMPLETED"
    | "PAYER_ACTION_REQUIRED";
  payment_source?: {
    card?: {
      authentication_result?: ThreeDSResult;
    };
    google_pay?: {
      card?: {
        authentication_result?: ThreeDSResult;
      };
    };
  };
}

/**
 * Determines if 3DS authentication is required based on order status
 */
export function requires3DSAuthentication(
  orderStatus: PayPalOrderStatus
): boolean {
  return orderStatus.status === "PAYER_ACTION_REQUIRED";
}

/**
 * Extracts 3DS authentication result from PayPal order
 */
export function extract3DSResult(
  orderStatus: PayPalOrderStatus
): ThreeDSResult | null {
  const cardAuth = orderStatus.payment_source?.card?.authentication_result;
  const googlePayAuth =
    orderStatus.payment_source?.google_pay?.card?.authentication_result;

  return cardAuth || googlePayAuth || null;
}

/**
 * Validates if liability shift is achieved
 */
export function hasLiabilityShift(
  threeDSResult: ThreeDSResult | null
): boolean {
  return threeDSResult?.liability_shift === "POSSIBLE";
}

/**
 * Gets user-friendly 3DS status message
 */
export function get3DSStatusMessage(
  threeDSResult: ThreeDSResult | null
): string {
  if (!threeDSResult) return "Authentication status unknown";

  switch (threeDSResult.authentication_status) {
    case "Y":
      return "Authentication successful";
    case "N":
      return "Authentication failed";
    case "U":
      return "Authentication unavailable";
    case "A":
      return "Authentication attempted";
    case "C":
      return "Challenge required";
    case "R":
      return "Authentication rejected";
    default:
      return "Authentication status unknown";
  }
}

/**
 * Determines SCA method based on transaction context
 */
export function getSCAMethod(
  amount: number,
  currency: string = "USD",
  region: string = "US"
): "SCA_WHEN_REQUIRED" | "SCA_ALWAYS" {
  // European transactions require SCA compliance
  const europeanRegions = [
    "GB",
    "DE",
    "FR",
    "IT",
    "ES",
    "NL",
    "BE",
    "AT",
    "IE",
    "PT",
    "FI",
    "GR",
    "LU",
    "MT",
    "CY",
    "SK",
    "SI",
    "EE",
    "LV",
    "LT",
  ];

  if (europeanRegions.includes(region)) {
    return "SCA_WHEN_REQUIRED";
  }

  // High-value transactions
  if (amount > 1000) {
    return "SCA_ALWAYS";
  }

  return "SCA_WHEN_REQUIRED";
}

/**
 * Creates 3DS-enabled payment source configuration
 */
export function create3DSPaymentSource(
  paymentMethod: "card" | "google_pay",
  scaMethod: "SCA_WHEN_REQUIRED" | "SCA_ALWAYS" = "SCA_WHEN_REQUIRED"
) {
  const baseConfig = {
    attributes: {
      verification: {
        method: scaMethod,
      },
    },
    experience_context: {
      payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
      brand_name: "PP Store",
      locale: "en-US",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/3ds-return`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/checkout`,
    },
  };

  if (paymentMethod === "card") {
    return {
      card: {
        ...baseConfig,
        experience_context: {
          ...baseConfig.experience_context,
          shipping_preference: "SET_PROVIDED_ADDRESS",
        },
      },
    };
  } else {
    return {
      google_pay: {
        ...baseConfig,
        experience_context: {
          ...baseConfig.experience_context,
          shipping_preference: "GET_FROM_FILE",
        },
      },
    };
  }
}

/**
 * Interface for 3DS contingency response
 */
export interface ThreeDSContingency {
  status: "PAYER_ACTION_REQUIRED";
  order_id: string;
  contingency: "3D_SECURE_REQUIRED";
  payer_action_url: string;
  message: string;
}

/**
 * Checks if a PayPal API response indicates 3DS contingency
 */
export function is3DSContingencyResponse(
  response: any
): response is ThreeDSContingency {
  return (
    response?.status === "PAYER_ACTION_REQUIRED" &&
    response?.contingency === "3D_SECURE_REQUIRED" &&
    response?.payer_action_url
  );
}

/**
 * Handles 3DS contingency by redirecting to authentication flow
 */
export function handle3DSContingency(
  contingency: ThreeDSContingency,
  redirectUri?: string
): void {
  let authUrl = contingency.payer_action_url;

  // Append redirect_uri if provided
  if (redirectUri) {
    const separator = authUrl.includes("?") ? "&" : "?";
    authUrl += `${separator}redirect_uri=${encodeURIComponent(redirectUri)}`;
  }

  // Open in popup for better UX, fallback to redirect
  const popup = window.open(
    authUrl,
    "3ds-auth",
    "width=600,height=700,scrollbars=yes,resizable=yes"
  );

  if (!popup) {
    // Fallback to redirect if popup is blocked
    window.location.href = authUrl;
  }
}

/**
 * Creates authorization payload with 3DS verification
 */
export function createAuthorizationPayload(
  paymentSource?: any,
  scaMethod: "SCA_WHEN_REQUIRED" | "SCA_ALWAYS" = "SCA_WHEN_REQUIRED"
) {
  if (!paymentSource) {
    return {}; // Empty payload for orders already created with payment source
  }

  // Handle card payment source
  if (paymentSource.card) {
    return {
      payment_source: {
        card: {
          ...paymentSource.card,
          attributes: {
            verification: {
              method: scaMethod,
            },
          },
        },
      },
    };
  }

  // Handle Google Pay payment source
  if (paymentSource.google_pay) {
    return {
      payment_source: {
        google_pay: {
          ...paymentSource.google_pay,
          attributes: {
            verification: {
              method: scaMethod,
            },
          },
        },
      },
    };
  }

  return {};
}

/**
 * Extracts HATEOAS links from PayPal response
 */
export function extractPayerActionLink(response: any): string | null {
  const links = response?.links || [];
  const payerActionLink = links.find(
    (link: any) => link.rel === "payer-action"
  );
  return payerActionLink?.href || null;
}
