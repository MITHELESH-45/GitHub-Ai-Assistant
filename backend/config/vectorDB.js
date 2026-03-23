// config/vectorDB.js
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { embeddings } from "./embedding.js";

// ---------------------------------------------------------------------------
// Singleton — holds the active MemoryVectorStore so it can be reused by Q&A
// without recomputing embeddings.
// ---------------------------------------------------------------------------
let _vectorStore = null;

/**
 * Called by repoController after ingestion to persist the store globally.
 */
export const setVectorStore = (vs) => {
  _vectorStore = vs;
};

/**
 * Called by qaController to retrieve the active store.
 * Returns null when no repository has been analyzed yet.
 */
export const getVectorStore = () => _vectorStore;

/**
 * Reset the store to null.
 */
export const clearVectorStore = () => {
  _vectorStore = null;
};

/**
 * Create a MemoryVectorStore from documents, store it globally, and return it.
 */
export const storeDocuments = async (documents) => {
  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    embeddings
  );
  setVectorStore(vectorStore);
  return vectorStore;
};