import * as fs from 'fs';
import * as path from 'path';
import { fetchCleanContent } from './fetcher';
import { compareJson } from './compare_json';
import { readUrlsFromCsv, saveJson, loadJson, sanitizeFilename, updateChangeLog } from './file_utils';
import { updateRepo } from './github_utils';

async function main() {
  const repoPath = process.env.GITHUB_WORKSPACE || '.';
  const csvFilePath = path.join(repoPath, 'urls.csv');
  const resultsDir = path.join(repoPath, 'results');

  // Ensure the results directory exists
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }

  const urls = await readUrlsFromCsv(csvFilePath);

  const filesToCommit: string[] = [];

  for (const url of urls) {
    const content = await fetchCleanContent(url);
    const jsonFilename = path.join(resultsDir, sanitizeFilename(url));
    const oldContent = loadJson(jsonFilename);

    if (oldContent) {
      const diff = compareJson(content, oldContent);
      if (diff && Object.keys(diff).length) {
        const changeLogFile = updateChangeLog(url, diff);
        saveJson(content, jsonFilename);
        filesToCommit.push(jsonFilename, changeLogFile);
      }
    } else {
      saveJson(content, jsonFilename);
      filesToCommit.push(jsonFilename);
    }
  }

  if (filesToCommit.length && process.env.GITHUB_TOKEN) {
    await updateRepo(filesToCommit, 'Update content and change log');
  } else {
    console.log("Changes detected, but not committing because GITHUB_TOKEN is not set or no changes were detected.");
  }
}

main().catch(console.error);
