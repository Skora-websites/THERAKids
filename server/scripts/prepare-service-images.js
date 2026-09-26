// Copy the real clinic photos that best match each service into
// client/public/images/services/<slug>.jpg. Sources are the already-resized
// JPEGs in client/public/images/gallery/therakids/ (see prepare-gallery.ps1),
// so no re-encoding is needed here — just copy + rename. Re-runnable.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'client', 'public', 'images', 'gallery', 'therakids');
const DST = path.join(ROOT, 'client', 'public', 'images', 'services');

// slug -> photo from the clinic drop that shows the service in action
const SERVICE_PHOTOS = {
  'occupational-therapy': 'autism-day-15.jpg',    // therapist + child at an activity table
  'physiotherapy-paeds': 'autism-day-06.jpg',     // therapist supporting a child's walking
  'speech-therapy': 'autism-day-08.jpg',          // child speaking into a mic with therapist
  'special-education': 'noida-centre-08.jpg',     // activity room with work tables
  'social-group-training': 'autism-day-12.jpg',   // children in a group circle on the mats
  'early-intervention': 'birthday-09.jpg',        // toddler playing with a parent
  'psychological-assessment': 'autism-day-13.jpg', // clinicians at the assessment desk
  'reviews': 'autism-day-14.jpg',                 // celebrating progress with families
  'counseling': 'birthday-10.jpg',                // quiet parent-child moment
  'parent-training': 'workshop-03.jpg',           // parents learning together
  'behaviour-modification': 'autism-day-07.jpg',  // structured turn-taking with a therapist
  'brain-gym-therapy': 'autism-day-04.jpg'        // movement/dance on the stage
};

fs.mkdirSync(DST, { recursive: true });

let copied = 0;
const missing = [];
for (const [slug, file] of Object.entries(SERVICE_PHOTOS)) {
  const from = path.join(SRC, file);
  if (!fs.existsSync(from)) {
    missing.push(`${slug}: ${file}`);
    continue;
  }
  fs.copyFileSync(from, path.join(DST, `${slug}.jpg`));
  copied += 1;
}

console.log(`service images copied: ${copied}/${Object.keys(SERVICE_PHOTOS).length} -> ${path.relative(ROOT, DST)}`);
if (missing.length) {
  console.log('MISSING SOURCES:');
  missing.forEach((m) => console.log(`  ${m}`));
  process.exitCode = 1;
}
