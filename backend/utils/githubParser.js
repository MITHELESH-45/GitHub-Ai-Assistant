export const parseGithubUrl = (url) => {
  try {
    const regex = /github\.com\/([^/]+)\/([^/]+)/i;
    const match = url.match(regex);
    
    if (match && match.length >= 3) {
      let repo = match[2];
      repo = repo.replace(/\.git$/i, '').split(/[?#]/)[0];
      return { owner: match[1], repo };
    }
    return null;
  } catch (err) {
    return null;
  }
};
