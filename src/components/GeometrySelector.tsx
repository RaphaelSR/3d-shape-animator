import { Stack, Button, Text, ScrollArea, SimpleGrid } from '@mantine/core';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useSidebarStore } from '@/hooks/useSidebarStore';
import { GEOMETRY_CONFIGS } from '@/utils/types';

export function GeometrySelector() {
  const { selectedGeometry, setGeometry } = useAppStore();
  const { isMobile } = useSidebarStore();
  const t = useTranslations();

  return (
    <Stack gap="md">
      <Text size="sm" fw={600}>
        {t.geometry.title}
      </Text>
      <ScrollArea h={isMobile ? 250 : 300}>
        {isMobile ? (
          <SimpleGrid cols={2} spacing="xs">
            {GEOMETRY_CONFIGS.map(config => (
              <Button
                key={config.type}
                variant={selectedGeometry === config.type ? 'filled' : 'subtle'}
                justify="center"
                leftSection={<span style={{ fontSize: '16px' }}>{config.icon}</span>}
                onClick={() => setGeometry(config.type)}
                size="sm"
                style={{ flexDirection: 'column', height: '60px', padding: '8px' }}
              >
                <Text size="xs" style={{ marginTop: '4px' }}>
                  {t.geometry[config.type]}
                </Text>
              </Button>
            ))}
          </SimpleGrid>
        ) : (
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
        )}
      </ScrollArea>
    </Stack>
  );
}
