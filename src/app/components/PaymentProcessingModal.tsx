"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";

interface PaymentProcessingModalProps {
  isOpen: boolean;
  status: "processing" | "success" | "error";
  message?: string;
}

const PaymentProcessingModal: React.FC<PaymentProcessingModalProps> = ({
  isOpen,
  status,
  message,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full text-center"
          >
            <div className="mb-4">
              {status === "processing" && (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                    <CreditCard className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Processing Payment
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Please wait while we process your payment securely...
                  </p>
                </>
              )}
              
              {status === "success" && (
                <>
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {message || "Your payment has been processed successfully."}
                  </p>
                </>
              )}
              
              {status === "error" && (
                <>
                  <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Payment Failed
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {message || "There was an error processing your payment. Please try again."}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentProcessingModal;