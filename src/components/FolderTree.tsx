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
    const [isExpanded, setIsExpanded] = useState(false);

    if (node.type === 'note') {
        return (
            <li className={`tree-item ${level === 0 ? 'mb-1' : ''} ${isLast ? 'tree-item-last' : ''}`}>
                <Link to={`/note/${node.slug}`} className="tree-link">
                    {node.name}
                </Link>
            </li>
        );
    }

    const noteCount = countNotes(node);

    return (
        <li className={`tree-item ${level === 0 ? 'mb-1' : ''} ${isLast ? 'tree-item-last' : ''}`}>
            <button
                className="tree-folder-btn"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className={`tree-arrow ${isExpanded ? 'is-open' : ''}`} />
                <span className="tree-folder-name">{node.name}</span>
                <span className="tree-count">{noteCount}</span>
            </button>
            <div className={`tree-children ${isExpanded ? 'is-visible' : ''}`}>
                {node.children && <FolderTree nodes={node.children} level={level + 1} />}
            </div>
        </li>
    );
}

function countNotes(node: TreeNode): number {
    if (node.type === 'note') return 1;
    if (!node.children) return 0;
    return node.children.reduce((sum, child) => sum + countNotes(child), 0);
}
