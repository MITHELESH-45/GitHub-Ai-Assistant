import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const getHeaders = () => {
  const headers = { 
    Accept: 'application/vnd.github.v3+json' 
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `token ${GITHUB_TOKEN}`;
  }
  return headers;
};

// 1. Fetch metadata
export const fetchRepoMetadata = async (owner, repo) => {
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await axios.get(url, { headers: getHeaders() });
  return response.data;
};

// Fetch contributors explicitly
export const fetchRepoContributors = async (owner, repo) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`;
    const response = await axios.get(url, { headers: getHeaders() });
    return response.data;
  } catch {
    return [];
  }
};

// 2. Fetch File Structure using Git Trees API
export const fetchRepoTree = async (owner, repo, defaultBranch = 'main') => {
  // We use recursive=1 to get the full tree
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`;
  const response = await axios.get(url, { headers: getHeaders() });
  return response.data.tree;
};

// 3. Fetch File Content
export const fetchFilesContent = async (files) => {
  const MAX_SIZE_BYTES = 10240; // 10KB limit

  const filePromises = files.map(async (file) => {
    try {
      // Git Trees API returns a blob URL which has base64 encoded content
      const response = await axios.get(file.url, { headers: getHeaders() });
      
      let content = '';
      if (response.data.encoding === 'base64') {
        content = Buffer.from(response.data.content, 'base64').toString('utf8');
      } else {
        content = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      }

      // Trim large files
      if (content.length > MAX_SIZE_BYTES) {
        content = content.substring(0, MAX_SIZE_BYTES) + '\n\n...[TRUNCATED_DUE_TO_SIZE]...';
      }

      return {
        name: file.path.split('/').pop(),
        path: file.path,
        content: content
      };
    } catch (err) {
      console.warn(`Failed to fetch content for ${file.path}:`, err.message);
      return {
        name: file.path.split('/').pop(),
        path: file.path,
        error: "Failed to download file"
      };
    }
  });

  return await Promise.all(filePromises);
};
