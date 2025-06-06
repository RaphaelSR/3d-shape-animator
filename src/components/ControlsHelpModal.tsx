import { Modal, Stack, Text, Group, Kbd, List, Button } from '@mantine/core';
import { IconHelp } from '@tabler/icons-react';

interface ControlsHelpModalProps {
  opened: boolean;
  onClose: () => void;
}

export function ControlsHelpModal({ opened, onClose }: ControlsHelpModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Controls & Instructions"
      size="md"
      centered
    >
      <Stack gap="lg">
        <Stack gap="sm">
          <Text size="sm" fw={600}>🖱️ Mouse Controls</Text>
          <List size="sm" spacing="xs">
            <List.Item>
              <Group gap="xs">
                <Text>Rotate:</Text>
                <Kbd>Click + Drag</Kbd>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Text>Zoom:</Text>
                <Kbd>Mouse Wheel</Kbd>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Text>Pan:</Text>
                <Kbd>Shift + Click + Drag</Kbd>
              </Group>
            </List.Item>
          </List>
        </Stack>

        <Stack gap="sm">
          <Text size="sm" fw={600}>🎨 Color Controls</Text>
          <List size="sm" spacing="xs">
            <List.Item>Primary Color: Main geometry color</List.Item>
            <List.Item>Secondary Color: Creates gradient effect</List.Item>
            <List.Item>Click swatches for presets or use custom picker</List.Item>
          </List>
        </Stack>

        <Stack gap="sm">
          <Text size="sm" fw={600}>🎮 Motion Controls</Text>
          <List size="sm" spacing="xs">
            <List.Item>Spin Speed: Rotation around Y-axis (0-3x)</List.Item>
            <List.Item>Tilt Speed: Rotation around X-axis (0-2x)</List.Item>
            <List.Item>Bounce: Vertical movement amplitude</List.Item>
            <List.Item>Orbit: Circular movement radius</List.Item>
            <List.Item>Zoom: Camera distance (2x-15x)</List.Item>
          </List>
        </Stack>

        <Stack gap="sm">
          <Text size="sm" fw={600}>📥 Opções de Export</Text>
          <List size="sm" spacing="xs">
            <List.Item>Alta: WebM 60fps, 1080p</List.Item>
            <List.Item>Média: WebM 30fps, 720p</List.Item>
            <List.Item>Baixa: GIF 15fps, 480p</List.Item>
          </List>
        </Stack>

        <Stack gap="sm">
          <Text size="sm" fw={600}>⌨️ Atalhos de Teclado</Text>
          <List size="sm" spacing="xs">
            <List.Item>
              <Group gap="xs">
                <Kbd>Espaço</Kbd>
                <Text>Play/Pausar animação</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>T</Kbd>
                <Text>Alternar tema</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>1-6</Kbd>
                <Text>Selecionar geometria</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>↑↓</Kbd>
                <Text>Ajustar velocidade de rotação</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>←→</Kbd>
                <Text>Ajustar inclinação</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>Z/X</Kbd>
                <Text>Ajustar zoom</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>B</Kbd>
                <Text>Ativar/desativar bounce</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>O</Kbd>
                <Text>Ativar/desativar órbita</Text>
              </Group>
            </List.Item>
          </List>
        </Stack>

        <Button onClick={onClose} fullWidth>
          Entendi!
        </Button>
      </Stack>
    </Modal>
  );
}
