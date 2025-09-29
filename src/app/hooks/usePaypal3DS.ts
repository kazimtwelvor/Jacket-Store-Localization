import { useState, useCallback, useRef, useEffect } from "react";
import {
  handle3DSContingency,
  is3DSContingencyResponse,
  ThreeDSContingency,
} from "../lib/paypal-3ds-utils";
// import {
//   is3DSContingencyResponse,
//   handle3DSContingency,
//   type ThreeDSContingency,
// } from "@/lib/paypal-3ds-utils";

interface Use3DSOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  onAuthenticationRequired?: (orderId: string) => void;
}

interface Use3DSReturn {
  isAuthenticating: boolean;
  authenticationStatus: "3ds-required" | "3ds-success" | "3ds-failed" | null;
  handle3DSFlow: (
    orderId: string,
    scaMethod?: "SCA_ALWAYS" | "SCA_WHEN_REQUIRED"
  ) => Promise<void>;
  reset: () => void;
}

export function usePayPal3DS(options: Use3DSOptions = {}): Use3DSReturn {
  const { onSuccess, onError, onAuthenticationRequired } = options;

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authenticationStatus, setAuthenticationStatus] = useState<
    "3ds-required" | "3ds-success" | "3ds-failed" | null
  >(null);

  // Use refs to avoid stale closures
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onAuthenticationRequiredRef = useRef(onAuthenticationRequired);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    onAuthenticationRequiredRef.current = onAuthenticationRequired;
  });

  const handle3DSFlow = useCallback(
    async (
      orderId: string,
      scaMethod: "SCA_ALWAYS" | "SCA_WHEN_REQUIRED" = "SCA_WHEN_REQUIRED"
    ) => {
      if (!orderId) {
        onErrorRef.current?.(new Error("Order ID is required for 3DS flow"));
        return;
      }

      setIsAuthenticating(true);
      setAuthenticationStatus(null);

      try {
        // Try to authorize the order
        const authResponse = await fetch(
          "/api/payments/paypal/authorize-order",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: orderId,
              sca_method: scaMethod,
            }),
          }
        );

        const authResult = await authResponse.json();

        if (authResult.status === "COMPLETED") {
          // Direct authorization success - no 3DS required
          setAuthenticationStatus("3ds-success");
          onSuccessRef.current?.(authResult);
          return;
        }

        if (
          authResult.status === "PAYER_ACTION_REQUIRED" &&
          authResult.payer_action_url
        ) {
          // 3DS authentication required
          setAuthenticationStatus("3ds-required");
          onAuthenticationRequiredRef.current?.(orderId);

          return new Promise<void>((resolve, reject) => {
            // Set up message listener for popup communication
            const handleMessage = (event: MessageEvent) => {
              if (event.origin !== window.location.origin) return;

              if (event.data.type === "3DS_SUCCESS") {
                window.removeEventListener("message", handleMessage);
                setAuthenticationStatus("3ds-success");
                onSuccessRef.current?.({
                  orderId: event.data.orderId,
                  liability_shift: event.data.liabilityShift,
                  authentication_result: event.data.authenticationResult,
                });
                resolve();
              } else if (event.data.type === "3DS_FAILED") {
                window.removeEventListener("message", handleMessage);
                setAuthenticationStatus("3ds-failed");
                const error = new Error(
                  event.data.message || "3D Secure authentication failed"
                );
                onErrorRef.current?.(error);
                reject(error);
              }
            };

            window.addEventListener("message", handleMessage);

            // Store order ID in sessionStorage for the return page
            sessionStorage.setItem("current_order_id", orderId);

            // Open 3DS authentication popup
            const returnUrl = `${window.location.origin}/3ds-return`;
            let authUrl = authResult.payer_action_url;

            // Append redirect_uri for proper return handling
            const separator = authUrl.includes("?") ? "&" : "?";
            authUrl += `${separator}redirect_uri=${encodeURIComponent(
              returnUrl
            )}`;

            const popup = window.open(
              authUrl,
              "3ds-auth",
              "width=600,height=700,scrollbars=yes,resizable=yes"
            );

            if (!popup) {
              // Popup blocked - fallback to redirect
              window.removeEventListener("message", handleMessage);
              window.location.href = authUrl;
              return;
            }

            // Clean up listener if popup is closed manually
            const checkClosed = setInterval(() => {
              if (popup?.closed) {
                clearInterval(checkClosed);
                window.removeEventListener("message", handleMessage);
                setAuthenticationStatus("3ds-failed");
                const error = new Error("3D Secure authentication cancelled");
                onErrorRef.current?.(error);
                reject(error);
              }
            }, 1000);
          });
        }

        // Handle other authorization results
        if (authResult.status === "APPROVED") {
          setAuthenticationStatus("3ds-success");
          onSuccessRef.current?.(authResult);
        } else {
          throw new Error(authResult.error || "Authorization failed");
        }
      } catch (error) {
        setAuthenticationStatus("3ds-failed");
        const err =
          error instanceof Error ? error : new Error("3DS flow failed");
        onErrorRef.current?.(err);
        throw err;
      } finally {
        setIsAuthenticating(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsAuthenticating(false);
    setAuthenticationStatus(null);
  }, []);

  return {
    isAuthenticating,
    authenticationStatus,
    handle3DSFlow,
    reset,
  };
}

/**
 * Hook for handling 3DS contingency responses from PayPal API calls
 */
export function usePayPal3DSContingency(options: Use3DSOptions = {}) {
  const { onSuccess, onError } = options;

  const [isHandling3DS, setIsHandling3DS] = useState(false);

  const handle3DSContingencyResponse = useCallback(
    async (response: any) => {
      if (!is3DSContingencyResponse(response)) {
        return false; // Not a 3DS contingency response
      }

      setIsHandling3DS(true);

      try {
        // Set up message listener for popup communication
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;

          if (event.data.type === "3DS_SUCCESS") {
            window.removeEventListener("message", handleMessage);
            onSuccess?.({
              orderId: event.data.orderId,
              liability_shift: event.data.liabilityShift,
              authentication_result: event.data.authenticationResult,
            });
          } else if (event.data.type === "3DS_FAILED") {
            window.removeEventListener("message", handleMessage);
            onError?.(
              new Error(event.data.message || "3D Secure authentication failed")
            );
          }
        };

        window.addEventListener("message", handleMessage);

        // Store order ID for return page
        sessionStorage.setItem("current_order_id", response.order_id);

        // Handle the 3DS contingency
        const returnUrl = `${window.location.origin}/3ds-return`;
        handle3DSContingency(response as ThreeDSContingency, returnUrl);

        return true; // Handled as 3DS contingency
      } catch (error) {
        onError?.(
          error instanceof Error
            ? error
            : new Error("Failed to handle 3DS contingency")
        );
        return false;
      } finally {
        setIsHandling3DS(false);
      }
    },
    [onSuccess, onError]
  );

  return {
    isHandling3DS,
    handle3DSContingencyResponse,
  };
}
