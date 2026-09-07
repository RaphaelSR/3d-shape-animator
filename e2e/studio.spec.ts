import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const shapes = [
  'Cube',
  'Sphere',
  'Pyramid',
  'Cylinder',
  'Cone',
  'Torus',
  'Octahedron',
  'Dodecahedron',
  'Icosahedron',
  'Tetrahedron',
  'Capsule',
  'Ring',
];
function probe(path: string) {
  return JSON.parse(
    execFileSync(
      'ffprobe',
      [
        '-v',
        'error',
        '-count_frames',
        '-show_entries',
        'stream=codec_name,width,height,nb_read_frames,r_frame_rate:format=duration',
        '-of',
        'json',
        path,
      ],
      { encoding: 'utf8' }
    )
  );
}
test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await expect(
    page.getByRole('button', { name: 'Export', exact: true })
  ).toBeEnabled();
});
test('all twelve shapes, theme, language, keyboard and paused rendering', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const canvas = page.locator('canvas');
  const first = await canvas.screenshot();
  for (const name of shapes) {
    await page.getByRole('button', { name, exact: true }).click();
    await expect(
      page.getByRole('heading', { name, exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name, exact: true })
    ).toHaveAttribute('aria-pressed', 'true');
  }
  const last = await canvas.screenshot();
  expect(first.equals(last)).toBe(false);
  await page.getByRole('tab', { name: 'Appearance', exact: true }).click();
  const gradient = page.getByRole('switch', { name: 'Color gradient' });
  await gradient.uncheck();
  await expect(
    page.getByLabel('Secondary color', { exact: true })
  ).toBeDisabled();
  await gradient.check();
  await expect(
    page.getByLabel('Secondary color', { exact: true })
  ).toBeEnabled();
  await page.getByRole('button', { name: 'Change theme' }).click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-mantine-color-scheme',
    'light'
  );
  await page.getByLabel('Language', { exact: true }).selectOption('pt-BR');
  await expect(
    page.getByRole('tab', { name: 'Aparência', exact: true })
  ).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('html')).toHaveAttribute(
    'data-mantine-color-scheme',
    'light'
  );
  await page.getByLabel('Idioma', { exact: true }).selectOption('en-US');
  await page.locator('body').click({ position: { x: 1, y: 1 } });
  await page.keyboard.press('2');
  await expect(
    page.getByRole('heading', { name: 'Sphere', exact: true })
  ).toBeVisible();
  await page.keyboard.press('h');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  expect(errors).toEqual([]);
});
for (const width of [320, 768, 1440]) {
  test(`responsive editor at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
    await expect(
      page.getByRole('button', { name: 'Cube', exact: true })
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    const stage = await page.locator('.stage').boundingBox();
    expect(stage!.height).toBeGreaterThan(220);
    if (width <= 768) {
      await page.getByRole('button', { name: 'Collapse properties' }).click();
      await expect(
        page.getByRole('button', { name: 'Edit shape' })
      ).toBeVisible();
      const expandedStage = await page.locator('.stage').boundingBox();
      expect(expandedStage!.height).toBeGreaterThan(stage!.height);
      await page.getByRole('button', { name: 'Edit shape' }).click();
    }
    await page.screenshot({
      path: info.outputPath(`studio-${width}.png`),
      fullPage: true,
    });
  });
}
test('PNG export has exact dimensions and preserves paused preview', async ({
  page,
}, info) => {
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await page.mouse.move(1, 1);
  const before = await page
    .locator('canvas')
    .screenshot({ path: info.outputPath('before.png') });
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await page.getByLabel('Quality', { exact: true }).selectOption('high');
  const promise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download PNG', exact: true }).click();
  const download = await promise;
  const path = info.outputPath('scene.png');
  await download.saveAs(path);
  const data = readFileSync(path);
  expect(data.subarray(1, 4).toString()).toBe('PNG');
  expect(data.readUInt32BE(16)).toBe(1920);
  expect(data.readUInt32BE(20)).toBe(1080);
  expect(data.length).toBeGreaterThan(15000);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Play', exact: true })
  ).toBeVisible();
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.mouse.move(1, 1);
  const after = await page
    .locator('canvas')
    .screenshot({ path: info.outputPath('after.png') });
  expect(before.equals(after)).toBe(true);
});
test('GIF contains moving frames and video has the selected resolution', async ({
  page,
}, info) => {
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await page.getByLabel('Format', { exact: true }).selectOption('gif');
  await page.getByLabel('Duration', { exact: false }).fill('2');
  const gifPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download GIF', exact: true }).click();
  const gif = await gifPromise;
  const gifPath = info.outputPath('scene.gif');
  await gif.saveAs(gifPath);
  const gifMeta = probe(gifPath);
  expect(gifMeta.streams[0].width).toBe(854);
  expect(gifMeta.streams[0].height).toBe(480);
  expect(Number(gifMeta.streams[0].nb_read_frames)).toBe(30);
  expect(Number(gifMeta.format.duration)).toBeCloseTo(2, 1);
  const hashes = execFileSync(
    'ffmpeg',
    ['-v', 'error', '-i', gifPath, '-f', 'framemd5', '-'],
    { encoding: 'utf8' }
  )
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split(',').at(-1));
  expect(new Set(hashes).size).toBeGreaterThan(10);
  const formats = await page
    .locator('#export-format option')
    .evaluateAll(options =>
      options.map(option => (option as HTMLOptionElement).value)
    );
  for (const format of formats.filter(
    value => value === 'webm' || value === 'mp4'
  )) {
    await page.getByLabel('Format', { exact: true }).selectOption(format);
    await page.getByLabel('Quality', { exact: true }).selectOption('medium');
    const promise = page.waitForEvent('download');
    await page
      .getByRole('button', {
        name: `Download ${format.toUpperCase()}`,
        exact: true,
      })
      .click();
    const video = await promise;
    expect(video.suggestedFilename()).toMatch(new RegExp(`\\.${format}$`));
    const videoPath = info.outputPath(`scene.${format}`);
    await video.saveAs(videoPath);
    const metadata = probe(videoPath);
    expect(metadata.streams[0].width).toBe(1280);
    expect(metadata.streams[0].height).toBe(720);
    expect(Number(metadata.streams[0].nb_read_frames)).toBeGreaterThan(30);
  }
});
test('export can be cancelled and retried', async ({ page }) => {
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await page.getByLabel('Format', { exact: true }).selectOption('gif');
  await page.getByLabel('Duration', { exact: false }).fill('10');
  await page.getByRole('button', { name: 'Download GIF', exact: true }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(
    page.getByText('Export cancelled. Your scene is unchanged.')
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Download GIF', exact: true })
  ).toBeEnabled();
});
test('reduced motion starts paused and unsupported video is absent', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'MediaRecorder', {
      value: undefined,
      configurable: true,
    });
  });
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Play', exact: true })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await expect(page.locator('#export-format option')).toHaveCount(2);
});

test('paused scenes stop issuing GPU draw calls and can resume', async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    const target = window as typeof window & { studioDrawCalls: number };
    target.studioDrawCalls = 0;
    const original = WebGL2RenderingContext.prototype.drawElements;
    WebGL2RenderingContext.prototype.drawElements = function (...args) {
      target.studioDrawCalls++;
      return original.apply(this, args);
    };
  });
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Pause', exact: true })
  ).toBeEnabled();
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.waitForTimeout(300);
  const count = () =>
    page.evaluate(
      () =>
        (window as typeof window & { studioDrawCalls: number }).studioDrawCalls
    );
  const paused = await count();
  await page.waitForTimeout(300);
  expect(await count()).toBe(paused);
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await page.waitForTimeout(1000);
  const draws = (await count()) - paused;
  expect(draws).toBeGreaterThan(10);
  info.annotations.push({
    type: 'GPU',
    description: `${draws} drawElements calls in 1s of playback; 0 while paused`,
  });
});

test('unavailable WebGL shows a recoverable message and disables export', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: unknown[]
    ) {
      if (
        type === 'webgl' ||
        type === 'webgl2' ||
        type === 'experimental-webgl'
      )
        return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.reload();
  await expect(page.getByRole('alert')).toContainText(
    'The 3D scene is unavailable'
  );
  await expect(
    page.getByRole('button', { name: 'Reload', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Export', exact: true })
  ).toBeDisabled();
});
