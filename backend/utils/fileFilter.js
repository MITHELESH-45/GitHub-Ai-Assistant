const EXCLUDED_DIRS = ['node_modules', 'build', 'dist', '.git', 'coverage', 'public', 'assets', 'images', 'vendor'];
const INCLUDED_EXTS = ['.js','.jsx','.tsx', '.ts', '.py', '.json', '.md','.css','.html','.java'];
const ALLOWED_FILENAMES = ['README.md', 'package.json'];

export const filterRelevantFiles = (treeFiles) => {
  return treeFiles.filter(file => {
    // Only process actual files (blobs), ignore directories (trees)
    if (file.type !== 'blob') return false;

    const pathParts = file.path.split('/');
    const fileName = pathParts[pathParts.length - 1];

    // Check excluded directories anywhere in the path
    const hasExcludedDir = pathParts.some(part => EXCLUDED_DIRS.includes(part));
    if (hasExcludedDir) return false;

    // Direct filename inclusion
    if (ALLOWED_FILENAMES.includes(fileName)) return true;

    // Extension inclusion
    const isIncludedExtension = INCLUDED_EXTS.some(ext => fileName.endsWith(ext));
    if (isIncludedExtension) {
      // Avoid minified files, lock files, and sourcemaps
      if (fileName.includes('.min.') || fileName.includes('lock') || fileName.endsWith('.map')) {
        return false;
      }
      return true;
    }

    return false;
  });
};
