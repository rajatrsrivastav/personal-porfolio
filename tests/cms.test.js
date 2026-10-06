import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
test('CMS sessions, lifecycle, validation and public isolation',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'cms-'));
 const server=spawn(process.execPath,['server/index.js'],{env:{...process.env,PORT:'31987',ADMIN_PASSKEY:'test-secret',POSTS_FILE:join(dir,'posts.json'),SITE_URL:'http://127.0.0.1:31987'}});
 try {
  const url='http://127.0.0.1:31987';
  for(let i=0;i<50;i++){try{await fetch(url+'/api/admin/verify');break;}catch{await delay(50);}}
  const request=(path,method='GET',body,cookie)=>fetch(url+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});
  assert.equal((await request('/api/admin/verify')).status,401);
  assert.equal((await request('/api/posts?all=true')).status,401);
  assert.equal((await request('/api/admin/login','POST',{passkey:'wrong'})).status,401);
  const login=await request('/api/admin/login','POST',{passkey:'test-secret'});
  const setCookie=login.headers.get('set-cookie');assert.match(setCookie,/HttpOnly/);assert.match(setCookie,/Max-Age=604800/);
  const cookie=setCookie.split(';')[0];assert.equal((await request('/api/admin/verify','GET',null,cookie)).status,200);
  assert.equal((await request('/api/admin/verify','GET',null,cookie+'tampered')).status,401);
  const post={title:'First',slug:'first',category:'Engineering',readTime:'5 min',excerpt:'Summary',content:'# Hello',status:'draft'};
  assert.equal((await request('/api/posts','POST',post)).status,401);
  const created=await request('/api/posts','POST',post,cookie);assert.equal(created.status,201);const record=await created.json();assert.ok(record.id);
  assert.equal((await request('/api/posts','POST',post,cookie)).status,409);
  assert.equal((await request('/api/posts')).status,200);assert.deepEqual(await (await request('/api/posts')).json(),[]);
  assert.equal((await request('/api/posts/'+record.id)).status,404);
  assert.equal((await (await request('/api/posts?all=true','GET',null,cookie)).json()).length,1);
  assert.equal((await request('/api/posts/'+record.id,'PATCH',{status:'published'},cookie)).status,200);
  assert.equal((await (await request('/api/posts')).json()).length,1);
  const updated=await (await request('/api/posts/'+record.id,'PATCH',{title:'Edited',slug:'edited',excerpt:'New summary'},cookie)).json();assert.equal(updated.content,'# Hello');assert.equal(updated.description,'New summary');assert.equal(updated.id,record.id);
  assert.equal((await request('/api/posts/'+record.id,'PATCH',{publishedAt:'invalid'},cookie)).status,400);
  await request('/api/posts/'+record.id,'PATCH',{publishedAt:'2099-01-01T00:00:00Z'},cookie);assert.deepEqual(await (await request('/api/posts')).json(),[]);
  await request('/api/posts/'+record.id,'PATCH',{status:'draft'},cookie);assert.deepEqual(await (await request('/api/posts')).json(),[]);
  assert.equal((await request('/api/posts/'+record.id,'DELETE',null,cookie)).status,200);
  assert.deepEqual(await (await request('/api/posts?all=true','GET',null,cookie)).json(),[]);
  const logout=await request('/api/admin/logout','POST',null,cookie);assert.match(logout.headers.get('set-cookie'),/Max-Age=0/);
 } finally {server.kill();await rm(dir,{recursive:true,force:true});}
});
