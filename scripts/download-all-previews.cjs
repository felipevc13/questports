const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const previewsDir = path.join(__dirname, '../public/previews');
if (!fs.existsSync(previewsDir)) {
  fs.mkdirSync(previewsDir, { recursive: true });
}

// Read mockPorts.ts
const mockPortsContent = fs.readFileSync(path.join(__dirname, '../app/data/mockPorts.ts'), 'utf8');
const videoPreviewsContent = fs.readFileSync(path.join(__dirname, '../app/data/videoPreviews.ts'), 'utf8');

const games = [];
const blocks = mockPortsContent.split(/\{\s*id:\s*'/);
for (const b of blocks.slice(1)) {
  const slugMatch = b.match(/slug:\s*'([^']+)'/);
  const ytMatch = b.match(/youtube_video_id:\s*'([^']+)'/);
  const titleMatch = b.match(/title:\s*'([^']+)'/);
  if (slugMatch && ytMatch && ytMatch[1] && ytMatch[1] !== 'null') {
    games.push({
      slug: slugMatch[1],
      yt: ytMatch[1],
      title: titleMatch ? titleMatch[1] : slugMatch[1]
    });
  }
}

console.log(`Found ${games.length} games with YouTube IDs.`);

// Extract time ranges from videoPreviews.ts if available
function getRange(slug, yt) {
  const slugRegex = new RegExp(`'${slug}':\\s*\\{\\s*start:\\s*'([^']+)',\\s*end:\\s*'([^']+)'`);
  const match = videoPreviewsContent.match(slugRegex);
  if (match) {
    const toSecs = (str) => {
      const parts = str.split(':');
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    };
    return { start: toSecs(match[1]), end: toSecs(match[2]) };
  }
  return { start: 15, end: 22 };
}

for (const game of games) {
  const outFile = path.join(previewsDir, `${game.slug}.mp4`);
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`[SKIP] Already exists: ${game.slug}.mp4 (${Math.round(fs.statSync(outFile).size / 1024)} KB)`);
    continue;
  }

  const { start, end } = getRange(game.slug, game.yt);
  console.log(`[DOWNLOADING] ${game.slug} (${start}s - ${end}s)...`);

  try {
    const cmd = `yt-dlp --download-sections "*${start}-${end}" -f "230/18/best[height<=360]/best" "https://www.youtube.com/watch?v=${game.yt}" -o "${outFile}"`;
    execSync(cmd, { stdio: 'inherit', timeout: 30000 });
    console.log(`[OK] Created ${game.slug}.mp4`);
  } catch (err) {
    console.warn(`[WARN] Failed to download for ${game.slug}:`, err.message);
  }
}

console.log('All done!');
