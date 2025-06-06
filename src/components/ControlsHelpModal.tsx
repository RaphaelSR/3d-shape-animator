import { Modal, Stack, Text, Group, Kbd, List, Button } from '@mantine/core';
import { useTranslations } from '@/hooks/useTranslations';

interface ControlsHelpModalProps {
  opened: boolean;
  onClose: () => void;
}

export function ControlsHelpModal({ opened, onClose }: ControlsHelpModalProps) {
  const t = useTranslations();
  
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t.help.title}
      size="md"
      centered
    >
      <Stack gap="lg">
        <Stack gap="sm">
          <Text size="sm" fw={600}>🖱️ {t.help.mouse.title}</Text>
          <List size="sm" spacing="xs">
            <List.Item>
              <Group gap="xs">
                <Text>{t.help.mouse.rotate}</Text>
                <Kbd>{t.help.mouse.clickDrag}</Kbd>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Text>{t.help.mouse.zoom}</Text>
                <Kbd>{t.help.mouse.mouseWheel}</Kbd>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Text>{t.help.mouse.pan}</Text>
                <Kbd>{t.help.mouse.shiftClickDrag}</Kbd>
              </Group>
            </List.Item>
          </List>
        </Stack>

        <Stack gap="sm">
          <Text size="sm" fw={600}>🎨 {t.help.colors.title}</Text>
          <List size="sm" spacing="xs">
            <List.Item>{t.help.colors.primaryColor}</List.Item>
            <List.Item>{t.help.colors.secondaryColor}</List.Item>
            <List.Item>{t.help.colors.swatches}</List.Item>
          </List>
        </Stack>

        <Stack gap="sm">
          <Text size="sm" fw={600}>🎮 {t.help.motion.title}</Text>
          <List size="sm" spacing="xs">
            <List.Item>{t.help.motion.spinSpeed}</List.Item>
            <List.Item>{t.help.motion.tiltSpeed}</List.Item>
            <List.Item>{t.help.motion.bounce}</List.Item>
            <List.Item>{t.help.motion.orbit}</List.Item>
            <List.Item>{t.help.motion.zoom}</List.Item>
          </List>
        </Stack>

        <Stack gap="sm">
          <Text size="sm" fw={600}>📥 {t.help.export.title}</Text>
          <List size="sm" spacing="xs">
            <List.Item>{t.help.export.high}</List.Item>
            <List.Item>{t.help.export.medium}</List.Item>
            <List.Item>{t.help.export.low}</List.Item>
          </List>
        </Stack>

        <Stack gap="sm">
          <Text size="sm" fw={600}>⌨️ {t.help.keyboard.title}</Text>
          <List size="sm" spacing="xs">
            <List.Item>
              <Group gap="xs">
                <Kbd>{t.help.keyboard.spaceKey}</Kbd>
                <Text>{t.help.keyboard.space}</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>T</Kbd>
                <Text>{t.help.keyboard.theme}</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>1-9, 0, -, =</Kbd>
                <Text>{t.help.keyboard.geometry}</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>{t.help.keyboard.arrowUpDown}</Kbd>
                <Text>{t.help.keyboard.rotationSpeed}</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>{t.help.keyboard.arrowLeftRight}</Kbd>
                <Text>{t.help.keyboard.tilt}</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>Z/X</Kbd>
                <Text>{t.help.keyboard.zoomKeys}</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>B</Kbd>
                <Text>{t.help.keyboard.bounceToggle}</Text>
              </Group>
            </List.Item>
            <List.Item>
              <Group gap="xs">
                <Kbd>O</Kbd>
                <Text>{t.help.keyboard.orbitToggle}</Text>
              </Group>
            </List.Item>
          </List>
        </Stack>

        <Button onClick={onClose} fullWidth>
          OK
        </Button>
      </Stack>
    </Modal>
  );
}
