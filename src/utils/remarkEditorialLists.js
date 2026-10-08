// Normalize definition-style list punctuation without rewriting authored prose.
export default function remarkEditorialLists() {
  return (tree) => {
    const nodes = [tree];
    while (nodes.length) {
      const node = nodes.pop();
      if (node.type === 'listItem') {
        const paragraph = node.children?.[0];
        const [term, definition] = paragraph?.children || [];
        if (paragraph?.type === 'paragraph' && term?.type === 'strong' && definition?.type === 'text') {
          const text = definition.value.replace(/^\s*[:–—-]?\s*/u, '');
          if (text) definition.value = ` — ${text}`;
        }
      }
      if (node.children) nodes.push(...node.children);
    }
  };
}
