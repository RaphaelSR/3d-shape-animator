import { ScrollArea, Stack, Divider, ActionIcon, Group, Text } from '@mantine/core';
import { IconSun, IconMoon, IconHelp, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useSidebarStore } from '@/hooks/useSidebarStore';
import { GeometrySelector } from './GeometrySelector';
import { ColorSelector } from './ColorSelector';
import { MotionControls } from './MotionControls';
import { ExportControls } from './ExportControls';
import { ControlsHelpModal } from './ControlsHelpModal';
import { LanguageSelector } from './LanguageSelector';
import { Footer } from './Footer';

export function Sidebar() {
  const { theme, toggleTheme } = useAppStore();
  const { isMobile, close } = useSidebarStore();
  const t = useTranslations();
  const [helpOpened, setHelpOpened] = useState(false);

  return (
    <Stack h="100vh" gap={0}>
      <Group justify="space-between" p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Text size="lg" fw={700}>
          {t.app.title}
        </Text>
        <Group gap="xs">
          {isMobile && (
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={close}
              aria-label="Close sidebar"
            >
              <IconX size={18} />
            </ActionIcon>
          )}
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={() => setHelpOpened(true)}
            aria-label="Show controls help"
          >
            <IconHelp size={18} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
          </ActionIcon>
        </Group>
      </Group>

      <ScrollArea flex={1} p="md">
        <Stack gap="xl">
          <LanguageSelector />
          <Divider />
          <GeometrySelector />
          <Divider />
          <ColorSelector />
          <Divider />
          <MotionControls />
          <Divider />
          <ExportControls />
        </Stack>
      </ScrollArea>

      <ControlsHelpModal
        opened={helpOpened}
        onClose={() => setHelpOpened(false)}
      />

      {!isMobile && <Footer />}
    </Stack>
  );
}
