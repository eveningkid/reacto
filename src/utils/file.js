import fileExtension from 'file-extension';
const javascriptFilesExtensions = ['js', 'jsx', 'ts', 'tsx'];

/**
 * Guess which coding language given a filepath
 * (regarding its file extension).
 *
 * @param {string} filePath
 * @return {string} language
 */
function whichLanguage(filePath) {
  const extension = fileExtension(filePath);

  switch (extension) {
    case 'html':
      return 'htmlmixed';

    case 'md':
      return 'markdown';

    case 'css':
      return 'css';

    case 'sass':
    case 'scss':
      return 'text/x-scss';

    case 'ts':
    case 'tsx':
      return 'text/typescript';

    case 'js':
    case 'jsx':
      return 'jsx';

    case 'json':
      return 'javascript';

    default:
      return extension;
  }
}

/**
 * Guess if the given filename is a Javascript file
 *
 * @param {string} filename
 * @return {boolean}
 */
function isJavascript(filename) {
  const extension = fileExtension(filename);
  return javascriptFilesExtensions.includes(extension);
}

export const file = {
  whichLanguage,
  isJavascript,
};
