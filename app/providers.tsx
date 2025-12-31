import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import type { ReactNode } from 'react';
import { toast } from 'sonner';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60,
    },
  },
  queryCache: new QueryCache({
    onError: (error: any) => {
      const message = error?.error?.message || 'A network error occurred';
      const code = error?.error?.code ? ` [${error.error.code}]` : '';
      toast.error(`${message}${code}`);
    },
  }),
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={client}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
