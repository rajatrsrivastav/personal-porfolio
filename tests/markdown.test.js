import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkStandaloneLinks from '../src/utils/remarkStandaloneLinks.js';
import { loadJsx } from './helpers/load-jsx.js';

const { default: Markdown } = await loadJsx(new URL('../src/components/Markdown.jsx', import.meta.url));
const render = content => renderToStaticMarkup(createElement(Markdown, { content }));

const quote = '> That repeated process is called **reconciliation**: observe, compare, act, and check again.';

test('blockquote parses the requested inline bold formatting', () => {
  assert.equal(render(quote), '<div class="blog-prose"><blockquote>\n<p>That repeated process is called <strong>reconciliation</strong>: observe, compare, act, and check again.</p>\n</blockquote></div>');
});

test('standalone and paragraph-separated horizontal rules render as hr', () => {
  assert.equal(render('---'), '<div class="blog-prose"><hr/></div>');
  const html = render(`${quote}\n\n---\n\nNext paragraph.`);
  assert.match(html, /<\/blockquote>\n<hr\/>\n<p>Next paragraph\.<\/p>/);
  assert.doesNotMatch(html, /\*\*|---/);
});

test('CommonMark headings, nested inline formatting, links and paragraphs', () => {
  const html = render('# Title\n## Second\n### Third\n#### Fourth\n##### Fifth\n###### Sixth\n\n**bold with *italic*** and [a **link**](/blog).\n\nNext paragraph.');
  for (let level = 1; level <= 6; level++) assert.match(html, new RegExp(`<h${level}>`));
  assert.match(html, /<strong>bold with <em>italic<\/em><\/strong>/);
  assert.match(html, /<a href="\/blog">a <strong>link<\/strong><\/a>/);
  assert.match(html, /<\/p>\n<p>Next paragraph\.<\/p>/);
  assert.doesNotMatch(html, /white-space/);
});

test('ordered, unordered, nested and loose lists preserve structure', () => {
  const html = render('3. Third\n4. Fourth\n\n- Parent\n  - **Child**\n\n- Another paragraph\n\n  Inside the same item.');
  assert.match(html, /<ol start="3">/);
  assert.equal((html.match(/<ul>/g) || []).length, 2);
  assert.match(html, /<li><strong>Child<\/strong><\/li>/);
  assert.match(html, /<p>Inside the same item\.<\/p>/);
});

test('inline, fenced and indented code remain escaped and preserve whitespace', () => {
  const html = render('Use `a < b`.\n\n```js\nconst count = 2;\n  console.log("ok");\n```\n\n    <script>alert(1)</script>');
  assert.match(html, /<code>a &lt; b<\/code>/);
  assert.match(html, /<pre><code class="language-js">/);
  assert.match(html, /class="syntax-keyword">const/);
  assert.match(html, /class="syntax-number">2/);
  assert.match(html, /  console\.log/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});

test('GFM tables, strikethrough, autolinks and task lists', () => {
  const html = render('| Feature | Status |\n| :--- | ---: |\n| **Tables** | ~~pending~~ done |\n\nhttps://example.com\n\n- [x] Finished');
  assert.match(html, /class="blog-table-scroll"><table>/);
  assert.match(html, /<th style="text-align:left">Feature<\/th>/);
  assert.match(html, /<td style="text-align:right"><del>pending<\/del> done<\/td>/);
  assert.match(html, /<a href="https:\/\/example.com">/);
  assert.match(html, /type="checkbox"/);
  assert.match(html, /disabled=""/);
});

test('raw HTML and unsafe URL schemes cannot create executable markup', () => {
  const html = render('<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n<iframe src="https://evil.example"></iframe>\n\n[unsafe](javascript:alert%281%29)\n\n![unsafe](data:text/html;base64,PHNjcmlwdD4=)\n\n[safe](https://example.com)');
  assert.doesNotMatch(html, /<script|<iframe|onerror=|javascript:|data:text\/html/);
  assert.match(html, /<a href="https:\/\/example.com">safe<\/a>/);
});

test('empty content renders safely', () => {
  assert.equal(renderToStaticMarkup(createElement(Markdown)), '<div class="blog-prose"></div>');
});

test('only paragraphs containing a bare HTTP(S) URL qualify for cards', () => {
  const candidates = [];
  renderToStaticMarkup(createElement(ReactMarkdown, {
    remarkPlugins: [remarkGfm, remarkStandaloneLinks],
    components: { p({ node, children }) {
      if (node.properties.dataPreviewUrl) candidates.push(node.properties.dataPreviewUrl);
      return createElement('p', {}, children);
    } },
  }, 'https://openkruise.io/\n\n[OpenKruise](https://openkruise.io/)\n\n[https://openkruise.io/](https://openkruise.io/)\n\nSee https://openkruise.io/ for details.\n\n<https://openkruise.io/>\n\n`https://openkruise.io/`\n\nhttps://one.example/ https://two.example/\n\nhttp://example.com/'));
  assert.deepEqual(candidates, ['https://openkruise.io/', 'http://example.com/']);
});

test('standalone URLs fall back to normal links and cards can be disabled', () => {
  const html = render('https://openkruise.io/');
  assert.equal(html, '<div class="blog-prose"><p><a href="https://openkruise.io/">https://openkruise.io/</a></p></div>');
  assert.equal(renderToStaticMarkup(createElement(Markdown, { content: 'https://openkruise.io/', linkPreviews: false })), html);
});

test('editor preview and published post use the same renderer', async () => {
  for (const file of ['AdminPage.jsx', 'BlogPostPage.jsx']) {
    const page = await readFile(new URL(`../src/site-pages/${file}`, import.meta.url), 'utf8');
    assert.match(page, /import Markdown from ['"]\.\.\/components\/Markdown['"]/);
    assert.match(page, /<Markdown content=/);
  }
});
