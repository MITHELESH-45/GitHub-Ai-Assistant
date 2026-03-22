/**
 * Splits text into smaller overlapping chunks for embedding/RAG pipelines.
 * 
 * @param {string} text - The input text to chunk.
 * @param {number} chunkSize - Maximum size of each chunk.
 * @param {number} overlap - Overlap size between sequential chunks.
 * @returns {string[]} Array of chunked text strings.
 */
export const chunkText = (text, chunkSize = 500, overlap = 100) => {
  if (!text || typeof text !== 'string') return [];
  if (text.length <= chunkSize) return [text];

  const chunks = [];
  // Ensure the step is always at least 1 to avoid infinite loops if overlap >= chunkSize
  const step = Math.max(chunkSize - overlap, 1);

  for (let i = 0; i < text.length; i += step) {
    const chunk = text.slice(i, i + chunkSize);
    chunks.push(chunk);
    
    // Break early if this chunk reaches the end of the text
    if (i + chunkSize >= text.length) {
      break;
    }
  }

  return chunks;
};
