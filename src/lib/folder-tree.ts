import { vaultIndex } from './data';

export interface TreeNode {
    name: string;
    path: string;
    type: 'folder' | 'note';
    children?: TreeNode[];
    slug?: string;
}

export function buildFolderTree(): TreeNode[] {
    const root: TreeNode[] = [];
    const folderMap = new Map<string, TreeNode>();

    // Sort notes by path for consistent ordering
    const sortedNotes = [...vaultIndex.notes].sort((a, b) => a.path.localeCompare(b.path));

    sortedNotes.forEach((note) => {
        const parts = note.path.split('/');
        let currentPath = '';
        let currentLevel = root;

        // Build folder hierarchy
        for (let i = 0; i < parts.length - 1; i++) {
            const folderName = parts[i];
            currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;

            let folder = folderMap.get(currentPath);
            if (!folder) {
                folder = {
                    name: folderName,
                    path: currentPath,
                    type: 'folder',
                    children: []
                };
                folderMap.set(currentPath, folder);
                currentLevel.push(folder);
            }

            currentLevel = folder.children!;
        }

        // Add the note
        currentLevel.push({
            name: note.title,
            path: note.path,
            type: 'note',
            slug: note.slug
        });
    });

    return root;
}
