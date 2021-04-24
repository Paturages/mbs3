const fs = require('fs').promises;
const path = require('path');

(async () => {
  const profiles = await fs.readdir(path.resolve(__dirname, '..', 'best'));
  let summary = '';
  for (const filePath of profiles) {
    const content = await fs.readFile(path.resolve(__dirname, '..', 'best', filePath), { encoding: 'utf8' });
    const lines = content.split('\n').slice(3);
    summary += `${filePath}\nBest PP:\n${lines[0]}\nWorst PP:\n${lines[lines.length-3]}\n\n`;
  }
  console.log(summary);
})();
