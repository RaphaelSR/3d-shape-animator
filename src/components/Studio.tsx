import { ColorInput, Modal, Switch } from '@mantine/core';
import {
  IconArrowDown,
  IconArrowsMaximize,
  IconBrandGithub,
  IconChevronDown,
  IconChevronUp,
  IconHelp,
  IconMinus,
  IconMoon,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlus,
  IconRotateClockwise,
  IconSun,
} from '@tabler/icons-react';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { geometryNames } from '@/i18n';
import {
  GEOMETRIES,
  MOTION_LIMITS,
  PALETTES,
  type Language,
  type SceneHandle,
} from '@/utils/types';
import { hasMotion } from '@/utils/motion';
const Scene = lazy(() =>
  import('./Scene').then(module => ({ default: module.Scene }))
);
import { ShapeIcon } from './ShapeIcon';
import { ExportControls } from './ExportControls';
function IconButton({
  label,
  children,
  onClick,
  disabled,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="icon-button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
function Range({
  id,
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="range-field">
      <div>
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{value.toFixed(step < 0.1 ? 2 : 1)}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={event => onChange(Number(event.target.value))}
      />
    </div>
  );
}
export function Studio() {
  const t = useTranslations();
  const state = useAppStore();
  const [source, setSource] = useState<SceneHandle | null>(null);
  const [busy, setBusy] = useState(false);
  const [exportOpened, setExportOpened] = useState(false);
  const [helpOpened, setHelpOpened] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [tab, setTab] = useState<'geometry' | 'appearance' | 'motion'>(
    'geometry'
  );
  const names = geometryNames[state.language];
  const active = state.playing && hasMotion(state.motion);
  const onReady = useCallback(
    (handle: SceneHandle | null) => setSource(handle),
    []
  );
  const openExport = useCallback(() => {
    if (source) setExportOpened(true);
  }, [source]);
  const openHelp = useCallback(() => setHelpOpened(true), []);
  const frame = useCallback(() => source?.reframe(), [source]);
  const zoom = useCallback((factor: number) => source?.zoom(factor), [source]);
  useKeyboardShortcuts({
    disabled: exportOpened || helpOpened || busy,
    onExport: openExport,
    onHelp: openHelp,
    onFrame: frame,
    onZoom: zoom,
  });
  useEffect(() => {
    document.documentElement.lang = state.language;
    document.title = `Geometry — ${t.studioSuffix}`;
  }, [state.language, t.studioSuffix]);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      if (query.matches) useAppStore.getState().pause();
    };
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return (
    <div className="studio" data-expanded={expanded}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <ShapeIcon type="cube" size={25} />
          </span>
          <div>
            <h1>
              {t.studio}
              <span className="brand-dot">.</span>
            </h1>
            <span className="brand-subtitle">{t.studioSuffix}</span>
          </div>
        </div>
        <div className="header-actions">
          <select
            aria-label={t.language}
            value={state.language}
            onChange={event =>
              state.setLanguage(event.target.value as Language)
            }
            className="language-select"
          >
            <option value="pt-BR">PT</option>
            <option value="en-US">EN</option>
          </select>
          <IconButton label={t.theme} onClick={state.toggleTheme}>
            {state.theme === 'dark' ? (
              <IconSun size={19} />
            ) : (
              <IconMoon size={19} />
            )}
          </IconButton>
          <IconButton label={t.help} onClick={openHelp}>
            <IconHelp size={19} />
          </IconButton>
          <span className="header-divider" />
          <button
            className="button export-trigger"
            onClick={openExport}
            disabled={!source || busy}
          >
            <IconArrowDown size={18} />
            <span>{t.export}</span>
          </button>
        </div>
      </header>
      <main className="workspace">
        <section className="stage" aria-label={t.scene}>
          <div className="stage-canvas">
            <Suspense
              fallback={
                <div className="scene-message" role="status">
                  {t.loading}
                </div>
              }
            >
              <Scene busy={busy} onReady={onReady} />
            </Suspense>
          </div>
          <div className="stage-heading">
            <span className="eyebrow">{t.scene}</span>
            <div>
              <h2>{names[state.geometry]}</h2>
              <span className="shape-index">
                {String(GEOMETRIES.indexOf(state.geometry) + 1).padStart(
                  2,
                  '0'
                )}{' '}
                / 12
              </span>
            </div>
          </div>
          <div className={`live-badge ${active && !busy ? 'active' : ''}`}>
            <i />
            {busy
              ? t.exporting
              : !state.playing
                ? t.paused
                : active
                  ? t.live
                  : t.still}
          </div>
          <div className="stage-corner top-left" />
          <div className="stage-corner top-right" />
          <div className="stage-corner bottom-left" />
          <div className="stage-corner bottom-right" />
          <div className="camera-tools">
            <IconButton
              label={t.reframe}
              onClick={frame}
              disabled={!source || busy}
            >
              <IconArrowsMaximize size={19} />
            </IconButton>
            <span />
            <IconButton
              label={t.zoomIn}
              onClick={() => zoom(1 / 1.15)}
              disabled={!source || busy}
            >
              <IconPlus size={19} />
            </IconButton>
            <IconButton
              label={t.zoomOut}
              onClick={() => zoom(1.15)}
              disabled={!source || busy}
            >
              <IconMinus size={19} />
            </IconButton>
          </div>
          <div className="stage-bottom">
            <p className="stage-hint">
              <span className="desktop-hint">{t.dragHint}</span>
              <span className="touch-hint">{t.touchHint}</span>
            </p>
            <div className="transport">
              <button
                className="play-button"
                onClick={state.togglePlayback}
                disabled={!source || busy}
                aria-label={state.playing ? t.pause : t.play}
              >
                {state.playing ? (
                  <IconPlayerPauseFilled size={16} />
                ) : (
                  <IconPlayerPlayFilled size={16} />
                )}
                <span>{state.playing ? t.pause : t.play}</span>
              </button>
              <span className="transport-divider" />
              <IconButton
                label={t.restart}
                onClick={state.restart}
                disabled={!source || busy}
              >
                <IconRotateClockwise size={18} />
              </IconButton>
              <kbd>SPACE</kbd>
            </div>
            <div className="stage-caption">GEOMETRY / MOTION</div>
          </div>
        </section>
        <aside className="inspector" aria-label={t.properties}>
          <button
            className="mobile-panel-toggle"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls="properties-content"
          >
            <span>
              <ShapeIcon type={state.geometry} size={20} />
              {expanded ? t.collapse : t.edit}
            </span>
            {expanded ? (
              <IconChevronDown size={18} />
            ) : (
              <IconChevronUp size={18} />
            )}
          </button>
          <div className="inspector-heading">
            <span className="eyebrow">{t.properties}</span>
            <span className="inspector-number">01</span>
          </div>
          <div className="properties-content" id="properties-content">
            <div className="tabs" role="tablist" aria-label={t.properties}>
              {(['geometry', 'appearance', 'motion'] as const).map(
                (value, index, values) => (
                  <button
                    key={value}
                    role="tab"
                    id={`tab-${value}`}
                    aria-controls={`panel-${value}`}
                    aria-selected={tab === value}
                    tabIndex={tab === value ? 0 : -1}
                    onClick={() => setTab(value)}
                    onKeyDown={event => {
                      if (
                        ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(
                          event.key
                        )
                      ) {
                        event.preventDefault();
                        const next =
                          event.key === 'Home'
                            ? 0
                            : event.key === 'End'
                              ? 2
                              : (index + (event.key === 'ArrowRight' ? 1 : 2)) %
                                3;
                        setTab(values[next]);
                        document.getElementById(`tab-${values[next]}`)?.focus();
                      }
                    }}
                  >
                    {t[value]}
                  </button>
                )
              )}
            </div>
            <div
              className="panel"
              role="tabpanel"
              id={`panel-${tab}`}
              aria-labelledby={`tab-${tab}`}
              tabIndex={0}
            >
              {tab === 'geometry' && (
                <>
                  <div className="section-title">
                    <h3>{t.chooseShape}</h3>
                    <p>{t.shapeHint}</p>
                  </div>
                  <div className="shape-grid">
                    {GEOMETRIES.map((type, index) => (
                      <button
                        key={type}
                        className={`shape-card ${state.geometry === type ? 'selected' : ''}`}
                        aria-pressed={state.geometry === type}
                        aria-label={names[type]}
                        disabled={busy}
                        onClick={() => state.setGeometry(type)}
                      >
                        <span className="shape-key">
                          {'1234567890−='[index]}
                        </span>
                        <ShapeIcon type={type} />
                        <span>{names[type]}</span>
                      </button>
                    ))}
                  </div>
                  <div className="selected-summary">
                    <ShapeIcon type={state.geometry} size={42} />
                    <div>
                      <span className="eyebrow">{t.geometry}</span>
                      <strong>{names[state.geometry]}</strong>
                    </div>
                    <span className="selection-dot" />
                  </div>
                </>
              )}
              {tab === 'appearance' && (
                <>
                  <div className="section-title">
                    <h3>{t.appearance}</h3>
                  </div>
                  <fieldset disabled={busy} className="appearance-fields">
                    <span className="field-label">{t.colors}</span>
                    <div className="palette-grid">
                      {PALETTES.map(([primary, secondary]) => (
                        <button
                          key={primary}
                          aria-label={`${primary} / ${secondary}`}
                          aria-pressed={
                            state.appearance.primary === primary &&
                            state.appearance.secondary === secondary
                          }
                          style={{
                            background: `linear-gradient(135deg,${primary},${secondary})`,
                          }}
                          onClick={() =>
                            state.setAppearance({ primary, secondary })
                          }
                        />
                      ))}
                    </div>
                    <Switch
                      label={t.gradient}
                      checked={state.appearance.gradient}
                      onChange={event =>
                        state.setAppearance({
                          gradient: event.currentTarget.checked,
                        })
                      }
                    />
                    <ColorInput
                      eyeDropperButtonProps={{ 'aria-label': t.pickColor }}
                      label={t.primary}
                      value={state.appearance.primary}
                      format="hex"
                      onChange={primary => {
                        if (/^#[0-9a-f]{6}$/i.test(primary))
                          state.setAppearance({ primary });
                      }}
                      fixOnBlur
                    />
                    <ColorInput
                      eyeDropperButtonProps={{ 'aria-label': t.pickColor }}
                      label={t.secondary}
                      value={state.appearance.secondary}
                      format="hex"
                      disabled={!state.appearance.gradient}
                      onChange={secondary => {
                        if (/^#[0-9a-f]{6}$/i.test(secondary))
                          state.setAppearance({ secondary });
                      }}
                      fixOnBlur
                    />
                    <div className="section-rule" />
                    <h3>{t.material}</h3>
                    <Range
                      id="metalness"
                      label={t.metalness}
                      value={state.appearance.metalness}
                      onChange={metalness => state.setAppearance({ metalness })}
                    />
                    <Range
                      id="roughness"
                      label={t.roughness}
                      min={0.08}
                      value={state.appearance.roughness}
                      onChange={roughness => state.setAppearance({ roughness })}
                    />
                  </fieldset>
                </>
              )}
              {tab === 'motion' && (
                <>
                  <div className="section-title">
                    <h3>{t.motion}</h3>
                  </div>
                  <fieldset disabled={busy} className="motion-fields">
                    {(
                      Object.keys(
                        MOTION_LIMITS
                      ) as (keyof typeof MOTION_LIMITS)[]
                    ).map(key => (
                      <Range
                        key={key}
                        id={key}
                        label={t[key]}
                        value={state.motion[key]}
                        min={MOTION_LIMITS[key][0]}
                        max={MOTION_LIMITS[key][1]}
                        step={MOTION_LIMITS[key][2]}
                        onChange={value => state.setMotion({ [key]: value })}
                      />
                    ))}
                    <button
                      className="button secondary reset-motion"
                      onClick={state.resetMotion}
                    >
                      <IconRotateClockwise size={16} />
                      {t.resetMotion}
                    </button>
                  </fieldset>
                </>
              )}
            </div>
          </div>
          <footer className="inspector-footer">
            <a
              href="https://github.com/RaphaelSR/3d-shape-animator"
              target="_blank"
              rel="noreferrer"
              aria-label={t.source}
            >
              <IconBrandGithub size={16} />
              <span>Raphael Rocha</span>
            </a>
            <span>v1.0</span>
          </footer>
        </aside>
      </main>
      <ExportControls
        opened={exportOpened}
        onClose={() => setExportOpened(false)}
        source={source}
        onBusy={setBusy}
      />
      <Modal
        opened={helpOpened}
        onClose={() => setHelpOpened(false)}
        title={t.helpTitle}
        centered
        closeButtonProps={{ 'aria-label': t.close }}
      >
        <div className="help-content">
          <h3>{t.mouseTitle}</h3>
          <p>{t.rotate}</p>
          <p>{t.pan}</p>
          <p>{t.zoom}</p>
          <h3>{t.keyboardTitle}</h3>
          {[
            ['Space', `${t.play} / ${t.pause}`],
            ['1–9, 0, −, =', t.selectShape],
            ['R', t.restartKey],
            ['F', t.frameKey],
            ['T', t.themeKey],
            ['E', t.exportKey],
            ['H', t.helpKey],
            ['↑ / ↓', t.spinSpeed],
            ['← / →', t.tiltSpeed],
            ['Z / X', t.zoom],
            ['B', t.bounceAmplitude],
            ['O', t.orbitRadius],
          ].map(([key, label]) => (
            <div className="shortcut" key={key}>
              <span>{label}</span>
              <kbd>{key}</kbd>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
