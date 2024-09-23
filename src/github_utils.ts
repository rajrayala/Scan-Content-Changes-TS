import * as fs from 'fs';
import * as path from 'path';

export async function updateRepo(files: string[], commitMessage: string) {
  const { Octokit } = await import('@octokit/rest');

  const token = process.env.GITHUB_TOKEN;
  const repoName = process.env.GITHUB_REPOSITORY;
  const workspace = process.env.GITHUB_WORKSPACE || '.';

  if (!token || !repoName) {
    console.error("Missing required environment variables.");
    return;
  }

  const octokit = new Octokit({ auth: token });
  const [owner, name] = repoName.split('/');

  const { data: repo } = await octokit.repos.get({ owner, repo: name });
  const defaultBranch = repo.default_branch;

  const { data: { sha: latestCommitSha } } = await octokit.repos.getCommit({ owner, repo: name, ref: defaultBranch });
  const { data: { tree: baseTree } } = await octokit.git.getCommit({ owner, repo: name, commit_sha: latestCommitSha });

  const elements = await Promise.all(files.map(async (file) => {
    const content = fs.readFileSync(file, 'utf-8');
    const { data: { sha: blobSha } } = await octokit.git.createBlob({ owner, repo: name, content, encoding: 'utf-8' });
    
    // Specify types explicitly for mode and type
    return {
      path: path.relative(workspace, file),
      mode: '100644' as const, // Ensure it's a literal type
      type: 'blob' as const,   // Ensure it's a literal type
      sha: blobSha,
    } as const; // Ensure the entire object is treated as a constant
  }));

  // Create a new tree
  const { data: { sha: newTreeSha } } = await octokit.git.createTree({
    owner,
    repo: name,
    base_tree: baseTree.sha,
    tree: elements,
  });

  const author = {
    name: process.env.GITHUB_ACTOR || 'github-actions',
    email: `${process.env.GITHUB_ACTOR}@users.noreply.github.com`,
  };

  const { data: { sha: newCommitSha } } = await octokit.git.createCommit({
    owner,
    repo: name,
    message: commitMessage,
    tree: newTreeSha,
    parents: [latestCommitSha],
    author,
  });

  await octokit.git.updateRef({ owner, repo: name, ref: `heads/${defaultBranch}`, sha: newCommitSha });
}
