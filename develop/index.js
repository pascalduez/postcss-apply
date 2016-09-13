import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import reporter from 'postcss-reporter';
import plugin from '../';

const read = name =>
  fs.readFileSync(path.join(process.cwd(), 'test', 'fixture', name), 'utf8');

const input = read('apply/input.css');

postcss()
  .use(plugin)
  .use(reporter)
  .process(input)
  .then(result => {
    console.log(result.css);
  })
  .catch(console.error);
