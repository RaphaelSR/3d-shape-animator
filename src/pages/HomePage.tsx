import { AppShell } from '@mantine/core';
import { Sidebar } from '@/components/Sidebar';
import { Scene } from '@/components/Scene';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export function HomePage() {
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <AppShell
      navbar={{
        width: 350,
        breakpoint: 'md',
      }}
      padding={0}
      styles={{
        main: {
          height: '100vh',
          overflow: 'hidden',
        },
      }}
    >
      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Scene />
      </AppShell.Main>
    </AppShell>
  );
}
