// One queue per editor: creation, autosaves and publishing never overlap.
export function createDraftSaver({ id = null, published = false, request, onSaved }) {
  let postId = id;
  let queue = Promise.resolve();
  return {
    save(form, publish = false) {
      const snapshot = { ...form };
      const operation = queue.then(async () => {
        const payload = publish
          ? { ...snapshot, status: 'published' }
          : published ? { draft: snapshot } : { ...snapshot, status: 'draft' };
        const record = await request(postId ? `/api/posts/${encodeURIComponent(postId)}` : '/api/posts', {
          method: postId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        postId = record.id;
        if (publish) published = true;
        onSaved(record, snapshot, publish);
        return record;
      });
      queue = operation.catch(() => {});
      return operation;
    },
  };
}
