import { execSync } from 'child_process';
import * as path from 'path';

export async function updateRepo(files: string[], commitMessage: string) {
  const workspace = process.env.GITHUB_WORKSPACE || '.';
  const actor = process.env.GITHUB_ACTOR || 'github-actions';
  
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPOSITORY) {
    console.error("Missing GITHUB_TOKEN or GITHUB_REPOSITORY");
    return;
  }

  // Ensure GitHub CLI is authenticated using the GITHUB_TOKEN
  try {
    execSync(`gh auth login --with-token <<< "${process.env.GITHUB_TOKEN}"`);
  } catch (err) {
    console.error("Failed to authenticate with GitHub CLI", err);
    return;
  }

  // Add, commit, and push files
  try {
    files.forEach(file => {
      const relativePath = path.relative(workspace, file);
      execSync(`git add ${relativePath}`);
    });

    execSync(`git commit -m "${commitMessage}" --author "${actor} <${actor}@users.noreply.github.com>"`);
    execSync(`git push`);
  } catch (err) {
    console.error("Failed to commit or push changes", err);
  }
}
