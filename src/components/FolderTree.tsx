import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TreeNode } from '../lib/folder-tree';

interface FolderTreeProps {
    nodes: TreeNode[];
    level?: number;
}

export function FolderTree({ nodes, level = 0 }: FolderTreeProps) {
    return (
        <div className="folder-tree">
            {nodes.map((node) => (
                <TreeNodeComponent key={node.path} node={node} level={level} />
            ))}
        </div>
    );
}

interface TreeNodeComponentProps {
    node: TreeNode;
    level: number;
}

function TreeNodeComponent({ node, level }: TreeNodeComponentProps) {
    const [isExpanded, setIsExpanded] = useState(level === 0);

    if (node.type === 'note') {
        return (
            <Link
                to={`/note/${node.slug}`}
                className="tree-node tree-note"
                style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
            >
                <span className="tree-icon">📄</span>
                <span className="tree-label">{node.name}</span>
            </Link>
        );
    }

    const noteCount = countNotes(node);

    return (
        <div className="tree-folder">
            <button
                className="tree-node tree-folder-toggle"
                style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="tree-icon">{isExpanded ? '📂' : '📁'}</span>
                <span className="tree-label">{node.name}</span>
                <span className="tree-count">{noteCount}</span>
            </button>
            {isExpanded && node.children && (
                <FolderTree nodes={node.children} level={level + 1} />
            )}
        </div>
    );
}

function countNotes(node: TreeNode): number {
    if (node.type === 'note') return 1;
    if (!node.children) return 0;
    return node.children.reduce((sum, child) => sum + countNotes(child), 0);
}
