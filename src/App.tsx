import { MantineProvider, createTheme } from '@mantine/core';
import { useAppStore } from '@/hooks/useAppStore';
import { Studio } from '@/components/Studio';
import '@mantine/core/styles.css';
import '@/styles/globals.css';
const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: 6,
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  defaultRadius: 'md',
  headings: { fontWeight: '600' },
  colors: {
    dark: [
      '#e8edf7',
      '#c2cad9',
      '#9aa6bb',
      '#637087',
      '#363f50',
      '#262d3b',
      '#1b212d',
      '#181d27',
      '#131720',
      '#0c1018',
    ],
  },
});
export function App() {
  const colorScheme = useAppStore(state => state.theme);
  return (
    <MantineProvider theme={theme} forceColorScheme={colorScheme}>
      <Studio />
    </MantineProvider>
  );
}
