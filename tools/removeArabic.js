const fs = require('fs');
const path = require('path');

const exts = ['.js','.jsx','.ts','.tsx','.html','.css','.json','.md'];
const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;

function walk(dir){
  for(const name of fs.readdirSync(dir)){
    const p = path.join(dir, name);
    if(fs.statSync(p).isDirectory()){
      walk(p);
    } else if(exts.includes(path.extname(p))){
      let txt = fs.readFileSync(p, 'utf8');
      const newTxt = txt.replace(arabicRegex, '');
      if(newTxt !== txt){
        fs.writeFileSync(p + '.bak', txt, 'utf8');
        fs.writeFileSync(p, newTxt, 'utf8');
        console.log('Updated:', p);
      }
    }
  }
}

const root = path.resolve(__dirname, '..'); // adjust if needed
walk(root);
console.log('Done.');