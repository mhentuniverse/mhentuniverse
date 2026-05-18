const fs = require('fs');
const path = require('path');

function walk(dir){
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fp = path.join(dir, file);
    const stat = fs.statSync(fp);
    if(stat && stat.isDirectory()) results = results.concat(walk(fp));
    else results.push(fp);
  });
  return results;
}

const root = path.resolve(__dirname, '..');
const files = walk(root).filter(f => f.endsWith('.html') || f.endsWith('.js'));

const patterns = [
  /supabase\.from\(['\"]chess_rooms['\"]\)\.update\(/g,
  /supabase\.from\(['\"]xiangqi_rooms['\"]\)\.update\(/g
];

const report = {};

for(const file of files){
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  for(const pat of patterns){
    if(pat.test(content)){
      report[rel] = report[rel] || [];
      report[rel].push(content.match(pat).length + ' matches for ' + pat.source);
    }
  }
}

console.log('Seat-claim update scan report:');
if(Object.keys(report).length === 0) console.log('  No matches found in workspace.');
else {
  for(const k of Object.keys(report)){
    console.log('  ' + k);
    report[k].forEach(r => console.log('    - ' + r));
  }
}

// Extra assertions
const indexHas = Object.keys(report).some(p => p.includes('/game/chess/index.html') || p.includes('/game/xiangqi/index.html'));
const playHas = Object.keys(report).some(p => p.includes('/game/chess/play.html') || p.includes('/game/xiangqi/play.html'));

console.log('\nSummary:');
console.log('  index contains update calls: ' + (indexHas ? 'YES' : 'NO'));
console.log('  play contains update calls: ' + (playHas ? 'YES' : 'NO'));

process.exit(indexHas ? 2 : 0);
