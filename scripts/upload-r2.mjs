/**
 * Upload all local assets to Cloudflare R2 bucket "web"
 * Run: node scripts/upload-r2.mjs
 * Requires: wrangler authenticated (npx wrangler login)
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BUCKET = 'web';

// Explicit mapping: [localPath (relative to project root), r2Key]
const uploads = [
  // ── Logos ──────────────────────────────────────────────────────────────────
  ['assets/logo/logo_Logo-01-pvc.png',              'logo/Logo-01-pvc.png'],
  ['assets/logo/logo_Logo-02-alkathene.png',        'logo/Logo-02-alkathene.png'],
  ['assets/logo/logo_Logo-03-whay bridge.png',      'logo/Logo-03-whay bridge.png'],
  ['assets/logo/logo_Logo-04-ganglow.png',          'logo/Logo-04-ganglow.png'],
  ['assets/logo/logo_Logo-07-main.png',             'logo/Logo-07-main.png'],
  ['assets/logo/logo_Logo-08-garden.png',           'logo/Logo-08-garden.png'],

  // ── Backgrounds ────────────────────────────────────────────────────────────
  ['assets/Background/background_ChatGPT Image May 14, 2026, 09_49_29 AM.png',
                                                    'background/ChatGPT Image May 14, 2026, 09_49_29 AM.png'],
  ['assets/Background/background_ChatGPT Image May 14, 2026, 09_49_35 AM.png',
                                                    'background/ChatGPT Image May 14, 2026, 09_49_35 AM.png'],
  ['assets/Background/background_ChatGPT Image May 14, 2026, 12_37_12 PM.png',
                                                    'background/ChatGPT Image May 14, 2026, 12_37_12 PM.png'],

  // ── Gallery (skip (1)(2)(3) duplicates — upload canonical files only) ──────
  ['assets/Gallary/gallery_event-gallery-001.jpg',  'gallery/event-gallery-001.jpg'],
  ['assets/Gallary/gallery_event-gallery-002.jpg',  'gallery/event-gallery-002.jpg'],
  ['assets/Gallary/gallery_event-gallery-003.jpg',  'gallery/event-gallery-003.jpg'],
  ['assets/Gallary/gallery_event-gallery-004.jpg',  'gallery/event-gallery-004.jpg'],
  ['assets/Gallary/gallery_event-gallery-005.jpg',  'gallery/event-gallery-005.jpg'],
  ['assets/Gallary/gallery_event-gallery-006.jpg',  'gallery/event-gallery-006.jpg'],
  ['assets/Gallary/gallery_event-gallery-007.jpg',  'gallery/event-gallery-007.jpg'],
  ['assets/Gallary/gallery_event-gallery-008.jpg',  'gallery/event-gallery-008.jpg'],
  ['assets/Gallary/gallery_event-gallery-009.jpg',  'gallery/event-gallery-009.jpg'],
  ['assets/Gallary/gallery_event-gallery-010.jpg',  'gallery/event-gallery-010.jpg'],
  ['assets/Gallary/gallery_event-gallery-011.jpg',  'gallery/event-gallery-011.jpg'],
  ['assets/Gallary/gallery_event-gallery-012.jpg',  'gallery/event-gallery-012.jpg'],
  ['assets/Gallary/gallery_event-gallery-013.jpg',  'gallery/event-gallery-013.jpg'],
  ['assets/Gallary/gallery_event-gallery-014.jpg',  'gallery/event-gallery-014.jpg'],
  ['assets/Gallary/gallery_event-gallery-015.jpg',  'gallery/event-gallery-015.jpg'],
  // 016, 017 missing locally — add manually to R2 if needed
  ['assets/Gallary/gallery_event-gallery-018.jpg',  'gallery/event-gallery-018.jpg'],
  ['assets/Gallary/gallery_event-gallery-019.jpg',  'gallery/event-gallery-019.jpg'],
  ['assets/Gallary/gallery_event-gallery-020.jpg',  'gallery/event-gallery-020.jpg'],
  // 021 missing locally — add manually to R2 if needed
  ['assets/Gallary/gallery_event-gallery-022.jpg',  'gallery/event-gallery-022.jpg'],
  ['assets/Gallary/gallery_event-gallery-023.jpg',  'gallery/event-gallery-023.jpg'],
  ['assets/Gallary/gallery_event-gallery-024.jpg',  'gallery/event-gallery-024.jpg'],
  ['assets/Gallary/gallery_event-gallery-025.jpg',  'gallery/event-gallery-025.jpg'],
  ['assets/Gallary/gallery_event-gallery-026.jpg',  'gallery/event-gallery-026.jpg'],
  ['assets/Gallary/gallery_event-gallery-027.jpg',  'gallery/event-gallery-027.jpg'],

  // ── Machinery ──────────────────────────────────────────────────────────────
  ['assets/machinery/crusher/machinery_crusher_hero.png',                     'machinery/crusher/hero.png'],
  ['assets/machinery/crusher/machinery_crusher_detail-2.png',                 'machinery/crusher/detail-2.png'],
  ['assets/machinery/crusher-blades/machinery_crusher-blades_hero.png',       'machinery/crusher-blades/hero.png'],
  ['assets/machinery/crusher-blades/machinery_crusher-blades_detail-2.png',   'machinery/crusher-blades/detail-2.png'],
  ['assets/machinery/crusher-blades/machinery_crusher-blades_detail-3.png',   'machinery/crusher-blades/detail-3.png'],
  ['assets/machinery/facility/machinery_facility_hero (1).png',               'machinery/facility/hero.png'],
  ['assets/machinery/facility/machinery_facility_intro.png',                  'machinery/facility/intro.png'],
  ['assets/machinery/laser/machinery_laser_hero.png',                         'machinery/laser/hero.png'],
  ['assets/machinery/laser/machinery_laser_detail-2.png',                     'machinery/laser/detail-2.png'],
  ['assets/machinery/laser/machinery_laser_detail-3.png',                     'machinery/laser/detail-3.png'],
  ['assets/machinery/pipe/machinery_pipe_hero.png',                           'machinery/pipe/hero.png'],
  ['assets/machinery/pipe/machinery_pipe_detail-2.png',                       'machinery/pipe/detail-2.png'],
  ['assets/machinery/pipe/machinery_pipe_detail-3.png',                       'machinery/pipe/detail-3.png'],
  ['assets/machinery/shredder/machinery_shredder_hero.png',                   'machinery/shredder/hero.png'],
  ['assets/machinery/shredder/machinery_shredder_detail-2.png',               'machinery/shredder/detail-2.png'],
  ['assets/machinery/shredder-blades/machinery_shredder-blades_hero.png',     'machinery/shredder-blades/hero.png'],
  ['assets/machinery/shredder-blades/machinery_shredder-blades_detail-2.png', 'machinery/shredder-blades/detail-2.png'],
  ['assets/machinery/shredder-blades/machinery_shredder-blades_detail-3.png', 'machinery/shredder-blades/detail-3.png'],

  // ── Root product images & video ────────────────────────────────────────────
  ['assets/Alkathene Pipe.png',           'Alkathene Pipe.png'],
  ['assets/Alkathene Pipe old.png',       'Alkathene Pipe old.png'],
  ['assets/PVC Pipe.png',                 'PVC Pipe.png'],
  ['assets/PVC Pipes.png',               'PVC Pipes.png'],
  ['assets/Conduit Pipes.png',           'Conduit Pipes.png'],
  ['assets/Colorful Plastic Pellets.png', 'Colorful Plastic Pellets.png'],
  ['assets/bridge-yelow.png',            'bridge-yelow.png'],
  ['assets/direct.png',                  'direct.png'],
  ['assets/garden-hose.png',             'garden-hose.png'],
  ['assets/garden-hose-2.png',           'garden-hose-2.png'],
  ['assets/pvc.jpg',                     'pvc.jpg'],
  ['assets/recycled-plastic.jpg',        'recycled-plastic.jpg'],
  ['assets/recycal-hand.jpg',            'recycal-hand.jpg'],
  ['assets/video_2026-05-20_06-38-54.mp4', 'video_2026-05-20_06-38-54.mp4'],
];

let passed = 0;
let failed = 0;
let skipped = 0;

console.log(`\nUploading ${uploads.length} assets to R2 bucket "${BUCKET}"\n`);

for (const [localRel, r2Key] of uploads) {
  const localAbs = path.join(ROOT, localRel);

  if (!existsSync(localAbs)) {
    console.warn(`  SKIP  (not found) ${localRel}`);
    skipped++;
    continue;
  }

  try {
    execSync(
      `npx wrangler r2 object put "${BUCKET}/${r2Key}" --file="${localAbs}"`,
      { cwd: ROOT, stdio: 'pipe' }
    );
    console.log(`  OK    ${r2Key}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL  ${r2Key}`);
    console.error('        ' + (err.stderr?.toString().trim() || err.message));
    failed++;
  }
}

console.log(`\nDone: ${passed} uploaded, ${skipped} skipped, ${failed} failed`);

if (skipped > 0) {
  console.log('\nSkipped files were not found locally. Gallery images 016, 017, 021 are missing');
  console.log('— upload them manually via the Cloudflare R2 dashboard if needed.');
}
if (failed > 0) {
  console.log('\nFailed uploads — run "npx wrangler login" if not authenticated, then retry.');
  process.exit(1);
}
