import { Group, Text, UnstyledButton, Menu } from '@mantine/core';
import { IconChevronDown, IconLanguage } from '@tabler/icons-react';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { supportedLanguages } from '@/i18n';

export function LanguageSelector() {
  const { language, setLanguage, theme } = useAppStore();
  const t = useTranslations();
  
  const currentLanguage = supportedLanguages.find(lang => lang.code === language);

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: `1px solid var(--mantine-color-${theme === 'dark' ? 'dark' : 'gray'}-${theme === 'dark' ? '4' : '3'})`,
            backgroundColor: `var(--mantine-color-${theme === 'dark' ? 'dark' : 'gray'}-${theme === 'dark' ? '6' : '0'})`,
            color: `var(--mantine-color-${theme === 'dark' ? 'gray' : 'dark'}-${theme === 'dark' ? '0' : '9'})`,
            width: '100%',
            transition: 'all 0.2s ease',
          }}
        >
          <Group justify="space-between">
            <Group gap="xs">
              <IconLanguage size={16} />
              <Text size="sm">
                {currentLanguage?.flag} {currentLanguage?.name}
              </Text>
            </Group>
            <IconChevronDown size={14} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t.settings.language}</Menu.Label>
        {supportedLanguages.map((lang) => (
          <Menu.Item
            key={lang.code}
            leftSection={<span style={{ fontSize: '16px' }}>{lang.flag}</span>}
            onClick={() => setLanguage(lang.code)}
            style={{
              backgroundColor: language === lang.code ? 
                `var(--mantine-color-blue-${theme === 'dark' ? 'dark' : 'light'})` : 
                undefined,
            }}
          >
            {lang.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
