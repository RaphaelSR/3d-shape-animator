import { useEffect } from 'react';
import { AppShell, Drawer } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useGesture } from '@use-gesture/react';
import { useSidebarStore } from '@/hooks/useSidebarStore';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  onHelpOpen: () => void;
}

export function ResponsiveLayout({ children, onHelpOpen }: ResponsiveLayoutProps) {
  const { isOpen, open, close, setIsMobile } = useSidebarStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setIsMobile(isMobile || false);
    if (!isMobile && isOpen) {
      close();
    }
  }, [isMobile, isOpen, close, setIsMobile]);

  // Gestos para abrir/fechar o drawer no mobile
  const bind = useGesture({
    onDrag: ({ movement: [mx], direction: [dx], velocity: [vx], cancel }) => {
      if (!isMobile) return;
      
      // Swipe da esquerda para a direita para abrir
      if (!isOpen && dx > 0 && mx > 50 && vx > 0.5) {
        open();
        cancel();
      }
      
      // Swipe da direita para a esquerda para fechar
      if (isOpen && dx < 0 && mx < -50 && vx < -0.5) {
        close();
        cancel();
      }
    },
  });

  if (isMobile) {
    return (
      <div {...bind()} style={{ height: '100vh', overflow: 'hidden' }}>
        <MobileHeader onHelpOpen={onHelpOpen} />
        
        <Drawer
          opened={isOpen}
          onClose={close}
          size="85%"
          position="left"
          withCloseButton={false}
          styles={{
            content: {
              padding: 0,
            },
            body: {
              padding: 0,
              height: '100%',
            },
          }}
          overlayProps={{
            backgroundOpacity: 0.5,
            blur: 4,
          }}
          transitionProps={{
            transition: 'slide-right',
            duration: 200,
          }}
        >
          <Sidebar />
        </Drawer>

        <div style={{ height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <AppShell
      navbar={{
        width: 320,
        breakpoint: 'md',
      }}
      styles={{
        main: {
          padding: 0,
        },
        navbar: {
          border: 'none',
          borderRight: '1px solid var(--mantine-color-gray-3)',
        },
      }}
    >
      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
