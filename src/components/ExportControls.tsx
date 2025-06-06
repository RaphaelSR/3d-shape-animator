import { Stack, Text, Select, Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useState } from 'react';
import { EXPORT_PRESETS, type ExportQuality } from '@/utils/types';
import { exportAnimation } from '@/utils/exportUtils';

export function ExportControls() {
  const [selectedQuality, setSelectedQuality] = useState<ExportQuality>('medium');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const settings = EXPORT_PRESETS[selectedQuality];
      await exportAnimation(settings);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const qualityOptions = [
    { value: 'high', label: 'Alta (WebM 60fps, 1080p)' },
    { value: 'medium', label: 'Média (WebM 30fps, 720p)' },
    { value: 'low', label: 'Baixa (GIF 15fps, 480p)' },
  ];

  return (
    <Stack gap="md">
      <Text size="sm" fw={600}>
        Export Animation
      </Text>
      
      <Stack gap="sm">
        <Select
          label="Quality Preset"
          value={selectedQuality}
          onChange={(value) => setSelectedQuality(value as ExportQuality)}
          data={qualityOptions}
          size="sm"
        />
        
        <Button
          fullWidth
          leftSection={<IconDownload size={16} />}
          onClick={handleExport}
          loading={isExporting}
          size="sm"
          color="green"
        >
          {isExporting ? 'Exporting...' : 'Export Animation'}
        </Button>
        
        <Text size="xs" c="dimmed" ta="center">
          Exporta apenas o objeto 3D em movimento
        </Text>
      </Stack>
    </Stack>
  );
}
