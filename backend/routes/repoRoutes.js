import express from 'express';
import { analyzeRepo, clearRepoData } from '../controllers/repoController.js';

const router = express.Router();

router.post('/analyze', analyzeRepo);
router.post('/clear', clearRepoData);

export default router;
