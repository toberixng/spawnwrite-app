// app/layout.tsx
import { ChakraProvider } from '@chakra-ui/react';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Replace 'your-gsc-verification-code' with the actual code from GSC */}
        <meta name="google-site-verification" content="your-gsc-verification-code" />
      </head>
      <body>
        <ChakraProvider>{children}</ChakraProvider>
        {/* Google Analytics Script - Replace 'G-XXXXXX' with your GA Tracking ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GHRJQPY730"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GHRJQPY730');
          `}
        </Script>
      </body>
    </html>
  );
}