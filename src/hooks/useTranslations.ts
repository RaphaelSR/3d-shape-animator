import { translations } from '@/i18n';
import { useAppStore } from './useAppStore';
export function useTranslations() {
  return translations[useAppStore(state => state.language)];
}
