import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { embeddings } from "./embedding.js";

let _vectorStore = null;

export const setVectorStore = (vs) => {
  _vectorStore = vs;
};

export const getVectorStore = () => _vectorStore;

export const clearVectorStore = () => {
  _vectorStore = null;
};

export const storeDocuments = async (documents) => {
  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    embeddings
  );
  setVectorStore(vectorStore);
  return vectorStore;
};