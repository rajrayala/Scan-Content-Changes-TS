import * as fs from 'fs';
import csv from 'csv-parser';

export async function readUrlsFromCsv(csvFilePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const urls: string[] = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row: any) => {
        urls.push(row.url);
      })
      .on('end', () => resolve(urls))
      .on('error', reject);
  });
}

export function saveJson(content: any, filename: string) {
  fs.writeFileSync(filename, JSON.stringify(content, null, 4));
}

export function loadJson(filename: string): any | null {
  if (fs.existsSync(filename)) {
    const content = fs.readFileSync(filename, 'utf8');
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error decoding JSON from file ${filename}`);
      return null;
    }
  }
  return null;
}

export function sanitizeFilename(url: string): string {
  return url.replace(/[\\/*?:"<>|]/g, "_") + '.json';
}

export function updateChangeLog(url: string, changes: any) {
  const changeLogFile = 'change_log.json';
  let changeLog: any[] = [];

  if (fs.existsSync(changeLogFile)) {
    const content = fs.readFileSync(changeLogFile, 'utf8');
    try {
      changeLog = JSON.parse(content);
    } catch (error) {
      changeLog = [];
    }
  }

  const changeEntry = {
    url,
    changes,
    timestamp: new Date().toISOString()
  };

  changeLog.push(changeEntry);

  fs.writeFileSync(changeLogFile, JSON.stringify(changeLog, null, 4));
  return changeLogFile;
}
