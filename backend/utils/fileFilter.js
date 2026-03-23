const EXCLUDED_DIRS = ['node_modules', 'build', 'dist', '.git', 'coverage', 'public', 'assets', 'images', 'vendor'];
const INCLUDED_EXTS = ['.js','.jsx','.tsx', '.ts', '.py', '.json', '.md','.css','.html','.java'];
const ALLOWED_FILENAMES = ['README.md', 'package.json'];

export const filterRelevantFiles = (treeFiles) => {
  return treeFiles.filter(file => {
    if (file.type !== 'blob') return false;

    const pathParts = file.path.split('/');
    const fileName = pathParts[pathParts.length - 1];

    const hasExcludedDir = pathParts.some(part => EXCLUDED_DIRS.includes(part));
    if (hasExcludedDir) return false;

    if (ALLOWED_FILENAMES.includes(fileName)) return true;

    const isIncludedExtension = INCLUDED_EXTS.some(ext => fileName.endsWith(ext));
    if (isIncludedExtension) {
      if (fileName.includes('.min.') || fileName.includes('lock') || fileName.endsWith('.map')) {
        return false;
      }
      return true;
    }

    return false;
  });
};
