import express from "express"

import { getRepositoryTreeInfo ,getFileContentInfo,getRepositoryInfo,searchRepositoryInfo} from "../controllers/repositoryController.js";

const router=express.Router();

router.get("/:owner/:repo",getRepositoryInfo);

router.get("/:owner/:repo/tree",getRepositoryTreeInfo);

router.get("/:owner/:repo/file",getFileContentInfo);

router.get("/:owner/:repo/search",searchRepositoryInfo);
export default router;