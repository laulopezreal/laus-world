import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TreeNode } from '../lib/folder-tree';

interface FolderTreeProps {
    nodes: TreeNode[];
    level?: number;
}

export function FolderTree({ nodes, level = 0 }: FolderTreeProps) {
    return (
        <ul className={`tree-list ${level === 0 ? 'tree-root' : ''}`}>
            {nodes.map((node, index) => (
                <TreeNodeComponent
                    key={node.path}
                    node={node}
                    level={level}
                    isLast={index === nodes.length - 1}
                />
            ))}
        </ul>
    );
}

interface TreeNodeComponentProps {
    node: TreeNode;
    level: number;
    isLast: boolean;
}

function TreeNodeComponent({ node, level, isLast }: TreeNodeComponentProps) {
    const [isExpanded, setIsExpanded] = useState(level === 0);

    if (node.type === 'note') {
        return (
            <li className={`tree-item ${isLast ? 'tree-item-last' : ''}`}>
                <Link to={`/note/${node.slug}`} className="tree-link">
                    <span className="tree-line" />
                    <span className="tree-content">
                        <span className="tree-text">{node.name}</span>
                    </span>
                </Link>
            </li>
        );
    }

    const noteCount = countNotes(node);

    return (
        <li className={`tree-item tree-branch ${isLast ? 'tree-item-last' : ''} ${isExpanded ? 'tree-expanded' : ''}`}>
            <button
                className="tree-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="tree-line" />
                <span className="tree-content">
                    <span className="tree-chevron">{isExpanded ? '▼' : '▶'}</span>
                    <span className="tree-text">{node.name}</span>
                    <span className="tree-badge">{noteCount}</span>
                </span>
            </button>
            {isExpanded && node.children && (
                <FolderTree nodes={node.children} level={level + 1} />
            )}
        </li>
    );
}

function countNotes(node: TreeNode): number {
    if (node.type === 'note') return 1;
    if (!node.children) return 0;
    return node.children.reduce((sum, child) => sum + countNotes(child), 0);
}
