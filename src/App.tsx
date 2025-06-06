import { MantineProvider, createTheme } from '@mantine/core';
import { useAppStore } from '@/hooks/useAppStore';
import { HomePage } from '@/pages/HomePage';
import '@mantine/core/styles.css';
import '@/styles/globals.css';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
});

export function App() {
  const { theme: appTheme } = useAppStore();

  return (
    <MantineProvider theme={theme} forceColorScheme={appTheme}>
      <HomePage />
    </MantineProvider>
  );
}
