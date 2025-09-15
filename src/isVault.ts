import fso from '@ppmdev/modules/filesystem.ts';

const OBSIDIAN_DIR = '.obsidian';

const main = (): number => {
  const path = PPx.Arguments.Item(-1) || PPx.Extract('%FD')

  return vaultRoot(path);
};

/**
 * Get the root path of the Obsidian vault.
 * @param path Specify the path to check
 * @return Obsidian vault root path
 */
const vaultRoot = (path = ''): number => {
  let vault: string;

  do {
    vault = fso.BuildPath(path, OBSIDIAN_DIR);

    if (fso.FolderExists(vault)) {
      return 1;
    }

    path = fso.GetParentFolderName(path);
  } while (path);

  return 0;
};

PPx.result = main();
