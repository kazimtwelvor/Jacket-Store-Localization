"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CreditCard, Lock } from "lucide-react";
import Button from "../../ui/button";
import { toast } from "react-hot-toast";

type PayPalCardFormProps = {
  onSuccess: () => void;
  onBack: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  items: any[];
  formData: any;
  effectiveGrandTotal: number;
  discountAmount: number;
  voucherCode: string;
  orderId: string;
};

export default function PayPalCardForm({
  onSuccess,
  onBack,
  isLoading,
  setIsLoading,
  items,
  formData,
  effectiveGrandTotal,
  discountAmount,
  voucherCode,
  orderId,
}: PayPalCardFormProps) {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [cardType, setCardType] = useState<string>("");

  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
    return '';
  };

  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const matches = cleanValue.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return cleanValue;
    }
  };

  const formatExpiryDate = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
      return cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
    }
    return cleanValue;
  };

  const validateCard = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    
    const cleanCardNumber = cardData.cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      newErrors.cardNumber = 'Invalid card number';
    }
    
    if (!cardData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    } else {
      const [month, year] = cardData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!cardData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (cardData.cvv.length < 3 || cardData.cvv.length > 4) {
      newErrors.cvv = 'Invalid CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      setCardType(detectCardType(formattedValue));
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return <div className="w-8 h-5 bg-blue-600 text-white text-xs font-bold flex items-center justify-center rounded">VISA</div>;
      case 'mastercard':
        return <div className="w-8 h-5 flex items-center justify-center">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full -ml-1"></div>
        </div>;
      case 'amex':
        return <div className="w-8 h-5 bg-blue-500 text-white text-xs font-bold flex items-center justify-center rounded">AMEX</div>;
      case 'discover':
        return <div className="w-8 h-5 bg-orange-500 text-white text-xs font-bold flex items-center justify-center rounded">DISC</div>;
      default:
        return <CreditCard className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCard()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/paypal/card-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.product.id,
            quantity: i.quantity,
          })),
          cardDetails: cardData,
          customerInfo: {
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            address: `${formData.address1}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,
          },
          totalAmount: effectiveGrandTotal,
          orderId,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      toast.success('Payment successful!');
      onSuccess();
    } catch (err: any) {
      console.error("Payment error:", err);
      setErrors({ general: "Payment failed. Please check your card details and try again." });
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md border border-red-200">{errors.general}</div>}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            name="cardholderName"
            value={cardData.cardholderName}
            onChange={handleInputChange}
            className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 transition-colors ${
              errors.cardholderName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black'
            }`}
            placeholder="John Doe"
            autoComplete="cc-name"
          />
          {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleInputChange}
              className={`w-full border rounded-md p-3 pr-12 focus:outline-none focus:ring-2 transition-colors ${
                errors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black'
              }`}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              autoComplete="cc-number"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getCardIcon()}
            </div>
          </div>
          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              name="expiryDate"
              value={cardData.expiryDate}
              onChange={handleInputChange}
              className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 transition-colors ${
                errors.expiryDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black'
              }`}
              placeholder="MM/YY"
              maxLength={5}
              autoComplete="cc-exp"
            />
            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              CVV
              <Lock className="w-3 h-3 ml-1 text-gray-500" />
            </label>
            <input
              type="text"
              name="cvv"
              value={cardData.cvv}
              onChange={handleInputChange}
              className={`w-full border rounded-md p-3 focus:outline-none focus:ring-2 transition-colors ${
                errors.cvv ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black'
              }`}
              placeholder="123"
              maxLength={4}
              autoComplete="cc-csc"
            />
            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md border">
        <div className="flex items-center text-sm text-gray-600">
          <Lock className="w-4 h-4 mr-2" />
          <span>Your payment information is encrypted and secure</span>
        </div>
      </div>
      
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
          disabled={isLoading}
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
}