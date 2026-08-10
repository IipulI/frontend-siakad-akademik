const fs = require('fs');

const data = JSON.parse(fs.readFileSync('KOLO REV.json', 'utf-8'));
const urls = [];

function extractRequests(itemList, pathPrefix = '') {
  for (const item of itemList) {
    const name = pathPrefix + (item.name || 'Unknown');
    if (item.request) {
      let url = item.request.url;
      if (typeof url === 'object') {
        urls.push(`${name}: ${url.raw || ''}`);
      } else if (typeof url === 'string') {
        urls.push(`${name}: ${url}`);
      }
    }
    if (item.item) {
      extractRequests(item.item, name + ' -> ');
    }
  }
}

extractRequests(data.item || []);
fs.writeFileSync('endpoints_list.txt', urls.join('\n'), 'utf-8');
console.log('Done writing endpoints_list.txt');
