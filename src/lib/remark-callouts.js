import { visit } from 'unist-util-visit';

/**
 * Remark plugin to transform Obsidian-style callouts into HTML
 * Transforms: > [!NOTE] Title
 * Into: <div class="callout callout-note">...</div>
 */
export function remarkCallouts() {
    return (tree) => {
        visit(tree, 'blockquote', (node, index, parent) => {
            // Check if first child is a paragraph
            if (!node.children || node.children.length === 0) return;

            const firstChild = node.children[0];
            if (firstChild.type !== 'paragraph') return;

            // Check if paragraph starts with callout syntax
            const firstNode = firstChild.children[0];
            if (!firstNode || firstNode.type !== 'text') return;

            const match = firstNode.value.match(/^\[!(\w+)\]\s*(.*)/);
            if (!match) return;

            const [, type, title] = match;
            const calloutType = type.toLowerCase();

            // Remove the callout syntax from the first text node
            firstNode.value = title;

            // If title is empty and it's the only child, remove it
            if (!title && firstChild.children.length === 1) {
                node.children.shift();
            }

            // Transform blockquote into callout div
            const calloutNode = {
                type: 'html',
                value: `<div class="callout callout-${calloutType}">
  <div class="callout-title">${title || type}</div>
  <div class="callout-content">`
            };

            const closeNode = {
                type: 'html',
                value: '</div></div>'
            };

            // Replace blockquote with callout wrapper
            parent.children.splice(index, 1, calloutNode, ...node.children, closeNode);
        });
    };
}
