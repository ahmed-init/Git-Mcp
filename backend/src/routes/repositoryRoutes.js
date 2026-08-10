import express from "express"
import { getRepository } from "../services/githubService.js"
import { getRepositoryInfo } from "../controllers/repositoryController.js";

const router=express.Router();

router.get("/:owner/:repo",getRepositoryInfo);

export default router;