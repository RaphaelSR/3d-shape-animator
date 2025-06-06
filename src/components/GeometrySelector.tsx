import { Stack, Button, Text, Group } from '@mantine/core';
import { useAppStore } from '@/hooks/useAppStore';
import { GEOMETRY_CONFIGS } from '@/utils/types';

export function GeometrySelector() {
  const { selectedGeometry, setGeometry } = useAppStore();

  return (
    <Stack gap="md">
      <Text size="sm" fw={600}>
        Geometry
      </Text>
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
            {config.label}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}
