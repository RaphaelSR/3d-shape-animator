import { Group, Text, Anchor } from '@mantine/core';
import { IconBrandGithub, IconHeart } from '@tabler/icons-react';

export function Footer() {
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
        Feito com
      </Text>
      <IconHeart size={12} color="red" />
      <Text size="xs" c="dimmed">
        por
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
        Código Aberto
      </Anchor>
    </Group>
  );
}
