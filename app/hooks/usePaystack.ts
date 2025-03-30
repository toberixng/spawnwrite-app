import { useCallback, useEffect } from 'react';

interface PaystackProps {
  email: string;
  amount: number;
  publicKey: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const usePaystack = ({ email, amount, publicKey, onSuccess, onClose }: PaystackProps) => {
  // Load Paystack script once
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array—loads once on mount

  // Return a function to initialize payment
  const initializePayment = useCallback(() => {
    if (!(window as any).PaystackPop) {
      console.error('Paystack script not loaded yet');
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: publicKey,
      email,
      amount: amount * 100, // Convert to kobo
      currency: 'NGN',
      callback: onSuccess,
      onClose,
    });
    handler.openIframe();
  }, [email, amount, publicKey, onSuccess, onClose]);

  return { initializePayment };
};