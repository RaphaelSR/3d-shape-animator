# Geometry — Motion Studio

A browser-based studio for animating a single 3D shape. Built with React 19, TypeScript, Three.js, React Three Fiber, Drei, Mantine and Zustand.

**[Open the studio](https://3d.raphaelrocha.com/)**

## Create

Choose one of twelve primitives, adjust its colors and material, and tune rotation, tilt, bounce and orbit. The spatial gradient follows the object's local vertical axis. Pause freezes playback; Restart returns the motion to its starting pose without changing the controls or playback state. Reset motion restores the default parameters.

Drag to rotate the camera, right-drag or Shift-drag to pan, and scroll/pinch to zoom. Framing restores the initial camera view. On small screens the properties panel folds down to leave more room for the scene. Portuguese and English, dark and light themes, keyboard navigation and reduced-motion preferences are supported. Only theme and language are saved on this device; no account or backend is involved.

## Export

- **PNG:** one frame at 480p, 720p or 1080p.
- **GIF:** 480p at 15 fps, encoded in local workers, with independent frames.
- **MP4 / WebM:** available only when the browser supports recording that format. Medium is 720p/30 fps; High is 1080p/60 fps. Video recording is real-time, so achieved frame rate depends on the browser and GPU.
- Animated exports run for 1–10 seconds (default: 3), even when preview playback is paused. If all motion controls are zero, the export is still.

Exports render a snapshot of the scene using a separate renderer and camera at the requested resolution. Narrower aspect ratios expand the vertical field of view to retain the horizontal framing. Editor controls are excluded; the scene background and shadows are included. The preview camera, motion phase and play/pause state are preserved. Progress, cancellation and errors are shown in the export dialog. Hiding the tab cancels the export to avoid a throttled recording. Keep the tab visible until the download begins.

No external HDRI, media service, codec service or CDN is required at runtime. The lighting environment is generated with Three.js `RoomEnvironment` and PMREM. GIF workers are bundled under the correct GitHub Pages base path.

## Run locally

Use Node **22.22.2 or newer** (the pinned development/CI version is in `.nvmrc`) and npm.

```sh
nvm use
npm ci
npm run dev
```

Open `http://127.0.0.1:3000/`. On this Mac the checkout is at `/Volumes/Lexar-M2-Projetos/Projetos/3d-shape-animator`; mount the SSD before opening it.

```sh
npm run lint
npm test
npm run build
npm run preview
```

The build includes strict type checking. `npm run test:watch` runs interactive unit tests; `npm run test:coverage` generates coverage. To run browser tests, install Chromium and FFmpeg (`brew install ffmpeg` on macOS; `apt-get install ffmpeg` on Ubuntu), then:

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

For installed Chrome, use `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`. To verify an already running server or production deployment, set `PLAYWRIGHT_BASE_URL` to its complete application URL, including `/3d-shape-animator/`.

## Implementation

- `Studio` owns the editor layout, accessible controls and dialogs. Zustand holds editable parameters; only theme/language are persisted, with validation compatible with the previous storage key.
- `Scene` owns one preview canvas and OrbitControls. The playback phase stays outside React state and advances with delta time. Paused/still/hidden scenes stop requesting animation frames; user camera interaction still renders on demand. DPR is capped at 1.75.
- Geometry creation and vertex-color gradients are shared. Materials, geometries, environment maps, export renderers, worker threads and recording streams have explicit cleanup.
- `exportAnimation(source, settings, signal, onProgress)` returns a Blob. `SceneHandle.createExport` returns an isolated export session (`canvas`, `render(seconds)`, `dispose()`). Format detection precedes video allocation; every outcome disposes the export renderer.

## Shortcuts

Shortcuts are disabled while editing fields, using interactive controls or opening dialogs. Native browser shortcuts are preserved.

| Key          | Action                   |
| ------------ | ------------------------ |
| Space        | Play / pause             |
| 1–9, 0, −, = | Select the twelve shapes |
| R            | Restart motion           |
| F            | Frame object             |
| T            | Change theme             |
| E / H        | Export / help            |
| ↑ / ↓        | Rotation speed           |
| ← / →        | Tilt speed               |
| Z / X        | Zoom out / in            |
| B / O        | Toggle bounce / orbit    |

## Publish

GitHub Actions validates pull requests and `main`: lint, unit tests, type checking, production build, production dependency audit and Chromium browser tests. Tests inspect real PNG/GIF/video downloads with FFmpeg/FFprobe. Only the resulting `dist` artifact from `main` is deployed to GitHub Pages. Failure reports are retained for seven days.

For a release, merge only after validation succeeds, then verify the published URL and downloads. To roll back, revert the release commit on `main`; the same pipeline validates and republishes the previous implementation. Do not rewrite shared history.

Visual references: [Spline](https://spline.design/) for the focused editing surface and [Three.js examples](https://threejs.org/examples/) for lighting and material treatment. No proprietary assets were copied.
