import { parseGithubUrl } from '../utils/githubParser.js';
import { fetchRepoMetadata, fetchRepoTree, fetchFilesContent, fetchRepoContributors } from '../services/githubService.js';
import { filterRelevantFiles } from '../utils/fileFilter.js';
import { Document } from "@langchain/core/documents";
import { splitter } from "../config/textSplitter.js";
import { storeDocuments } from "../config/vectorDB.js";

export const analyzeRepo = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'GitHub URL is required' });
    }

    const repoInfo = parseGithubUrl(url);
    if (!repoInfo) {
      return res.status(400).json({ success: false, error: 'Invalid GitHub repository URL' });
    }

    const { owner, repo } = repoInfo;

    const metadata = await fetchRepoMetadata(owner, repo);

    const contributors = await fetchRepoContributors(owner, repo);

    const tree = await fetchRepoTree(owner, repo, metadata.default_branch);

    // Filter out irrelevant files
    const relevantFiles = filterRelevantFiles(tree);

    // Limit to max 20 files
    const filesToFetch = relevantFiles.slice(0, 10);

    const filesData = await fetchFilesContent(filesToFetch);

    const docs = filesData
      .filter(file => file.content && !file.error)
      .map(file => new Document({
        pageContent: String(file.content),
        metadata: {
          fileName: file.name,
          path: file.path,
          type: file.name.split('.').pop()
        }
      }));

    const splitDocs = await splitter.splitDocuments(docs);
    const vectorStore = await storeDocuments(splitDocs);

    const responseData = {
      success: true,
      metadata: {
        name: metadata.name,
        description: metadata.description || 'No description provided.',
        stars: metadata.stargazers_count,
        forks: metadata.forks_count,
        watchers: metadata.watchers_count,
        issues: metadata.open_issues_count,
        contributors: contributors.length,
        defaultBranch: metadata.default_branch
      },
      files: filesData,
      chunks: splitDocs
    };

    return res.json(responseData);
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ success: false, error: 'Repository not found on GitHub.' });
      }
      if (error.response.status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
        return res.status(429).json({ success: false, error: 'GitHub API rate limit exceeded.' });
      }
    }

    return res.status(500).json({ success: false, error: 'Failed to analyze repository. ' + error.message });
  }
};

export const clearRepoData = async (req, res) => {
  try {
    const { clearVectorStore } = await import('../config/vectorDB.js');
    clearVectorStore();
    return res.json({ success: true, message: 'Vector store cleared' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to clear vector store: ' + error.message });
  }
};
