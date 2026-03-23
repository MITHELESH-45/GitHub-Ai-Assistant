import axios from 'axios';

// 🔥 Always read token dynamically (no top-level constant)
const getHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json'
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`; // ✅ FIXED
  }

  return headers;
};

// 1️⃣ Fetch repository metadata
export const fetchRepoMetadata = async (owner, repo) => {
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await axios.get(url, { headers: getHeaders() });
  return response.data;
};

// 2️⃣ Fetch contributors
export const fetchRepoContributors = async (owner, repo) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`;
    const response = await axios.get(url, { headers: getHeaders() });
    return response.data;
  } catch (err) {
    console.warn("Failed to fetch contributors:", err.message);
    return [];
  }
};

// 3️⃣ Fetch full file tree
export const fetchRepoTree = async (owner, repo, defaultBranch = 'main') => {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`;
  const response = await axios.get(url, { headers: getHeaders() });
  return response.data.tree;
};

// 4️⃣ Fetch file contents (RATE-LIMIT SAFE VERSION)
export const fetchFilesContent = async (files) => {
  const MAX_SIZE_BYTES = 10240; // 10KB
  const DELAY_MS = 200; // 🔥 prevent rate limit

  const results = [];

  console.log("Using token:", !!process.env.GITHUB_TOKEN);

  for (const file of files) {
    try {
      const response = await axios.get(file.url, { headers: getHeaders() });

      let content = '';

      if (response.data.encoding === 'base64') {
        content = Buffer.from(response.data.content, 'base64').toString('utf8');
      } else {
        content =
          typeof response.data === 'string'
            ? response.data
            : JSON.stringify(response.data);
      }

      // Trim large files
      if (content.length > MAX_SIZE_BYTES) {
        content =
          content.substring(0, MAX_SIZE_BYTES) +
          '\n\n...[TRUNCATED_DUE_TO_SIZE]...';
      }

      results.push({
        name: file.path.split('/').pop(),
        path: file.path,
        content
      });

      // 🔥 Delay to avoid GitHub rate limit
      await new Promise((res) => setTimeout(res, DELAY_MS));

    } catch (err) {
      console.warn(`Failed to fetch ${file.path}:`, err.message);

      results.push({
        name: file.path.split('/').pop(),
        path: file.path,
        error: "Failed to download file"
      });
    }
  }

  return results;
};