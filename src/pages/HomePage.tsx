import { useState } from 'react';
import { Scene } from '@/components/Scene';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { ControlsHelpModal } from '@/components/ControlsHelpModal';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export function HomePage() {
  // Enable keyboard shortcuts
  useKeyboardShortcuts();
  
  const [helpOpened, setHelpOpened] = useState(false);

  return (
    <>
      <ResponsiveLayout onHelpOpen={() => setHelpOpened(true)}>
        <Scene />
      </ResponsiveLayout>
      
      <ControlsHelpModal
        opened={helpOpened}
        onClose={() => setHelpOpened(false)}
      />
    </>
  );
}
