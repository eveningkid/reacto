import Finder from './finder';
import currentFilePlugin from './plugins/current-file';
import fileTreePlugin from './plugins/file-tree';
import openedFilesPlugin from './plugins/opened-files';

const finder = new Finder()
  .addPlugin(currentFilePlugin)
  .addPlugin(fileTreePlugin)
  .addPlugin(openedFilesPlugin);

export default finder;
