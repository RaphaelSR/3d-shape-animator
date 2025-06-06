import { Group, Text, Anchor } from '@mantine/core';
import { IconBrandGithub, IconHeart } from '@tabler/icons-react';
import { useTranslations } from '@/hooks/useTranslations';

export function Footer() {
  const t = useTranslations();
  
  return (
    <Group 
      justify="center" 
      gap="xs" 
      p="sm" 
      style={{ 
        borderTop: '1px solid var(--mantine-color-gray-3)',
        fontSize: '12px'
      }}
    >
      <Text size="xs" c="dimmed">
        {t.footer.madeWith}
      </Text>
      <IconHeart size={12} color="red" />
      <Text size="xs" c="dimmed">
        {t.footer.by}
      </Text>
      <Anchor
        href="https://github.com/RaphaelSR"
        target="_blank"
        size="xs"
        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        <IconBrandGithub size={12} />
        Raphael Rocha
      </Anchor>
      <Text size="xs" c="dimmed">
        •
      </Text>
      <Anchor
        href="https://github.com/RaphaelSR/3d-shape-animator"
        target="_blank"
        size="xs"
      >
        {t.footer.openSource}
      </Anchor>
    </Group>
  );
}
