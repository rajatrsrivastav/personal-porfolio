// Use the original source to distinguish bare URLs from authored Markdown links.
export default function remarkStandaloneLinks() {
  return (tree, file) => {
    const source = String(file);
    const nodes = [tree];
    while (nodes.length) {
      const node = nodes.pop();
      if (node.type === 'paragraph' && node.children?.length === 1 && node.children[0].type === 'link') {
        const raw = source.slice(node.position.start.offset, node.position.end.offset).trim();
        if (/^https?:\/\/\S+$/i.test(raw) && node.children[0].url === raw) {
          node.data = { ...node.data, hProperties: { ...node.data?.hProperties, dataPreviewUrl: raw } };
        }
      }
      if (node.children) nodes.push(...node.children);
    }
  };
}
