import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BrowserOnly from '@docusaurus/BrowserOnly';
import VersionBanner from '../components/VersionBanner';

// gcTime: 0 ensures no GC timers keep the Node.js process alive after build.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 0,
      retry: 1,
    },
  },
});

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserOnly>{() => <VersionBanner />}</BrowserOnly>
      <BrowserOnly>{() => {
        const MousePulse = require('../components/MousePulse').default;
        return <MousePulse />;
      }}</BrowserOnly>
      {children}
    </QueryClientProvider>
  );
}
