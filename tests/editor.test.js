import test from 'node:test';
import assert from 'node:assert/strict';
import { loadJsx } from './helpers/load-jsx.js';

const { resizeTextarea } = await loadJsx(new URL('../src/components/AutoGrowTextarea.jsx', import.meta.url));

test('textarea grows and shrinks to content height including borders', () => {
  const textarea = { style: {}, offsetHeight: 320, clientHeight: 318, scrollHeight: 1400 };
  resizeTextarea(textarea);
  assert.equal(textarea.style.height, '1402px');
  textarea.scrollHeight = 318;
  resizeTextarea(textarea);
  assert.equal(textarea.style.height, '320px');
  assert.doesNotThrow(() => resizeTextarea(null));
});
