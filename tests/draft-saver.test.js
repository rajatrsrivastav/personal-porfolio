import test from 'node:test';
import assert from 'node:assert/strict';
import { createDraftSaver } from '../src/utils/draftSaver.js';

test('autosaves reuse the created ID and publish after pending saves', async () => {
  const calls=[]; let release;
  const pending=new Promise(resolve=>{release=resolve;});
  const saver=createDraftSaver({request:async(path,options)=>{
    const body=JSON.parse(options.body); calls.push({path,method:options.method,body});
    if(calls.length===1)await pending;
    return {...body,id:'created-post'};
  },onSaved:()=>{}});
  const first=saver.save({title:'First'});
  const second=saver.save({title:'Latest'});
  const publish=saver.save({title:'Latest'},true);
  await Promise.resolve();assert.equal(calls.length,1);release();
  await Promise.all([first,second,publish]);
  assert.deepEqual(calls.map(c=>c.method),['POST','PATCH','PATCH']);
  assert.deepEqual(calls.map(c=>c.body.status),['draft','draft','published']);
  assert.equal(calls[1].path,'/api/posts/created-post');assert.equal(calls[1].body.title,'Latest');
});

test('published writing autosaves privately until explicit publication', async () => {
  const calls=[];
  const saver=createDraftSaver({id:'public-post',published:true,request:async(path,options)=>{
    const body=JSON.parse(options.body);calls.push(body);return {id:'public-post',status:'published'};
  },onSaved:()=>{}});
  await saver.save({title:'New revision'});await saver.save({title:'Approved revision'},true);
  assert.deepEqual(calls[0],{draft:{title:'New revision'}});
  assert.equal(calls[1].status,'published');assert.equal(calls[1].title,'Approved revision');
});

test('a failed save does not prevent later retries', async () => {
  let attempts=0, saved=0;
  const saver=createDraftSaver({request:async()=>{if(++attempts===1)throw new Error('offline');return {id:'retry'};},onSaved:()=>saved++});
  await assert.rejects(saver.save({title:'Draft'}),/offline/);
  await saver.save({title:'Recovered'});assert.equal(saved,1);
});
