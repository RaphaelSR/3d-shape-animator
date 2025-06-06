import { useAppStore } from './useAppStore';
import { getTranslations } from '@/i18n';

export function useTranslations() {
  const language = useAppStore(state => state.language);
  return getTranslations(language);
}
