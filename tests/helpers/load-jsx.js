import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Compile the actual JSX modules for Node's built-in runner without a test framework.
const compiled = new Map();
async function compileJsx(url) {
  if (compiled.has(url.href)) return compiled.get(url.href);
  const source = await readFile(url, 'utf8');
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
    fileName: url.pathname,
  });
  for (const [statement, quote, specifier] of outputText.matchAll(/from (["'])([^"']+)\1/g)) {
    let resolved;
    if (specifier.startsWith('.')) {
      const dependency = new URL(specifier, url);
      if (!/\.[cm]?jsx?$/.test(dependency.pathname)) dependency.pathname += '.jsx';
      resolved = dependency.pathname.endsWith('.jsx') ? await compileJsx(dependency) : dependency.href;
    } else resolved = import.meta.resolve(specifier);
    outputText = outputText.replace(statement, `from ${quote}${resolved}${quote}`);
  }
  const result = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
  compiled.set(url.href, result);
  return result;
}

export async function loadJsx(url) {
  return import(await compileJsx(url));
}
