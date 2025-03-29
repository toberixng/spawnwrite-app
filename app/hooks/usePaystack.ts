'use client';

import { useEffect, useState } from 'react';

export const usePaystack = (publicKey: string) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (document.getElementById('paystack-script')) {
      setIsScriptLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => console.error('Failed to load Paystack script');

    // Append to document
    document.body.appendChild(script);

    // Cleanup
    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initializePayment = (options: {
    email: string;
    amount: number; // In kobo (e.g., 1000 = 10 NGN)
    onSuccess: (response: any) => void;
    onClose: () => void;
  }) => {
    if (!isScriptLoaded || !window.PaystackPop) {
      console.error('Paystack script not loaded yet');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: options.email,
      amount: options.amount,
      currency: 'NGN',
      ref: 'txn_' + Math.random().toString(36).substring(2), // Unique transaction ref
      callback: options.onSuccess,
      onClose: options.onClose,
    });

    handler.openIframe();
  };

  return { initializePayment, isScriptLoaded };
};