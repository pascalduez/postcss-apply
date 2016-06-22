import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import plugin from '../';

const read = name =>
  fs.readFileSync(path.join(process.cwd(), 'test', 'fixture', name), 'utf8');

const input = read('apply/input.css');

postcss()
  .use(plugin)
  .process(input)
  .then(result => {
    console.log(result.css);
  });
