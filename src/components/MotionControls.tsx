import { Stack, Text, Slider, Group, Button } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause, IconRefresh } from '@tabler/icons-react';
import { useAppStore } from '@/hooks/useAppStore';

export function MotionControls() {
  const { 
    motionControls, 
    setMotionControls, 
    isAnimating, 
    toggleAnimation, 
    resetControls 
  } = useAppStore();

  const handleControlChange = (key: keyof typeof motionControls) => (value: number) => {
    setMotionControls({ [key]: value });
  };

  const isAllControlsZero = Object.values(motionControls).every(value => value === 0);

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={600}>
          Motion Controls
        </Text>
        <Group gap="xs">
          <Button
            size="xs"
            variant="subtle"
            leftSection={isAnimating ? <IconPlayerPause size={14} /> : <IconPlayerPlay size={14} />}
            onClick={toggleAnimation}
            disabled={isAllControlsZero}
          >
            {isAnimating ? 'Pause' : 'Play'}
          </Button>
          <Button
            size="xs"
            variant="subtle"
            leftSection={<IconRefresh size={14} />}
            onClick={resetControls}
          >
            Reset
          </Button>
        </Group>
      </Group>

      <Stack gap="lg">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Spin Speed</Text>
            <Text size="xs" c="dimmed">{motionControls.spinSpeed.toFixed(1)}</Text>
          </Group>
          <Slider
            value={motionControls.spinSpeed}
            onChange={handleControlChange('spinSpeed')}
            min={0}
            max={3}
            step={0.1}
            size="sm"
            color="blue"
          />
        </Stack>

        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Tilt Speed</Text>
            <Text size="xs" c="dimmed">{motionControls.tiltSpeed.toFixed(1)}</Text>
          </Group>
          <Slider
            value={motionControls.tiltSpeed}
            onChange={handleControlChange('tiltSpeed')}
            min={0}
            max={2}
            step={0.1}
            size="sm"
            color="green"
          />
        </Stack>

        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Bounce Amplitude</Text>
            <Text size="xs" c="dimmed">{motionControls.bounceAmplitude.toFixed(1)}</Text>
          </Group>
          <Slider
            value={motionControls.bounceAmplitude}
            onChange={handleControlChange('bounceAmplitude')}
            min={0}
            max={1}
            step={0.1}
            size="sm"
            color="orange"
          />
        </Stack>

        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Orbit Radius</Text>
            <Text size="xs" c="dimmed">{motionControls.orbitRadius.toFixed(1)}</Text>
          </Group>
          <Slider
            value={motionControls.orbitRadius}
            onChange={handleControlChange('orbitRadius')}
            min={0}
            max={3}
            step={0.1}
            size="sm"
            color="purple"
          />
        </Stack>

        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Zoom Level</Text>
            <Text size="xs" c="dimmed">{motionControls.zoom.toFixed(1)}</Text>
          </Group>
          <Slider
            value={motionControls.zoom}
            onChange={handleControlChange('zoom')}
            min={2}
            max={15}
            step={0.5}
            size="sm"
            color="teal"
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
