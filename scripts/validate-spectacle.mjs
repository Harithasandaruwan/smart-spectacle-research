/**
 * Run with the local Vite server already running:
 *   node scripts/validate-spectacle.mjs [http://127.0.0.1:5173] [chrome|msedge]
 * Requires Playwright and an installed Chrome or Edge browser. This script only
 * opens isolated browser contexts; it never pushes, deploys, or launches a server.
 * Screenshots and report: node_modules/.tmp/spectacle-v2/
 */
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'

const baseUrl = new URL(process.argv[2] || process.env.SPECTACLE_BASE_URL || 'http://127.0.0.1:5173')
const channel = process.argv[3] || process.env.SPECTACLE_BROWSER || 'chrome'
const outputDir = resolve('node_modules/.tmp/spectacle-v2')
const modelPath = '/models/smart-spectacle.glb'
const staticPath = '/images/smart-spectacle-concept.png'
const sections = ['home', 'research', 'literature', 'references', 'components', 'methodology', 'downloads', 'team']
const expectedLinkedIn = [
  'https://www.linkedin.com/in/haritha-sandaruwan-1144392a8',
  'https://lk.linkedin.com/in/ravi-supunya-2b2774ab',
]
const report = {
  baseUrl: baseUrl.href, channel, startedAt: new Date().toISOString(),
  checks: [], screenshots: [], pageErrors: [], consoleErrors: [], failedRequests: [],
  responses: [], observations: [],
}
const contexts = []
let browser

await mkdir(outputDir, { recursive: true })

function url(path = '') {
  return new URL(path, baseUrl).href
}

async function check(name, action) {
  try {
    const details = await action()
    report.checks.push({ name, passed: true, ...(details === undefined ? {} : { details }) })
    console.log(`PASS ${name}`)
    return details
  } catch (error) {
    report.checks.push({ name, passed: false, error: String(error.stack || error) })
    console.error(`FAIL ${name}: ${error.message || error}`)
    return undefined
  }
}

async function newPage(label, options = {}, init) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 }, reducedMotion: 'no-preference', ...options,
  })
  contexts.push(context)
  const page = await context.newPage()
  page.setDefaultTimeout(15_000)
  page.on('pageerror', error => report.pageErrors.push({ label, message: String(error) }))
  page.on('console', message => {
    if (message.type() === 'error') report.consoleErrors.push({ label, message: message.text() })
  })
  page.on('requestfailed', request => report.failedRequests.push({
    label, url: request.url(), error: request.failure()?.errorText,
  }))
  page.on('response', response => {
    const pathname = new URL(response.url()).pathname
    if (pathname === modelPath || pathname === staticPath || response.status() >= 400) {
      report.responses.push({ label, url: response.url(), status: response.status() })
    }
  })
  if (init) await page.addInitScript(init)
  return page
}

async function load(page, hash = '') {
  await page.goto(url(hash), { waitUntil: 'networkidle' })
  await page.locator('.spectacle-scene').waitFor({ state: 'attached' })
  await page.waitForFunction(() => {
    const status = document.querySelector('.spectacle-scene')?.getAttribute('data-scene-status')
    return status && status !== 'loading'
  })
  await page.waitForTimeout(1_500)
}

async function diagnostics(page) {
  return page.evaluate(() => {
    const scene = document.querySelector('.spectacle-scene')
    const canvas = scene?.querySelector('canvas')
    const gl = canvas?.getContext('webgl2')
    const debug = gl?.getExtension('WEBGL_debug_renderer_info')
    let effectiveOpacity = canvas ? 1 : 0
    let rendered = Boolean(canvas)
    for (let element = canvas; element; element = element.parentElement) {
      const style = getComputedStyle(element)
      effectiveOpacity *= Number(style.opacity)
      if (style.display === 'none' || style.visibility === 'hidden') rendered = false
    }
    return {
      status: scene?.getAttribute('data-scene-status'),
      reason: scene?.getAttribute('data-scene-reason'),
      canvasCount: document.querySelectorAll('canvas').length,
      canvasSize: canvas ? { width: canvas.width, height: canvas.height } : null,
      webgl2: Boolean(gl), contextLost: gl?.isContextLost() ?? null,
      renderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : null,
      effectiveOpacity, rendered,
      pointerEvents: scene ? getComputedStyle(scene).pointerEvents : null,
      viewport: { width: innerWidth, height: innerHeight }, scrollY,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      modelRequested: performance.getEntriesByType('resource').some(entry => new URL(entry.name).pathname === '/models/smart-spectacle.glb'),
    }
  })
}

async function assertWebGL(page) {
  const result = await diagnostics(page)
  assert.ok(['ready', 'static'].includes(result.status), `Unexpected scene status: ${JSON.stringify(result)}`)
  assert.equal(result.canvasCount, 1, 'Expected one shared canvas')
  assert.equal(result.webgl2, true, 'Canvas must have a working WebGL2 context')
  assert.equal(result.contextLost, false)
  assert.ok(result.canvasSize.width > 0 && result.canvasSize.height > 0)
  assert.equal(result.pointerEvents, 'none', 'Decorative scene must not intercept interaction')
  assert.equal(result.modelRequested, true, 'The browser must request the locally hosted product model')
  return result
}

async function screenshot(page, name) {
  const path = resolve(outputDir, `${name}.png`)
  await page.screenshot({ path, fullPage: false, animations: 'disabled' })
  report.screenshots.push({ name, path, diagnostics: await diagnostics(page) })
}

async function positionSection(page, id, useStage = true) {
  assert.ok(sections.includes(id))
  await page.evaluate(({ id, useStage }) => {
    const section = document.getElementById(id)
    const stage = useStage && document.querySelector(`[data-spectacle-stage="${id}"]`)
    const target = stage || section
    if (!target) throw new Error(`Missing section/stage: ${id}`)
    const rect = target.getBoundingClientRect()
    const top = id === 'home' ? 0 : scrollY + rect.top - (stage ? Math.max(95, (innerHeight - rect.height) / 2) : 95)
    window.scrollTo({ top: Math.max(0, top), behavior: 'instant' })
  }, { id, useStage })
  await page.waitForTimeout(1_050)
}

async function assertFallback(page, reasonPattern) {
  const result = await diagnostics(page)
  assert.ok(['fallback', 'static'].includes(result.status), `Unexpected fallback status: ${JSON.stringify(result)}`)
  assert.equal(result.canvasCount, 0)
  assert.match(result.reason || '', reasonPattern)
  const image = page.locator(`[data-spectacle-stage="home"] img`).first()
  await image.waitFor({ state: 'visible' })
  assert.equal(await image.evaluate(img => img.complete && img.naturalWidth > 0), true, 'Static concept image must load')
  return result
}

try {
  browser = await chromium.launch({ channel, headless: true, ignoreDefaultArgs: ['--enable-unsafe-swiftshader'] })
  const desktop = await newPage('desktop')
  await check('desktop loads a real WebGL model', async () => {
    await load(desktop)
    const result = await assertWebGL(desktop)
    assert.ok(result.effectiveOpacity > .5, 'Home model should be clearly visible')
    assert.equal(result.overflow, false)
    await screenshot(desktop, '01-home-assembled')
    return result
  })

  await check('local product assets are valid', async () => {
    const model = await desktop.request.get(url(modelPath))
    assert.equal(model.status(), 200)
    const buffer = await model.body()
    assert.equal(buffer.subarray(0, 4).toString('ascii'), 'glTF', 'Model must be binary glTF, not an HTML fallback')
    assert.equal(buffer.readUInt32LE(4), 2, 'GLB must use glTF version 2')
    assert.equal(buffer.readUInt32LE(8), buffer.length)
    assert.ok(buffer.length > 10_000, 'Product GLB should contain detailed geometry')
    const jsonLength = buffer.readUInt32LE(12)
    assert.equal(buffer.readUInt32LE(16), 0x4e4f534a)
    const gltf = JSON.parse(buffer.subarray(20, 20 + jsonLength).toString('utf8'))
    assert.ok(gltf.meshes?.length > 5, 'Product must contain multiple component meshes')
    const image = await desktop.request.get(url(staticPath))
    assert.equal(image.status(), 200)
    const imageBuffer = await image.body()
    assert.deepEqual([...imageBuffer.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10])
    return { modelBytes: buffer.length, meshes: gltf.meshes.length, nodes: gltf.nodes?.length, staticImageBytes: imageBuffer.length }
  })

  await check('stages follow the actual section order', async () => {
    const domOrder = await desktop.locator('main section[id]').evaluateAll(elements => elements.map(element => element.id))
    assert.deepEqual(domOrder, sections)
    for (const id of ['home', 'research', 'components', 'methodology']) {
      const stage = desktop.locator(`[data-spectacle-stage="${id}"]`)
      assert.equal(await stage.count(), 1, `${id} requires one dedicated visual area`)
      const box = await stage.boundingBox()
      assert.ok(box && box.width > 100 && box.height > 100)
    }
    return domOrder
  })

  for (const [id, name] of [['research', '02-research-side'], ['components', '03-components-exploded'], ['methodology', '04-methodology-reassembled'], ['team', '05-team-clear']]) {
    await check(`${id} scroll presentation`, async () => {
      await positionSection(desktop, id)
      const result = await assertWebGL(desktop)
      assert.equal(result.overflow, false)
      if (id === 'team') {
        assert.ok(result.effectiveOpacity <= .03 || !result.rendered, 'Scene should fade away at Team')
        assert.equal(await desktop.locator('#team .team-profile-card').count(), 4)
      } else {
        assert.ok(result.effectiveOpacity > .1, `${id} model should remain visible`)
      }
      await screenshot(desktop, name)
      return result
    })
  }

  await check('profiles and document links remain clickable', async () => {
    const links = await desktop.locator('#team a.linkedin-link').evaluateAll(elements => elements.map(element => ({
      href: element.href, target: element.target, rel: element.rel, label: element.getAttribute('aria-label'),
    })))
    assert.deepEqual(links.map(link => link.href).sort(), [...expectedLinkedIn].sort())
    for (const link of links) {
      assert.equal(link.target, '_blank')
      assert.match(link.rel, /noopener/)
      assert.ok(link.label)
    }
    await desktop.locator('#team a.linkedin-link').first().click({ trial: true })
    await positionSection(desktop, 'downloads', false)
    const pdfs = [...new Set(await desktop.locator('a[download]').evaluateAll(elements => elements.map(element => element.href)))]
    assert.equal(pdfs.length, 5)
    const results = []
    for (const href of pdfs) {
      const response = await desktop.request.get(href)
      assert.equal(response.status(), 200, href)
      const buffer = await response.body()
      assert.equal(buffer.subarray(0, 5).toString('ascii'), '%PDF-', `${href} must contain a PDF`)
      results.push({ url: href, bytes: buffer.length })
    }
    await desktop.locator('#downloads a[download]').first().click({ trial: true })
    return { linkedIn: links, pdfs: results }
  })

  await check('reverse and fast scrolling preserve the scene', async () => {
    for (const id of ['methodology', 'components', 'research', 'home']) {
      await positionSection(desktop, id)
      await assertWebGL(desktop)
    }
    await screenshot(desktop, '06-home-after-reverse')
    for (const id of ['team', 'home', 'components', 'downloads', 'research', 'methodology', 'components']) {
      await desktop.evaluate(id => document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' }), id)
      await desktop.waitForTimeout(60)
    }
    await positionSection(desktop, 'components')
    await screenshot(desktop, '07-components-after-fast-scroll')
    return assertWebGL(desktop)
  })

  await check('direct hash navigation and refresh keep the canvas', async () => {
    const hashPage = await newPage('hash')
    await load(hashPage, '#components')
    assert.equal(new URL(hashPage.url()).hash, '#components')
    assert.ok(await hashPage.evaluate(() => scrollY > 0))
    await assertWebGL(hashPage)
    await screenshot(hashPage, '08-direct-components-hash')
    await hashPage.reload({ waitUntil: 'networkidle' })
    await hashPage.waitForTimeout(1_500)
    await assertWebGL(hashPage)
    const box = await hashPage.locator('#components').boundingBox()
    assert.ok(box && box.y < 300 && box.y + box.height > 0, 'Refresh should keep the target section in view')
    await hashPage.evaluate(() => { location.hash = '#research' })
    await hashPage.waitForTimeout(1_500)
    const result = await assertWebGL(hashPage)
    await screenshot(hashPage, '09-research-hash')
    return result
  })

  await check('desktop resize and mobile transition recover correctly', async () => {
    await desktop.setViewportSize({ width: 1024, height: 768 })
    await positionSection(desktop, 'home')
    let result = await assertWebGL(desktop)
    assert.equal(result.overflow, false)
    await screenshot(desktop, '10-desktop-1024')
    await desktop.setViewportSize({ width: 390, height: 844 })
    await positionSection(desktop, 'home')
    await assertFallback(desktop, /mobile|small/i)
    await desktop.setViewportSize({ width: 1440, height: 960 })
    await positionSection(desktop, 'home')
    result = await assertWebGL(desktop)
    return result
  })

  await check('phone uses a readable static presentation', async () => {
    const mobile = await newPage('mobile', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
    await load(mobile)
    const result = await assertFallback(mobile, /mobile|small/i)
    assert.equal(result.overflow, false)
    await screenshot(mobile, '11-mobile-home')
    await positionSection(mobile, 'components')
    await screenshot(mobile, '12-mobile-components')
    await positionSection(mobile, 'team', false)
    await screenshot(mobile, '13-mobile-team')
    await mobile.locator('#team a.linkedin-link').first().click({ trial: true })
    return result
  })

  await check('reduced motion retains a static WebGL product', async () => {
    const reduced = await newPage('reduced-motion', { reducedMotion: 'reduce' })
    await load(reduced)
    const result = await assertWebGL(reduced)
    assert.equal(await reduced.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true)
    await screenshot(reduced, '14-reduced-motion-home')
    await positionSection(reduced, 'components')
    await assertWebGL(reduced)
    await screenshot(reduced, '15-reduced-motion-components')
    await positionSection(reduced, 'team', false)
    assert.ok((await diagnostics(reduced)).effectiveOpacity <= .03)
    return result
  })

  await check('unavailable WebGL displays the polished local fallback', async () => {
    const fallback = await newPage('webgl-unavailable', {}, () => {
      const original = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        return type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl' ? null : original.call(this, type, ...args)
      }
    })
    await load(fallback)
    const result = await assertFallback(fallback, /webgl|unsupported|unavailable/i)
    await screenshot(fallback, '16-webgl-unavailable')
    return result
  })

  await check('context loss switches cleanly to fallback', async () => {
    const lost = await newPage('context-lost')
    await load(lost)
    await assertWebGL(lost)
    const triggered = await lost.evaluate(() => {
      const extension = document.querySelector('canvas')?.getContext('webgl2')?.getExtension('WEBGL_lose_context')
      extension?.loseContext()
      return Boolean(extension)
    })
    assert.equal(triggered, true, 'Context-loss extension must be available for this check')
    await lost.waitForFunction(() => document.querySelector('.spectacle-scene')?.getAttribute('data-scene-reason') === 'context-lost')
    await lost.waitForTimeout(500)
    const result = await assertFallback(lost, /context.*lost/i)
    await screenshot(lost, '17-context-lost')
    return result
  })

  await check('model load errors display fallback and preserve page links', async () => {
    const errorPage = await newPage('intentional-asset-load-error')
    await errorPage.route(`**${modelPath}`, route => route.fulfill({ status: 404, contentType: 'text/plain', body: 'Intentional model failure for browser validation' }))
    await load(errorPage)
    const result = await assertFallback(errorPage, /asset|model|load|error/i)
    await screenshot(errorPage, '18-model-load-error')
    await errorPage.locator('#home a[href="#research"]').click({ trial: true })
    return result
  })

  await check('no uncaught browser exceptions', () => {
    assert.deepEqual(report.pageErrors, [])
    const unexpected = report.failedRequests.filter(request => request.label !== 'intentional-asset-load-error' && !request.url.includes('/images/team/'))
    assert.deepEqual(unexpected, [])
    return { uncaughtExceptions: report.pageErrors.length, unexpectedFailedRequests: unexpected.length }
  })
} catch (error) {
  report.checks.push({ name: 'validation setup', passed: false, error: String(error.stack || error) })
  console.error(error)
} finally {
  for (const context of contexts) await context.close().catch(() => {})
  await browser?.close().catch(() => {})
  report.finishedAt = new Date().toISOString()
  report.passed = report.checks.every(result => result.passed)
  report.observations.push('Screenshots require human visual review for model quality, transparent lenses, assembled connections, and exploded alignment.')
  await writeFile(resolve(outputDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
  console.log(`${report.passed ? 'PASS' : 'FAIL'}: ${report.checks.filter(check => check.passed).length}/${report.checks.length} checks; artifacts: ${outputDir}`)
  if (!report.passed) process.exitCode = 1
}
