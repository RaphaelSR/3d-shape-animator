import { Modal } from '@mantine/core';
import { IconArrowDown, IconCheck } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import {
  availableFormats,
  downloadBlob,
  exportAnimation,
} from '@/utils/exportUtils';
import {
  EXPORT_PRESETS,
  type ExportFormat,
  type ExportQuality,
  type SceneHandle,
} from '@/utils/types';
export function ExportControls({
  opened,
  onClose,
  source,
  onBusy,
}: {
  opened: boolean;
  onClose: () => void;
  source: SceneHandle | null;
  onBusy: (value: boolean) => void;
}) {
  const t = useTranslations();
  const formats = availableFormats();
  const [format, setFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState<ExportQuality>('medium');
  const [duration, setDuration] = useState(3);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    'success' | 'error' | 'cancelled' | 'hidden' | null
  >(null);
  const controller = useRef<AbortController | null>(null);
  const hidden = useRef(false);
  useEffect(() => {
    const handle = () => {
      if (document.hidden && controller.current) {
        hidden.current = true;
        controller.current.abort();
      }
    };
    document.addEventListener('visibilitychange', handle);
    return () => {
      controller.current?.abort();
      document.removeEventListener('visibilitychange', handle);
    };
  }, []);
  const start = async () => {
    if (!source || controller.current) return;
    const abort = new AbortController();
    controller.current = abort;
    hidden.current = false;
    setBusy(true);
    onBusy(true);
    setProgress(0);
    setStatus(null);
    try {
      const preset = EXPORT_PRESETS[format === 'gif' ? 'low' : quality];
      const blob = await exportAnimation(
        source,
        {
          format,
          quality: format === 'gif' ? 'low' : quality,
          duration,
          ...preset,
        },
        abort.signal,
        setProgress
      );
      downloadBlob(blob, format);
      setStatus('success');
    } catch (error) {
      setStatus(
        hidden.current
          ? 'hidden'
          : error instanceof DOMException && error.name === 'AbortError'
            ? 'cancelled'
            : 'error'
      );
    } finally {
      controller.current = null;
      setBusy(false);
      onBusy(false);
    }
  };
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={!busy}
      closeOnEscape={!busy}
      withCloseButton={!busy}
      title={t.exportTitle}
      size="md"
      centered
      closeButtonProps={{ 'aria-label': t.close }}
    >
      <p className="muted export-intro">{t.exportHint}</p>
      <fieldset disabled={busy} className="export-fields">
        <label className="field-label" htmlFor="export-format">
          {t.format}
        </label>
        <select
          id="export-format"
          value={format}
          onChange={event => {
            setFormat(event.target.value as ExportFormat);
            setStatus(null);
          }}
        >
          {formats.map(value => (
            <option key={value} value={value}>
              {value.toUpperCase()}
            </option>
          ))}
        </select>
        {formats.length === 2 && <p className="muted">{t.noVideo}</p>}
        <label className="field-label" htmlFor="export-quality">
          {t.quality}
        </label>
        <select
          id="export-quality"
          value={format === 'gif' ? 'low' : quality}
          disabled={format === 'gif'}
          onChange={event => setQuality(event.target.value as ExportQuality)}
        >
          {(['high', 'medium', 'low'] as const).map(value => (
            <option key={value} value={value}>
              {format === 'png'
                ? t[value].split(' · ').slice(0, 2).join(' · ')
                : t[value]}
            </option>
          ))}
        </select>
        {format !== 'png' && (
          <>
            <label className="field-label" htmlFor="export-duration">
              {t.duration} <span className="muted">({t.seconds})</span>
            </label>
            <input
              id="export-duration"
              type="number"
              min="1"
              max="10"
              value={duration}
              onChange={event => setDuration(Number(event.target.value))}
              onBlur={() =>
                setDuration(Math.min(10, Math.max(1, duration || 3)))
              }
            />
          </>
        )}
        {format === 'gif' && <p className="muted">{t.gifQuality}</p>}
        {format === 'png' && <p className="muted">{t.imageQuality}</p>}
        {(format === 'mp4' || format === 'webm') && (
          <p className="muted">{t.videoQuality}</p>
        )}
      </fieldset>
      {busy && (
        <div className="export-progress" role="status">
          <div>
            <span>{t.exporting}</span>
            <strong>{Math.round(progress * 100)}%</strong>
          </div>
          <progress max="1" value={progress} aria-label={t.exporting} />
        </div>
      )}
      {status && (
        <p
          role={status === 'error' ? 'alert' : 'status'}
          className={`export-status ${status}`}
        >
          {status === 'success' && <IconCheck size={18} />}{' '}
          {status === 'success'
            ? t.exportSuccess
            : status === 'error'
              ? t.exportError
              : status === 'hidden'
                ? t.exportHidden
                : t.exportCancelled}
        </p>
      )}
      <div className="export-actions">
        {busy ? (
          <button
            className="button secondary"
            onClick={() => controller.current?.abort()}
          >
            {t.cancel}
          </button>
        ) : (
          <button
            className="button"
            disabled={
              !source ||
              duration < 1 ||
              duration > 10 ||
              !Number.isFinite(duration)
            }
            onClick={() => void start()}
          >
            <IconArrowDown size={18} />
            {t.download} {format.toUpperCase()}
          </button>
        )}
      </div>
    </Modal>
  );
}
