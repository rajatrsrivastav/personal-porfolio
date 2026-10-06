import http from 'node:http';
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { timingSafeEqual, createHash, createHmac, randomUUID } from 'node:crypto';
const root = resolve('dist');
const file = resolve(process.env.POSTS_FILE || 'data/posts.json');
const origin = process.env.SITE_URL || 'https://rajatsrivastav.dev';
const hash = value => createHash('sha256').update(value).digest();
const sessionAge = 7 * 24 * 60 * 60;
const sign = value => createHmac('sha256', process.env.ADMIN_PASSKEY || '').update(value).digest('hex');
const tokenFrom = req => (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith('admin_session='))?.slice(14);
const authorized = req => {
  const token = tokenFrom(req);
  if (!process.env.ADMIN_PASSKEY || !token) return false;
  const [expires, nonce, signature] = token.split('.');
  return Boolean(signature && nonce && Number(expires) > Date.now() && timingSafeEqual(hash(signature), hash(sign(`${expires}.${nonce}`))));
};
const cookie = (res, token, age) => res.setHeader('Set-Cookie', `admin_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}${origin.startsWith('https:') && process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
const normalize = p => ({...p, id:p.id || p.slug, category:p.category ?? p.topic, excerpt:p.excerpt ?? p.description, topic:p.category ?? p.topic, description:p.excerpt ?? p.description, tags:(p.category ?? p.topic ?? '').split(',').map(t=>t.trim()).filter(Boolean), updatedAt:p.updatedAt || p.createdAt, publishedAt:p.publishedAt || (p.status === 'published' ? p.createdAt : null)});
const visible = p => p.status === 'published' && (!p.publishedAt || Date.parse(p.publishedAt) <= Date.now());
const sortPosts = all => all.sort((a,b)=>Date.parse(b.publishedAt || b.updatedAt || b.createdAt || 0)-Date.parse(a.publishedAt || a.updatedAt || a.createdAt || 0));
const bodyOf = async req => {
  let body='';
  for await (const chunk of req) { body+=chunk; if(Buffer.byteLength(body)>200000) { const e=new Error('Post too large'); e.status=413; throw e; } }
  try { return JSON.parse(body); } catch { const e=new Error('Invalid JSON'); e.status=400; throw e; }
};
const posts = async () => { try { return JSON.parse(await readFile(file, 'utf8')).map(normalize); } catch (e) { if (e.code === 'ENOENT') return []; throw e; } };
const xml = s => String(s).replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
let queue = Promise.resolve();
const attempts = new Map();
const send = (res, status, body) => { res.writeHead(status, {'Content-Type':'application/json', 'Cache-Control':'no-store'}); res.end(JSON.stringify(body)); };
http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  const url = new URL(req.url, origin);
  try {
    const mutation = !['GET','HEAD'].includes(req.method);
    if (url.pathname.startsWith('/api/') && mutation && req.headers.origin && ![origin, `http://${req.headers.host}`, `https://${req.headers.host}`].includes(req.headers.origin)) return send(res,403,{error:'Invalid origin'});
    if (url.pathname === '/api/admin/login' && req.method === 'POST') {
      if (!process.env.ADMIN_PASSKEY) return send(res,503,{error:'Set ADMIN_PASSKEY on the server before signing in.'});
      const key=req.socket.remoteAddress;
      const entry=attempts.get(key) || {count:0,until:Date.now()+60000};
      if(Date.now()>entry.until) { entry.count=0; entry.until=Date.now()+60000; }
      if(entry.count>=10) return send(res,429,{error:'Too many attempts. Try again in a minute.'});
      const payload=await bodyOf(req);
      if(!payload || typeof payload.passkey !== 'string' || !timingSafeEqual(hash(payload.passkey),hash(process.env.ADMIN_PASSKEY))) {entry.count++;attempts.set(key,entry);return send(res,401,{error:'Invalid passkey'});}
      attempts.delete(key);
      const value=`${Date.now()+sessionAge*1000}.${randomUUID()}`;
      cookie(res,`${value}.${sign(value)}`,sessionAge);
      return send(res,200,{authenticated:true});
    }
    if(url.pathname === '/api/admin/verify' && req.method === 'GET') {
      if(authorized(req)) return send(res,200,{authenticated:true});
      cookie(res,'',0);return send(res,401,{error:'Session expired. Please sign in.'});
    }
    if(url.pathname === '/api/admin/logout' && req.method === 'POST') {cookie(res,'',0);return send(res,200,{authenticated:false});}
    const postMatch=url.pathname.match(/^\/api\/posts\/([^/]+)$/);
    if(url.pathname === '/api/posts' || postMatch) {
      const admin=authorized(req), id=postMatch ? decodeURIComponent(postMatch[1]) : null;
      if(req.method === 'GET') {
        if(url.searchParams.get('all') === 'true' && !admin) return send(res,401,{error:'Authentication required'});
        const all=sortPosts((await posts()).filter(p=>url.searchParams.get('all') === 'true' && admin || visible(p)));
        if(!id) return send(res,200,all);
        const record=all.find(p=>p.id===id || p.slug===id);
        return send(res,record?200:404,record || {error:'Post not found'});
      }
      if(!['POST','PUT','PATCH','DELETE'].includes(req.method) || (id && req.method==='POST') || (!id && req.method!=='POST')) return send(res,405,{error:'Method not allowed'});
      if(!admin) return send(res,401,{error:'Authentication required'});
      const payload=req.method === 'DELETE' ? null : await bodyOf(req);
      if(req.method !== 'DELETE' && (!payload || typeof payload!=='object' || Array.isArray(payload))) return send(res,400,{error:'Invalid post fields'});
      const save=queue.then(async()=>{
        const all=await posts(), index=id ? all.findIndex(p=>p.id===id) : -1;
        if(id && index<0) return send(res,404,{error:'Post not found'});
        let record;
        if(req.method === 'DELETE') all.splice(index,1);
        else {
          const previous=index>=0 ? all[index] : {};
          const fields={};
          for(const key of ['title','slug','category','readTime','excerpt','content','status','publishedAt']) if(Object.hasOwn(payload,key)) fields[key]=payload[key];
          if(Object.hasOwn(payload,'topic') && !Object.hasOwn(payload,'category')) fields.category=payload.topic;
          if(Object.hasOwn(payload,'description') && !Object.hasOwn(payload,'excerpt')) fields.excerpt=payload.description;
          record={...previous,...fields};
          if(!['title','slug','category','readTime','excerpt','content'].every(k=>typeof record[k]==='string' && record[k].trim()) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug) || !['draft','published'].includes(record.status) || record.title.length>200 || record.excerpt.length>1000 || ['slug','category','readTime'].some(k=>record[k].length>200) || (record.publishedAt!=null && (typeof record.publishedAt!=='string' || !Number.isFinite(Date.parse(record.publishedAt))))) return send(res,400,{error:'Complete all fields and use a valid slug and publication date.'});
          if(all.some((p,i)=>i!==index && p.slug===record.slug)) return send(res,409,{error:'Slug already exists'});
          const now=new Date().toISOString();
          record=normalize({...record,id:previous.id || randomUUID(),createdAt:previous.createdAt || now,updatedAt:now,publishedAt:record.status==='published' ? (Object.hasOwn(fields,'publishedAt') ? fields.publishedAt || now : previous.status==='published' ? previous.publishedAt || now : now) : record.publishedAt || null});
          if(index>=0) all[index]=record;else all.unshift(record);
        }
        await mkdir(resolve(file,'..'),{recursive:true});await writeFile(file+'.tmp',JSON.stringify(all,null,2));await rename(file+'.tmp',file);
        return send(res,req.method==='POST'?201:200,record || {deleted:true});
      });
      queue=save.catch(()=>{});await save;return;
    }
    if(url.pathname.startsWith('/api/')) return send(res,404,{error:'Route not found'});
    if (url.pathname === '/robots.txt') { res.setHeader('Content-Type','text/plain'); return res.end(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${origin}/sitemap.xml\n`); }
    if (url.pathname === '/sitemap.xml' || url.pathname === '/rss.xml') {
      const published=(await posts()).filter(visible);
      res.setHeader('Content-Type','application/xml');
      if(url.pathname==='/sitemap.xml') return res.end(`<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/','/blog',...published.map(p=>'/blog/'+p.slug)].map(path=>`<url><loc>${xml(origin+path)}</loc></url>`).join('')}</urlset>`);
      return res.end(`<?xml version="1.0"?><rss version="2.0"><channel><title>Rajat's Field Notes</title><link>${xml(origin+'/blog')}</link><description>Engineering essays and architecture field notes</description>${published.map(p=>`<item><title>${xml(p.title)}</title><link>${xml(origin+'/blog/'+p.slug)}</link><guid>${xml(origin+'/blog/'+p.slug)}</guid><description>${xml(p.description)}</description></item>`).join('')}</channel></rss>`);
    }
    if (!['GET','HEAD'].includes(req.method)) return send(res,405,{error:'Method not allowed'});
    const path=resolve(root, '.'+decodeURIComponent(url.pathname));
    if(path!==root && !path.startsWith(root+'/')) return send(res,403,{error:'Forbidden'});
    let data, name=path;
    try { data=await readFile(path); } catch { name=resolve(root,'index.html'); data=await readFile(name); }
    if(url.pathname.startsWith('/admin')) res.setHeader('X-Robots-Tag','noindex, nofollow');
    res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'}[extname(name)] || 'application/octet-stream'));
    if (extname(name) === '.html') {
      let html = data.toString();
      const slug = url.pathname.match(/^\/blog\/([^/]+)$/)?.[1];
      const article = slug ? (await posts()).find(p => p.slug === slug && visible(p)) : null;
      const title = article ? article.title + ' — Rajat Srivastav' : url.pathname === '/blog' ? 'Field Notes — Rajat Srivastav' : 'Rajat Srivastav — Full-Stack Engineer & Systems Builder';
      const description = article?.description;
      html = html.replace(/<title>.*?<\/title>/, `<title>${xml(title)}</title>`)
        .replace(/(<meta (?:property|name)="(?:og:title|twitter:title)" content=")[^"]*/, `$1${xml(title)}`)
        .replace(/(<link rel="canonical" href=")[^"]*/, `$1${xml(origin + url.pathname)}`)
        .replace(/(<meta property="og:url" content=")[^"]*/, `$1${xml(origin + url.pathname)}`);
      if (description) html = html.replace(/(<meta (?:property|name)="(?:description|og:description|twitter:description)" content=")[^"]*/g, `$1${xml(description)}`);
      if (slug && !article) res.statusCode = 404;
      data = html;
    }
    res.end(req.method==='HEAD' ? undefined : data);
  } catch(e) { console.error(e.message); send(res,e.status || 500,{error:e.status ? e.message : 'Server error'}); }
}).listen(Number(process.env.PORT || 3001), process.env.HOST || '127.0.0.1', () => console.log('Portfolio server ready'));
