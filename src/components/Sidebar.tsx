import { ScrollArea, Stack, Divider, ActionIcon, Group, Text } from '@mantine/core';
import { IconSun, IconMoon, IconHelp } from '@tabler/icons-react';
import { useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import { GeometrySelector } from './GeometrySelector';
import { ColorSelector } from './ColorSelector';
import { MotionControls } from './MotionControls';
import { ExportControls } from './ExportControls';
import { ControlsHelpModal } from './ControlsHelpModal';
import { Footer } from './Footer';

export function Sidebar() {
  const { theme, toggleTheme } = useAppStore();
  const [helpOpened, setHelpOpened] = useState(false);

  return (
    <Stack h="100vh" gap={0}>
      <Group justify="space-between" p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Text size="lg" fw={700}>
          Geometry Motion Studio
        </Text>
        <Group gap="xs">
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

      <Footer />
    </Stack>
  );
}
