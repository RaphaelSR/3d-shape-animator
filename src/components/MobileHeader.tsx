import { Group, Text, ActionIcon, Burger } from '@mantine/core';
import { IconSun, IconMoon, IconHelp } from '@tabler/icons-react';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useSidebarStore } from '@/hooks/useSidebarStore';

interface MobileHeaderProps {
  onHelpOpen: () => void;
}

export function MobileHeader({ onHelpOpen }: MobileHeaderProps) {
  const { theme, toggleTheme } = useAppStore();
  const { isOpen, toggle } = useSidebarStore();
  const t = useTranslations();

  return (
    <Group
      h={60}
      px="md"
      justify="space-between"
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        backgroundColor: 'var(--mantine-color-body)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Group>
        <Burger
          opened={isOpen}
          onClick={toggle}
          size="sm"
          aria-label="Toggle navigation"
        />
        <Text size="lg" fw={700}>
          {t.app.title}
        </Text>
      </Group>

      <Group gap="xs">
        <ActionIcon
          variant="subtle"
          onClick={onHelpOpen}
          aria-label="Show controls help"
        >
          <IconHelp size={18} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
        </ActionIcon>
      </Group>
    </Group>
  );
}
