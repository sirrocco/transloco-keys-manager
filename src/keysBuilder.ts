#!/usr/bin/env node

import { messages } from './messages';
import { countKeys } from './helpers/countKeys';
import { getLogger } from './helpers/logger';
import { resolveConfig } from './helpers/resolveConfig';
import { buildKeys } from './keysBuilder/buildKeys';
import { createTranslationFiles } from './keysBuilder/createTranslationFiles';
import { Config } from './types';

/** The main function, collects the settings and starts the files build. */
export async function buildTranslationFiles(inlineConfig: Config) {
  const logger = getLogger();
  const config = resolveConfig(inlineConfig);

  logger.log('\x1b[4m%s\x1b[0m', `\n${messages.startBuild(config.langs.length)} 👷🏗\n`);
  logger.startSpinner(`${messages.extract} 🗝`);

  const result = await buildKeys(config);
  const { keys, fileCount } = result;

  logger.success(`${messages.extract} 🗝`);

  let keysFound = 0;
  for(const [_, scopeKeys] of Object.entries(keys)) {
    keysFound += countKeys(scopeKeys as object);
  }

  logger.log('\x1b[34m%s\x1b[0m', 'ℹ', messages.keysFound(keysFound, fileCount));

  createTranslationFiles({
    keys,
    scopes: config.scopes,
    langs: config.langs,
    outputPath: `${process.cwd()}/${config.translationsPath}`,
    replace: config.replace
  });
}
