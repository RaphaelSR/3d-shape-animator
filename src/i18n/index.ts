import { SupportedLanguage, Translations } from './types';
import { ptBR } from './pt-BR';
import { enUS } from './en-US';

const translations: Record<SupportedLanguage, Translations> = {
  'pt-BR': ptBR,
  'en-US': enUS,
};

// Detecta o idioma do navegador
export function detectBrowserLanguage(): SupportedLanguage {
  const browserLang = navigator.language;
  
  if (browserLang.startsWith('pt')) {
    return 'pt-BR';
  }
  
  return 'en-US'; // Padrão para inglês
}

// Obtém as traduções para um idioma específico
export function getTranslations(language: SupportedLanguage): Translations {
  return translations[language];
}

// Lista de idiomas suportados para o seletor
export const supportedLanguages: { code: SupportedLanguage; name: string; flag: string }[] = [
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
];

export { type SupportedLanguage, type Translations };
