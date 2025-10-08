"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  ChevronLeft,
  CreditCard,
  Truck,
  Shield,
  Check,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import PayPalButtons from "../../components/cart/PayPalButtons";
import PayPalCardForm from "../../components/cart/PayPalCardForm";
import GooglePayWithPaypal from "../../components/GooglePayWithPaypal";
import AfterpayExpressCheckout from "../../components/AfterpayExpressCheckout";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaymentProcessingModal from "../../components/PaymentProcessingModal";
import Currency from "../../ui/currency";
import Button from "../../ui/button";
import { toast } from "react-hot-toast";
import { FloatingLabelInput } from "../../ui/input";
import Container from "../../ui/container";
import { cn } from "../../lib/utils";
import { useCart } from "../../contexts/CartContext";
import { decrypt } from "../../utils/decrypt";
import {
  STATES_BY_COUNTRY,
  getStatesForCountry,
} from "../../utils/states-data";

// Initialize Stripe
let stripePromise: any = null;

// Country list for the checkout form
const COUNTRIES: { code: string; name: string }[] = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "BN", name: "Brunei Darussalam" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CV", name: "Cape Verde" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo, the Democratic Republic of the" },
  { code: "CK", name: "Cook Islands" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Côte d’Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czechia" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "ET", name: "Ethiopia" },
  { code: "FK", name: "Falkland Islands (Malvinas)" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GF", name: "French Guiana" },
  { code: "PF", name: "French Polynesia" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "GL", name: "Greenland" },
  { code: "GD", name: "Grenada" },
  { code: "GP", name: "Guadeloupe" },
  { code: "GU", name: "Guam" },
  { code: "GT", name: "Guatemala" },
  { code: "GG", name: "Guernsey" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IM", name: "Isle of Man" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JE", name: "Jersey" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KR", name: "Korea, Republic of" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Lao People's Democratic Republic" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" },
  { code: "MK", name: "North Macedonia" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MQ", name: "Martinique" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "YT", name: "Mayotte" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NC", name: "New Caledonia" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestine, State of" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "PR", name: "Puerto Rico" },
  { code: "QA", name: "Qatar" },
  { code: "RE", name: "Réunion" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russian Federation" },
  { code: "RW", name: "Rwanda" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SZ", name: "Eswatini" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Türkiye" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TC", name: "Turks and Caicos Islands" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Viet Nam" },
  { code: "VI", name: "Virgin Islands, U.S." },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];

// Payment Form Component
const PaymentForm = ({
  clientSecret,
  orderId,
  onSuccess,
  onBack,
  isLoading,
  setIsLoading,
  setPaymentModal,
}: {
  clientSecret: string;
  orderId: string;
  onSuccess: () => void;
  onBack: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setPaymentModal: (modal: {
    isOpen: boolean;
    status: "processing" | "success" | "error";
    message: string;
  }) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setPaymentModal({ isOpen: true, status: "processing", message: "" });

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation?orderId=${orderId}`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message || "An error occurred during payment");
        setPaymentModal({
          isOpen: true,
          status: "error",
          message: result.error.message || "Payment failed",
        });
        setTimeout(
          () =>
            setPaymentModal({
              isOpen: false,
              status: "processing",
              message: "",
            }),
          3000
        );
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        // Update backend payment status
        try {
          await fetch("/api/stripe/update-payment-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              paymentIntentId: result.paymentIntent.id,
            }),
          });
        } catch (error) {
          console.error("Failed to update payment status:", error);
        }

        setPaymentModal({
          isOpen: true,
          status: "success",
          message: "Payment successful! Redirecting...",
        });
        setTimeout(() => {
          setPaymentModal({ isOpen: false, status: "processing", message: "" });
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred");
      setPaymentModal({
        isOpen: true,
        status: "error",
        message: "Payment failed. Please try again.",
      });
      setTimeout(
        () =>
          setPaymentModal({ isOpen: false, status: "processing", message: "" }),
        3000
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          className="bg-black hover:bg-black text-white"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            <>
              Submit order
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

const CheckoutPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState("address");
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [stripePublishableKey, setStripePublishableKey] = useState<
    string | null
  >(null);
  const isStripeEnabled = process.env.NEXT_PUBLIC_USE_STRIPE === "true";
  const { items, clearCart, totalPrice: cartTotalPrice } = useCart();
  const router = useRouter();
  const [voucherCode, setVoucherCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherApplying, setVoucherApplying] = useState(false);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    status: "processing" as "processing" | "success" | "error",
    message: "",
  });
  const [isOrderConfirming, setIsOrderConfirming] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    password: "",
    createAccount: false,
    acceptTerms: false,
    acceptPrivacy: false,
    billingAddressSame: true,
    selectedPaymentMethod: "",
    shippingMethod: "standard",
    billingFirstName: "",
    billingLastName: "",
    billingAddress1: "",
    billingAddress2: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "US",
    customState: "",
    customBillingState: "",
  });

  // Add formTouched state to track touched fields
  const [formTouched, setFormTouched] = useState({
    firstName: false,
    lastName: false,
    address1: false,
    address2: false,
    city: false,
    state: false,
    zipCode: false,
    country: false,
    email: false,
    password: false,
    phone: false,
  });

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateZipCode = (zipCode: string, country: string): boolean => {
    if (country === "US") {
      return /^\d{5}(-\d{4})?$/.test(zipCode);
    }
    if (country === "CA") {
      return /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(zipCode);
    }
    if (country === "GB") {
      return /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/.test(zipCode);
    }
    return zipCode.length >= 3; // Basic validation for other countries
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Get validation errors
  const getFieldError = (fieldName: string): string | null => {
    if (!formTouched[fieldName as keyof typeof formTouched]) return null;
    
    switch (fieldName) {
      case 'email':
        if (!formData.email) return 'Email is required';
        if (!validateEmail(formData.email)) return 'Please enter a valid email address';
        return null;
      case 'zipCode':
        if (!formData.zipCode) return 'Zip code is required';
        if (!validateZipCode(formData.zipCode, formData.country)) return 'Please enter a valid zip code';
        return null;
      case 'phone':
        if (!formData.phone) return 'Phone number is required';
        if (!validatePhone(formData.phone)) return 'Please enter a valid phone number';
        return null;
      case 'firstName':
        return !formData.firstName ? 'First name is required' : null;
      case 'lastName':
        return !formData.lastName ? 'Last name is required' : null;
      case 'address1':
        return !formData.address1 ? 'Address is required' : null;
      case 'city':
        return !formData.city ? 'City is required' : null;
      case 'state':
        return !formData.state ? 'State is required' : null;
      case 'password':
        if (formData.createAccount && !formData.password) return 'Password is required';
        return null;
      default:
        return null;
    }
  };

  // Get states for selected country
  const availableStates = getStatesForCountry(formData.country);
  const availableBillingStates = getStatesForCountry(formData.billingCountry);

  const totalPrice = cartTotalPrice;
  const shippingPrice =
    formData.shippingMethod === "express" ? 15 : totalPrice > 100 ? 0 : 15;
  const taxRate = 0.08;
  const taxAmount = 0;
  const grandTotal = totalPrice + shippingPrice + taxAmount;
  const effectiveGrandTotal = Math.max(0, grandTotal - discountAmount);

  useEffect(() => {
    setIsMounted(true);

    // Check for payment method in URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentMethod = urlParams.get("payment");
    if (paymentMethod) {
      setFormData((prev) => ({
        ...prev,
        selectedPaymentMethod: paymentMethod,
      }));
    }
  }, []);

  useEffect(() => {
    const fetchStripePublishableKey = async () => {
      if (!isStripeEnabled) return;

      try {
        // Check if API URL is available
        if (!process.env.NEXT_PUBLIC_API_URL) {
          console.warn("API URL not configured. Using fallback Stripe key.");
          // You can set a fallback key here for development
          setStripePublishableKey(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null
          );
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stripe-publishable-key`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch Stripe publishable key: ${response.status}`
          );
        }
        const data = await response.json();
        setStripePublishableKey(data.publishableKey);
      } catch (error) {
        console.error("Error fetching Stripe publishable key:", error);
        // Fallback to environment variable if API call fails
        const fallbackKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (fallbackKey) {
          console.warn("Using fallback Stripe key from environment variable");
          setStripePublishableKey(fallbackKey);
        } else {
          toast.error("Failed to load Stripe. Please try again later.");
        }
      }
    };

    fetchStripePublishableKey();
  }, [isStripeEnabled]);

  useEffect(() => {
    stripePromise =
      stripePublishableKey && isStripeEnabled
        ? loadStripe(stripePublishableKey)
        : null;
  }, [stripePublishableKey, isStripeEnabled]);

  useEffect(() => {
    const fetchPayPalClientId = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payment-settings`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch payment settings");
        }
        const data = await response.json();
        const encryptionKey = "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0";
        const decryptedClientId = decrypt(data.paypalClientId, encryptionKey);
        setPaypalClientId(decryptedClientId);
      } catch (error) {
        console.error("Error fetching PayPal client ID:", error);
        const fallbackClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
        if (fallbackClientId) {
          setPaypalClientId(fallbackClientId);
        }
      }
    };

    fetchPayPalClientId();
  }, []);

  const initializePayment = async () => {
    if (clientSecret) return;

    setIsLoading(true);
    try {
      const checkoutData = {
        productIds: items.map((item) => item.product.id),
        paymentMethod: formData.selectedPaymentMethod || "stripe",
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        address: `${formData.address1}, ${formData.city}, ${formData.state}, ${formData.zipCode}, ${formData.country}`,
        billingAddress: formData.billingAddressSame
          ? `${formData.address1}, ${formData.city}, ${formData.state}, ${formData.zipCode}, ${formData.country}`
          : `${formData.billingAddress1}, ${formData.billingCity}, ${formData.billingState}, ${formData.billingZipCode}, ${formData.billingCountry}`,
        shippingAddress: `${formData.address1}, ${formData.city}, ${formData.state}, ${formData.zipCode}, ${formData.country}`,
        zipCode: formData.zipCode,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        embedded: true,
        totalAmount: effectiveGrandTotal,
        discountAmount: discountAmount,
        voucherCode: voucherCode || null,
      };

      // Use Stripe API route for Stripe payments
      if (isStripeEnabled && formData.selectedPaymentMethod === "CREDIT_CARD") {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(checkoutData),
        });

        if (!response.ok) {
          throw new Error("Failed to initialize payment");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setOrderId(data.orderId);
      } else {
        // For other payments, use the original backend endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(checkoutData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to initialize payment");
        }

        const data = await response.json();
        const encryptionKey = "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0";
        setClientSecret(decrypt(data.clientSecret, encryptionKey));
        setOrderId(data.orderId);
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Failed to initialize payment. Please try again.");
      setActiveStep("address");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setPaymentModal({
      isOpen: true,
      status: "success",
      message: "Payment successful! Redirecting...",
    });

    // Send emails immediately after successful payment
    try {
      const orderItems = items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.unitPrice.toString(),
      }));

      await fetch("/api/orders/send-order-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          orderNumber: orderId || "unknown",
          orderTotal: effectiveGrandTotal.toString(),
          items: orderItems,
        }),
      });
    } catch (error) {
      console.error("Failed to send order emails:", error);
    }

    setTimeout(() => {
      setPaymentModal({ isOpen: false, status: "processing", message: "" });
      clearCart();
      router.push(`/checkout/confirmation?orderId=${orderId}&success=1`);
    }, 2000);
  };

  const handleApplyVoucher = async () => {
    try {
      const storeId = process.env.NEXT_PUBLIC_STORE_ID;
      if (!storeId) {
        toast.error("Store not configured");
        return;
      }
      if (!voucherCode.trim()) {
        toast.error("Enter a voucher code");
        return;
      }
      setVoucherApplying(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/confirm-voucher`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: voucherCode.trim(),
            orderTotal: grandTotal,
            items: items.map((i) => ({
              id: i.product.id,
              price: i.unitPrice,
              quantity: i.quantity,
            })),
          }),
        }
      );
      const data = await response.json();
      if (data.valid) {
        setDiscountAmount(Number(data.discount) || 0);
        setVoucherMessage(data.message || "Voucher applied");
        toast.success(data.message || "Voucher applied");
      } else {
        setDiscountAmount(0);
        setVoucherMessage(data.message || "Invalid voucher code");
        toast.error(data.message || "Invalid voucher code");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to apply voucher");
    } finally {
      setVoucherApplying(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  if (items.length === 0) {
    return (
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-black mb-8">Checkout</h1>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-lg mb-6">
                Your cart is empty. Add some items before checking out.
              </p>
              <Button
                onClick={() => router.push("/us/")}
                className="bg-[#B01E23] hover:bg-[#8a1a1e] text-white"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Reset state when country changes
      if (name === "country") {
        newData.state = "";
        newData.customState = "";
      }
      if (name === "billingCountry") {
        newData.billingState = "";
        newData.customBillingState = "";
      }

      return newData;
    });
  };

  // Update handleInputChange to mark fields as touched on blur
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setFormTouched((prev) => ({ ...prev, [name]: true }));
  };

  const isAddressComplete =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    validateEmail(formData.email) &&
    formData.address1 &&
    formData.city &&
    formData.state &&
    formData.zipCode &&
    validateZipCode(formData.zipCode, formData.country) &&
    formData.country &&
    formData.phone &&
    validatePhone(formData.phone) &&
    (!formData.createAccount || formData.password);

  return (
    <div className="min-h-screen bg-gray-50 px-0 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-8"
      >
        <h1 className="text-3xl font-bold text-black mt-2 mb-2 md:my-8 text-center">
          Checkout
        </h1>

        {/* Mobile Order Summary Toggle */}
        <div className="lg:hidden mb-4">
          <div className="bg-white rounded-lg shadow-sm">
            <button
              onClick={() => setShowOrderSummary(!showOrderSummary)}
              className={`flex w-full items-center justify-between ${
                showOrderSummary ? "p-4" : "p-3"
              }`}
            >
              <span className="text-lg font-medium">
                <Currency value={effectiveGrandTotal} />
              </span>
              <div className="flex items-center">
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/cart");
                  }}
                  className="text-sm text-black underline hover:text-gray-800 mr-2 cursor-pointer"
                >
                  « Back to cart
                </span>
                <ChevronRight
                  className={`h-5 w-5 transition-transform ${
                    showOrderSummary ? "rotate-90" : ""
                  }`}
                />
              </div>
            </button>

            {/* Mobile Order Summary Content */}
            {showOrderSummary && (
              <div className="p-4 border-t">
                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-[28rem] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border-b">
                      <div className="relative w-32 h-36 flex-shrink-0">
                        <Image
                          src={
                            item.product.images?.[0]?.url || "/placeholder.svg"
                          }
                          alt={item.product.name}
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-black text-sm uppercase mb-2 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <div className="space-y-1 mb-2">
                          <p className="text-xs text-gray-700">
                            Color:{" "}
                            {item.product.colorDetails?.[0]?.name || "Black"}
                          </p>
                          <p className="text-xs text-gray-700">
                            Size: {item.size}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-700">
                            Total Price{" "}
                            <span className="font-bold text-black">
                              <Currency
                                value={item.unitPrice * item.quantity}
                              />
                            </span>
                          </p>
                          <p className="text-sm text-gray-700">
                            Quantity {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="bg-gray-100 p-4 rounded">
                  <table className="w-full">
                    <thead className="hidden">
                      <tr className="border-b border-gray-300">
                        <th className="text-left pb-2" colSpan={2}>
                          <strong className="text-lg font-bold text-black">
                            Order overview
                          </strong>
                          <span className="text-sm font-normal text-gray-600 ml-2">
                            ({items.length} Items)
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 text-base text-black">Subtotal</td>
                        <td className="py-2 text-right">
                          <strong className="text-base text-black">
                            <Currency value={totalPrice} />
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-base text-black">Shipping</td>
                        <td className="py-2 text-right">
                          <strong className="text-base text-green-600">
                            {shippingPrice === 0 ? (
                              "Free"
                            ) : (
                              <Currency value={shippingPrice} />
                            )}
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-base text-black">
                          Estimated Tax
                        </td>
                        <td className="py-2 text-right">
                          <strong className="text-base text-black">
                            <Currency value="0" />
                          </strong>
                        </td>
                      </tr>
                      {discountAmount > 0 && (
                        <tr>
                          <td className="py-2 text-base text-black">
                            Discount
                          </td>
                          <td className="py-2 text-right">
                            <strong className="text-base text-green-600">
                              -<Currency value={discountAmount} />
                            </strong>
                          </td>
                        </tr>
                      )}
                      <tr className="border-t-2 border-gray-400">
                        <td className="py-3 text-lg font-bold text-black">
                          Your order
                        </td>
                        <td className="py-3 text-right">
                          <strong className="text-lg font-bold text-black">
                            <Currency value={effectiveGrandTotal} />
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {voucherMessage && (
                    <div
                      className={`mt-2 p-2 text-sm italic text-center ${
                        discountAmount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {voucherMessage}
                    </div>
                  )}
                </div>

                {/* Voucher Code */}
                <div className="mt-6">
                  <button className="text-sm font-medium text-black mb-2 w-full text-left">
                    <strong>Redeem a voucher code</strong>
                  </button>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Voucher code"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B01E23]"
                    />
                    <Button
                      onClick={handleApplyVoucher}
                      disabled={voucherApplying}
                      className="bg-[#B01E23] hover:bg-[#8a1a1e] text-white"
                    >
                      {voucherApplying ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 md:mb-8 py-6 px-4 sm:py-8 sm:px-6 md:py-6 md:px-6">
              <div className="flex items-center justify-between w-full">
                {activeStep === "address" && ( // Address step is active
                  <>
                    <div className="flex items-center text-black">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 bg-black text-white flex-shrink-0">
                        <Truck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-bold text-sm sm:text-base md:text-lg truncate">
                          ADDRESS
                        </h2>
                        <p className="text-xs sm:text-sm text-red-600 hidden sm:block">
                          + Delivery options
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
                    <div className="flex items-center text-gray-400">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 bg-gray-300 flex-shrink-0">
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-bold text-sm sm:text-base md:text-lg truncate">
                          PAYMENT
                        </h2>
                        <p className="text-xs sm:text-sm text-red-600 hidden sm:block">
                          + Delivery details
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {activeStep === "payment" && ( // Payment step is active
                  <div className="flex items-center text-black justify-start w-full">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 bg-black text-white flex-shrink-0">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h2 className="font-bold text-sm sm:text-base md:text-lg">
                        PAYMENT
                      </h2>
                      <p className="text-xs sm:text-sm text-red-600 hidden sm:block">
                        + Delivery details
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            {activeStep === "address" && (
              <div className="bg-white rounded-lg shadow-sm p-4 pb-2 sm:p-6 sm:pb-4 md:p-8 lg:p-10 xl:p-12">
                <form className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <FloatingLabelInput
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        error={!!getFieldError('firstName')}
                        helperText={getFieldError('firstName')}
                      />
                    </div>
                    <div>
                      <FloatingLabelInput
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        error={!!getFieldError('lastName')}
                        helperText={getFieldError('lastName')}
                      />
                    </div>
                  </div>

                  {/* Address Fields */}
                  <div>
                    <FloatingLabelInput
                      label="Address Line 1"
                      name="address1"
                      value={formData.address1}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      error={!!getFieldError('address1')}
                      helperText={getFieldError('address1')}
                    />
                  </div>

                  <div>
                    <FloatingLabelInput
                      label="Additional address details"
                      name="address2"
                      value={formData.address2}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  {/* Country */}
                  <div className="relative w-full">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      className={cn(
                        "block w-full h-12 py-3 px-3 border rounded-none bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-black transition-all [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white]",
                        !formData.country && formTouched.country
                          ? "border-red-500"
                          : "border-gray-300"
                      )}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <label
                      className={cn(
                        "absolute left-3 top-3 pointer-events-none transition-all duration-200",
                        formData.country && formData.country !== ""
                          ? "-translate-y-6 scale-95 text-sm bg-white px-1 z-10 font-semibold"
                          : "text-base text-gray-500",
                        !formData.country && formTouched.country
                          ? "text-red-600"
                          : "text-gray-700"
                      )}
                    >
                      Country *
                    </label>
                  </div>

                  <div>
                    <FloatingLabelInput
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      error={!!getFieldError('city')}
                      helperText={getFieldError('city')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <div className="relative w-full">
                        {availableStates.length > 0 ? (
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={cn(
                              "block w-full h-12 py-3 px-3 border rounded-none bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-black transition-all [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white]",
                              !formData.state && formTouched.state
                                ? "border-red-500"
                                : "border-gray-300"
                            )}
                          >
                            <option value=""></option>
                            {availableStates.map((state) => (
                              <option key={state.code} value={state.code}>
                                {state.name}
                              </option>
                            ))}
                            <option value="OTHER">Enter your state</option>
                          </select>
                        ) : (
                          <FloatingLabelInput
                            label="State/Province"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            error={!formData.state && formTouched.state}
                          />
                        )}
                        {availableStates.length > 0 && (
                          <label
                            className={cn(
                              "absolute left-3 top-3 pointer-events-none transition-all duration-200",
                              formData.state && formData.state !== ""
                                ? "-translate-y-6 scale-95 text-sm bg-white px-1 z-10 font-semibold"
                                : "text-base text-gray-500",
                              !formData.state && formTouched.state
                                ? "text-red-600"
                                : "text-gray-700"
                            )}
                          >
                            State *
                          </label>
                        )}
                      </div>
                    </div>
                    {formData.state === "OTHER" &&
                      availableStates.length > 0 && (
                        <div>
                          <FloatingLabelInput
                            label="Enter your state/province"
                            name="customState"
                            value={formData.customState || ""}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                          />
                        </div>
                      )}
                    <div>
                      <FloatingLabelInput
                        label="Zip Code"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        error={!!getFieldError('zipCode')}
                        helperText={getFieldError('zipCode')}
                      />
                    </div>
                  </div>

                  <div>
                    <FloatingLabelInput
                      label="E-mail address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      error={!!getFieldError('email')}
                      helperText={getFieldError('email')}
                    />
                  </div>

                  {/* Account Creation */}
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="createAccount"
                        checked={formData.createAccount}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-[#B01E23] focus:ring-[#B01E23] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Create an account to enjoy all the benefits of our
                        registered customers.
                      </span>
                    </label>

                    {formData.createAccount && (
                      <div>
                        <FloatingLabelInput
                          label="Password"
                          name="password"
                          type="password"
                          value={formData.password || ""}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required={formData.createAccount}
                          error={!!getFieldError('password')}
                          helperText={getFieldError('password')}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <FloatingLabelInput
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder=""
                      required
                      error={!!getFieldError('phone')}
                      helperText={getFieldError('phone')}
                    />
                  </div>

                  {/* Other checkboxes */}
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="billingAddressSame"
                        checked={formData.billingAddressSame}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#B01E23] focus:ring-[#B01E23] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Billing Address same as Delivery Address
                      </span>
                    </label>

                    {/* Billing Address Fields */}
                    {!formData.billingAddressSame && (
                      <div className="space-y-6 mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Billing Address
                        </h3>

                        {/* Billing Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div>
                            <FloatingLabelInput
                              label="First Name"
                              name="billingFirstName"
                              value={formData.billingFirstName}
                              onChange={handleInputChange}
                              onBlur={handleBlur} // Mark as touched on blur
                              required
                            />
                          </div>
                          <div>
                            <FloatingLabelInput
                              label="Last Name"
                              name="billingLastName"
                              value={formData.billingLastName}
                              onChange={handleInputChange}
                              onBlur={handleBlur} // Mark as touched on blur
                              required
                            />
                          </div>
                        </div>

                        {/* Billing Address Fields */}
                        <div>
                          <FloatingLabelInput
                            label="Address Line 1"
                            name="billingAddress1"
                            value={formData.billingAddress1}
                            onChange={handleInputChange}
                            onBlur={handleBlur} // Mark as touched on blur
                            required
                          />
                        </div>

                        {/* Billing Country */}
                        <div className="relative w-full">
                          <select
                            name="billingCountry"
                            value={formData.billingCountry}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className="block w-full h-12 py-3 px-3 border rounded-none bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-black transition-all [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] border-gray-300"
                          >
                            {COUNTRIES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          <label className="absolute left-3 top-3 pointer-events-none transition-all duration-200 -translate-y-6 scale-95 text-sm bg-white px-1 z-10 font-semibold text-gray-700">
                            Country *
                          </label>
                        </div>

                        <div>
                          <FloatingLabelInput
                            label="Additional address details"
                            name="billingAddress2"
                            value={formData.billingAddress2}
                            onChange={handleInputChange}
                            onBlur={handleBlur} // Mark as touched on blur
                          />
                        </div>

                        <div>
                          <FloatingLabelInput
                            label="City"
                            name="billingCity"
                            value={formData.billingCity}
                            onChange={handleInputChange}
                            onBlur={handleBlur} // Mark as touched on blur
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div>
                            <div className="relative w-full">
                              {availableBillingStates.length > 0 ? (
                                <select
                                  name="billingState"
                                  value={formData.billingState}
                                  onChange={handleInputChange}
                                  onBlur={handleBlur}
                                  required
                                  className="block w-full h-12 py-3 px-3 border rounded-none bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-black transition-all [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] border-gray-300"
                                >
                                  <option value=""></option>
                                  {availableBillingStates.map((state) => (
                                    <option key={state.code} value={state.code}>
                                      {state.name}
                                    </option>
                                  ))}
                                  <option value="OTHER">
                                    Enter your state
                                  </option>
                                </select>
                              ) : (
                                <FloatingLabelInput
                                  label="State/Province"
                                  name="billingState"
                                  value={formData.billingState}
                                  onChange={handleInputChange}
                                  onBlur={handleBlur}
                                  required
                                />
                              )}
                              {availableBillingStates.length > 0 && (
                                <label
                                  className={`absolute left-3 top-3 pointer-events-none transition-all duration-200 ${
                                    formData.billingState &&
                                    formData.billingState !== ""
                                      ? "-translate-y-6 scale-95 text-sm bg-white px-1 z-10 font-semibold"
                                      : "text-base text-gray-500"
                                  } text-gray-700`}
                                >
                                  State *
                                </label>
                              )}
                            </div>
                          </div>
                          {formData.billingState === "OTHER" &&
                            availableBillingStates.length > 0 && (
                              <div>
                                <FloatingLabelInput
                                  label="Enter your state/province"
                                  name="customBillingState"
                                  value={formData.customBillingState || ""}
                                  onChange={handleInputChange}
                                  onBlur={handleBlur}
                                  required
                                />
                              </div>
                            )}
                          <div>
                            <FloatingLabelInput
                              label="Zip Code"
                              name="billingZipCode"
                              value={formData.billingZipCode}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      // Mark all required fields as touched if they are empty
                      setFormTouched((prev) => ({
                        ...prev,
                        firstName: prev.firstName || !formData.firstName,
                        lastName: prev.lastName || !formData.lastName,
                        address1: prev.address1 || !formData.address1,
                        city: prev.city || !formData.city,
                        state: prev.state || !formData.state,
                        zipCode: prev.zipCode || !formData.zipCode,
                        email: prev.email || !formData.email,
                        phone: prev.phone || !formData.phone,
                        password: formData.createAccount
                          ? prev.password || !formData.password
                          : prev.password,
                      }));
                      if (isAddressComplete) {
                        setActiveStep("payment");
                        initializePayment();
                      }
                    }}
                    className="w-full bg-black hover:bg-black text-white py-3 mt-2 mb-8 md:mt-4 md:mb-0"
                    disabled={!isAddressComplete}
                  >
                    Continue to Payment
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}

            {activeStep === "payment" && (
              <div className="bg-white rounded-lg shadow-sm p-4 pb-2 sm:p-6 sm:pb-4 md:p-8 lg:p-10 xl:p-12">
                {/* Address Details */}
                <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Address Details
                    </h3>
                    <button
                      onClick={() => setActiveStep("address")}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p>{formData.address1}</p>
                        {formData.address2 && <p>{formData.address2}</p>}
                        <p>
                          {formData.city}, {formData.state} {formData.zipCode}
                        </p>
                        <p>
                          {COUNTRIES.find((c) => c.code === formData.country)
                            ?.name || formData.country}
                        </p>
                        <p>{formData.email}</p>
                        <p>{formData.phone}</p>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Billing Address
                      </h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        {formData.billingAddressSame ? (
                          <p className="italic">Same as shipping address</p>
                        ) : (
                          <>
                            <p>
                              {formData.billingFirstName}{" "}
                              {formData.billingLastName}
                            </p>
                            <p>{formData.billingAddress1}</p>
                            {formData.billingAddress2 && (
                              <p>{formData.billingAddress2}</p>
                            )}
                            <p>
                              {formData.billingCity}, {formData.billingState}{" "}
                              {formData.billingZipCode}
                            </p>
                            <p>
                              {COUNTRIES.find(
                                (c) => c.code === formData.billingCountry
                              )?.name || formData.billingCountry}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <CreditCard className="w-5 h-5 text-gray-700 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Choose Payment Method
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* PayPal */}
                    <div className="group">
                      <label
                        className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          formData.selectedPaymentMethod === "paypal"
                            ? "border-black bg-gray-100 shadow-md"
                            : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="relative mr-4">
                            <input
                              type="radio"
                              name="selectedPaymentMethod"
                              value="paypal"
                              checked={
                                formData.selectedPaymentMethod === "paypal"
                              }
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                formData.selectedPaymentMethod === "paypal"
                                  ? "bg-black border-black"
                                  : "border-gray-300 group-hover:border-gray-500"
                              }`}
                            >
                              {formData.selectedPaymentMethod === "paypal" && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="bg-blue-600 px-4 py-2 rounded text-white font-semibold text-sm">
                              PayPal
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            Secure payment
                          </span>
                          <Shield className="w-4 h-4 text-gray-600" />
                        </div>
                      </label>

                      {/* PayPal Buttons */}
                      {formData.selectedPaymentMethod === "paypal" && (
                        <div className="mt-4 p-6 border border-gray-300 rounded-xl bg-gray-50">
                          <div className="mb-4">
                            <p className="text-sm text-gray-700 mb-2">
                              Complete your payment with PayPal
                            </p>
                          </div>
                          <PayPalButtons
                            items={items.map((i) => ({
                              id: i.product.id,
                              quantity: i.quantity,
                            }))}
                            onApproveSuccess={handlePaymentSuccess}
                            orderId={orderId!}
                          />
                        </div>
                      )}
                    </div>

                    {/* Credit Card */}
                    <div className="group">
                      <label
                        className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          formData.selectedPaymentMethod === "CREDIT_CARD"
                            ? "border-black bg-gray-100 shadow-md"
                            : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="relative mr-4">
                            <input
                              type="radio"
                              name="selectedPaymentMethod"
                              value="CREDIT_CARD"
                              checked={
                                formData.selectedPaymentMethod === "CREDIT_CARD"
                              }
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                formData.selectedPaymentMethod === "CREDIT_CARD"
                                  ? "bg-black border-black"
                                  : "border-gray-300 group-hover:border-gray-500"
                              }`}
                            >
                              {formData.selectedPaymentMethod ===
                                "CREDIT_CARD" && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="w-8 h-8 text-gray-600 mr-3" />
                            <span className="text-base font-medium text-gray-900">
                              Credit or Debit Card
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* Mastercard */}
                          <div className="relative w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center">
                            <svg
                              className="w-8 h-5"
                              viewBox="0 0 32 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="12" cy="10" r="6" fill="#EB001B" />
                              <circle cx="20" cy="10" r="6" fill="#F79E1B" />
                              <path
                                d="M16 6c1.1 1.2 1.8 2.8 1.8 4.5s-.7 3.3-1.8 4.5c-1.1-1.2-1.8-2.8-1.8-4.5S14.9 7.2 16 6z"
                                fill="#FF5F00"
                              />
                            </svg>
                          </div>
                          {/* Visa */}
                          <div className="relative w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center">
                            <svg
                              className="w-8 h-5"
                              viewBox="0 0 32 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="32"
                                height="20"
                                rx="2"
                                fill="#1A1F71"
                              />
                              <text
                                x="6"
                                y="13"
                                fontSize="8"
                                fill="#fff"
                                fontFamily="Arial, sans-serif"
                                fontWeight="bold"
                              >
                                VISA
                              </text>
                            </svg>
                          </div>
                          {/* American Express */}
                          <div className="relative w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center">
                            <svg
                              className="w-8 h-5"
                              viewBox="0 0 32 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="32"
                                height="20"
                                rx="2"
                                fill="#2E77BC"
                              />
                              <text
                                x="4"
                                y="13"
                                fontSize="7"
                                fill="#fff"
                                fontFamily="Arial, sans-serif"
                                fontWeight="bold"
                              >
                                AMEX
                              </text>
                            </svg>
                          </div>
                          {/* Discover */}
                          <div className="relative w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center">
                            <svg
                              className="w-8 h-5"
                              viewBox="0 0 32 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="32"
                                height="20"
                                rx="2"
                                fill="#FF6000"
                              />
                              <text
                                x="2"
                                y="13"
                                fontSize="6"
                                fill="#fff"
                                fontFamily="Arial, sans-serif"
                                fontWeight="bold"
                              >
                                DISC
                              </text>
                            </svg>
                          </div>
                        </div>
                      </label>

                      {/* Payment Form for Credit Card */}
                      {formData.selectedPaymentMethod === "CREDIT_CARD" && (
                        <div className="mt-4 p-6 border border-gray-300 rounded-xl bg-gray-50">
                          <div className="mb-4">
                            <p className="text-sm text-gray-700 mb-2">
                              Enter your card details securely
                            </p>
                          </div>

                          {isStripeEnabled ? (
                            // Stripe Payment Form
                            isLoading && !clientSecret ? (
                              <div className="flex flex-col items-center justify-center py-8">
                                <div className="w-10 h-10 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                                <p className="text-gray-700 text-sm font-medium">
                                  Initializing secure payment...
                                </p>
                              </div>
                            ) : stripePromise && clientSecret ? (
                              <Elements
                                stripe={stripePromise}
                                options={{
                                  clientSecret,
                                  appearance: {
                                    theme: "stripe",
                                    variables: {
                                      colorPrimary: "#000000",
                                      colorBackground: "#ffffff",
                                      colorText: "#374151",
                                      borderRadius: "8px",
                                      fontFamily: "system-ui, sans-serif",
                                    },
                                  },
                                }}
                              >
                                <PaymentForm
                                  clientSecret={clientSecret}
                                  orderId={orderId!}
                                  onSuccess={handlePaymentSuccess}
                                  onBack={() => setActiveStep("address")}
                                  isLoading={isLoading}
                                  setIsLoading={setIsLoading}
                                  setPaymentModal={setPaymentModal}
                                />
                              </Elements>
                            ) : (
                              <div className="text-center py-8">
                                <div className="mb-3">
                                  <svg
                                    className="w-12 h-12 text-gray-400 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                  </svg>
                                </div>
                                <p className="text-gray-700 text-sm font-medium mb-2">
                                  Failed to load payment form
                                </p>
                                <p className="text-gray-500 text-xs">
                                  Please refresh the page or try again later.
                                </p>
                              </div>
                            )
                          ) : (
                            // PayPal Card Form
                            <PayPalCardForm
                              onSuccess={handlePaymentSuccess}
                              onBack={() => setActiveStep("address")}
                              isLoading={isLoading}
                              setIsLoading={setIsLoading}
                              items={items}
                              formData={formData}
                              effectiveGrandTotal={effectiveGrandTotal}
                              discountAmount={discountAmount}
                              voucherCode={voucherCode}
                              orderId={orderId!}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    

                    {/* Google Pay */}
                    {!isStripeEnabled && (
                      <div className="group">
                        <label
                          className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            formData.selectedPaymentMethod === "googlepay"
                              ? "border-black bg-gray-100 shadow-md"
                              : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="relative mr-4">
                              <input
                                type="radio"
                                name="selectedPaymentMethod"
                                value="googlepay"
                                checked={
                                  formData.selectedPaymentMethod === "googlepay"
                                }
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  formData.selectedPaymentMethod === "googlepay"
                                    ? "bg-black border-black"
                                    : "border-gray-300 group-hover:border-gray-500"
                                }`}
                              >
                                {formData.selectedPaymentMethod ===
                                  "googlepay" && (
                                  <Check className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="bg-gray-800 px-4 py-2 rounded text-white font-semibold text-sm">
                                Google Pay
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-2">
                              Quick & secure
                            </span>
                            <Shield className="w-4 h-4 text-gray-600" />
                          </div>
                        </label>

                        {/* Google Pay Component */}
                        {formData.selectedPaymentMethod === "googlepay" && (
                          <div className="mt-4 p-6 border border-gray-300 rounded-xl bg-gray-50">
                            <div className="mb-4">
                              <p className="text-sm text-gray-700 mb-2">
                                Pay with Google Pay
                              </p>
                            </div>
                            {paypalClientId && (
                              <PayPalScriptProvider
                                options={{
                                  "client-id": paypalClientId,
                                  currency: "USD",
                                  components: "googlepay",
                                }}
                              >
                                <GooglePayWithPaypal
                                  totalAmount={effectiveGrandTotal}
                                  onCaptureSuccess={handlePaymentSuccess}
                                  termsAccepted={formData.acceptTerms}
                                  onTermsError={(message) =>
                                    toast.error(message)
                                  }
                                />
                              </PayPalScriptProvider>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Methods */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">
                    Select delivery method
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={formData.shippingMethod === "standard"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-[#B01E23] focus:ring-[#B01E23]"
                        />
                        <span className="ml-3 text-sm font-medium">
                          Shipping
                        </span>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        Free Shipping
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={formData.shippingMethod === "express"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-[#B01E23] focus:ring-[#B01E23]"
                        />
                        <span className="ml-3 text-sm font-medium">
                          2nd Day Express
                        </span>
                      </div>
                      <span className="text-sm font-medium">($15.00)</span>
                    </label>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-[#B01E23] mr-2" />
                    <p className="text-sm text-gray-700">
                      Your payment information is secure. We use encryption to
                      protect your data.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-6">
              {/* Desktop Header for Order Summary */}
              <div className="hidden lg:flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Order overview
                  </h2>
                </div>
                <button
                  onClick={() => router.push("/cart")}
                  className="text-sm text-gray-600 underline hover:text-gray-800"
                >
                  « Back to cart
                </button>
              </div>

              <div
                className={`${showOrderSummary ? "block" : "hidden"} lg:block`}
              >
                {/* Cart Items in Order Summary */}
                <div className="space-y-4 mb-6 max-h-[28rem] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border-b">
                      <div className="relative w-32 h-36 flex-shrink-0">
                        <Image
                          src={
                            item.product.images?.[0]?.url || "/placeholder.svg"
                          }
                          alt={item.product.name}
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-black text-sm uppercase mb-2 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <div className="space-y-1 mb-2">
                          <p className="text-xs text-gray-700">
                            Color:{" "}
                            {item.product.colorDetails?.[0]?.name || "Black"}
                          </p>
                          <p className="text-xs text-gray-700">
                            Size: {item.size}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-700">
                            Total Price{" "}
                            <span className="font-bold text-black">
                              <Currency
                                value={item.unitPrice * item.quantity}
                              />
                            </span>
                          </p>
                          <p className="text-sm text-gray-700">
                            Quantity {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="bg-gray-100 p-4 rounded">
                  <table className="w-full">
                    <thead className="hidden">
                      <tr className="border-b border-gray-300">
                        <th className="text-left pb-2" colSpan={2}>
                          <strong className="text-lg font-bold text-black">
                            Order overview
                          </strong>
                          <span className="text-sm font-normal text-gray-600 ml-2">
                            ({items.length} Items)
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 text-base text-black">Subtotal</td>
                        <td className="py-2 text-right">
                          <strong className="text-base text-black">
                            <Currency value={totalPrice} />
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-base text-black">Shipping</td>
                        <td className="py-2 text-right">
                          <strong className="text-base text-green-600">
                            {shippingPrice === 0 ? (
                              "Free"
                            ) : (
                              <Currency value={shippingPrice} />
                            )}
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-base text-black">
                          Estimated Tax
                        </td>
                        <td className="py-2 text-right">
                          <strong className="text-base text-black">
                            <Currency value="0" />
                          </strong>
                        </td>
                      </tr>
                      {discountAmount > 0 && (
                        <tr>
                          <td className="py-2 text-base text-black">
                            Discount
                          </td>
                          <td className="py-2 text-right">
                            <strong className="text-base text-green-600">
                              -<Currency value={discountAmount} />
                            </strong>
                          </td>
                        </tr>
                      )}
                      <tr className="border-t-2 border-gray-400">
                        <td className="py-3 text-lg font-bold text-black">
                          Your order
                        </td>
                        <td className="py-3 text-right">
                          <strong className="text-lg font-bold text-black">
                            <Currency value={effectiveGrandTotal} />
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {voucherMessage && (
                    <div
                      className={`mt-2 p-2 text-sm italic text-center ${
                        discountAmount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {voucherMessage}
                    </div>
                  )}
                </div>

                {/* Voucher Code */}
                <div className="mt-6">
                  <button
                    type="button"
                    className="text-sm font-medium text-black mb-2 w-full text-left"
                  >
                    <strong>Redeem a voucher code</strong>
                  </button>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Voucher code"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B01E23]"
                    />
                    <Button
                      onClick={handleApplyVoucher}
                      disabled={voucherApplying}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      {voucherApplying ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <PaymentProcessingModal
        isOpen={paymentModal.isOpen}
        status={paymentModal.status}
        message={paymentModal.message}
      />
    </div>
  );
};

export default CheckoutPage;
