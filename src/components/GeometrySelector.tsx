import { Stack, Button, Text, ScrollArea } from '@mantine/core';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { GEOMETRY_CONFIGS } from '@/utils/types';

export function GeometrySelector() {
  const { selectedGeometry, setGeometry } = useAppStore();
  const t = useTranslations();

  return (
    <Stack gap="md">
      <Text size="sm" fw={600}>
        {t.geometry.title}
      </Text>
      <ScrollArea h={300}>
        <Stack gap="xs">
          {GEOMETRY_CONFIGS.map(config => (
            <Button
              key={config.type}
              variant={selectedGeometry === config.type ? 'filled' : 'subtle'}
              fullWidth
              justify="flex-start"
              leftSection={<span style={{ fontSize: '16px' }}>{config.icon}</span>}
              onClick={() => setGeometry(config.type)}
              size="sm"
            >
              {t.geometry[config.type]}
            </Button>
          ))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
