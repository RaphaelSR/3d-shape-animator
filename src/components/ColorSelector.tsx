import { Stack, Text, ColorSwatch, Group, ColorInput, Switch } from '@mantine/core';
import { useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { DEFAULT_COLORS, type Color } from '@/utils/types';

export function ColorSelector() {
  const { primaryColor, secondaryColor, setPrimaryColor, setSecondaryColor } = useAppStore();
  const t = useTranslations();
  const [customPrimary, setCustomPrimary] = useState(primaryColor.hex);
  const [customSecondary, setCustomSecondary] = useState(secondaryColor.hex);
  const [gradientEnabled, setGradientEnabled] = useState(false);

  const handlePresetColorClick = (color: Color, isPrimary: boolean) => {
    if (isPrimary) {
      setPrimaryColor(color);
      setCustomPrimary(color.hex);
    } else {
      setSecondaryColor(color);
      setCustomSecondary(color.hex);
    }
  };

  const handleCustomColorChange = (value: string, isPrimary: boolean) => {
    const color: Color = { hex: value };
    if (isPrimary) {
      setPrimaryColor(color);
      setCustomPrimary(value);
    } else {
      setSecondaryColor(color);
      setCustomSecondary(value);
    }
  };

  return (
    <Stack gap="md">
      <Text size="sm" fw={600}>
        {t.colors.title}
      </Text>
      
      <Switch
        label={t.colors.enableGradient}
        checked={gradientEnabled}
        onChange={(event) => setGradientEnabled(event.currentTarget.checked)}
        size="sm"
      />
      
      <Stack gap="sm">
        <Text size="xs" c="dimmed">
          {t.colors.primaryColor}
        </Text>
        <Group gap="xs" wrap="wrap">
          {DEFAULT_COLORS.map(color => (
            <ColorSwatch
              key={`primary-${color.hex}`}
              color={color.hex}
              size={24}
              style={{ 
                cursor: 'pointer',
                border: primaryColor.hex === color.hex ? '2px solid #000' : 'none'
              }}
              onClick={() => handlePresetColorClick(color, true)}
            />
          ))}
        </Group>
        <ColorInput
          value={customPrimary}
          onChange={(value) => handleCustomColorChange(value, true)}
          placeholder="Custom color"
          size="xs"
        />
      </Stack>

      {gradientEnabled && (
        <Stack gap="sm">
          <Text size="xs" c="dimmed">
            {t.colors.secondaryColor}
          </Text>
          <Group gap="xs" wrap="wrap">
            {DEFAULT_COLORS.map(color => (
              <ColorSwatch
                key={`secondary-${color.hex}`}
                color={color.hex}
                size={24}
                style={{ 
                  cursor: 'pointer',
                  border: secondaryColor.hex === color.hex ? '2px solid #000' : 'none'
                }}
                onClick={() => handlePresetColorClick(color, false)}
              />
            ))}
          </Group>
          <ColorInput
            value={customSecondary}
            onChange={(value) => handleCustomColorChange(value, false)}
            placeholder="Custom color"
            size="xs"
          />
        </Stack>
      )}
    </Stack>
  );
}
