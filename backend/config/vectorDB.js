// src/config/vectorDB.js
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { embeddings } from "./embedding.js";

export const storeDocuments = async (documents) => {
  const vectorStore = await MemoryVectorStore.fromDocuments(
        documents,
        embeddings
  );

  return vectorStore;
};