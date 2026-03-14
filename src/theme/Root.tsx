import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BrowserOnly from '@docusaurus/BrowserOnly';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
    },
  },
});

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserOnly>{() => {
        const MousePulse = require('../components/MousePulse').default;
        return <MousePulse />;
      }}</BrowserOnly>
      {children}
    </QueryClientProvider>
  );
}
