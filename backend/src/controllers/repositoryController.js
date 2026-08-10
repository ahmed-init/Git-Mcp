
import {
    getRepository,
    getRepositoryTree,
    getFileContent,
    searchRepository
} from "../services/githubService.js";
export async function getRepositoryInfo(req,res){
    try{
        const{owner,repo}=req.params;
        const repository =await getRepository(owner,repo);

        res.json(
            {
                success:true,
                data:repository
            }
        );
    }
    catch(error){
        console.error(error.message);

        res.status(500).json(
            {
               success:false,
               error:{
                message:error.message
               } 
            }
        );
    }
}
export async function getRepositoryTreeInfo(req,res)
{
    try{
    const{owner,repo}=req.params;
    const branch=req.query.branch||"main";

    const tree =await getRepositoryTree(
        owner,
        repo,
        branch
    );

    res.json(
        {
            success:true,
            data:{
                owner,
                repo,
                branch,
                files:tree
            }
        }
    );
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({
            success: false,
            error: {
                message: error.message
            }
        });
    }

}

export async function getFileContentInfo(req,res)
{
    try{
        const{owner,repo}=req.params;
        const { path, branch = "main" } = req.query;
        if (!path) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "File path is required"
                }
            });
        }

        const file = await getFileContent(
            owner,
            repo,
            path,
            branch
        );

        res.json({
            success: true,
            data: file
        });
    }
    catch (error) {
        console.error(error.message);

        res.status(500).json({
            success: false,
            error: {
                message: error.message
            }
        });
    }
}

export async function searchRepositoryInfo(req,res)
{
    try{
        const{owner,repo}=req.params;

        const{query}=req.query;

        const branch=req.query.branch||"main";

        if(!query){
            return res.status(400).json(
                {
                    sucess:false,
                    error:{
                        message:"Search query is required"
                    }
                }
            )
        };
        const results=await searchRepository(owner,repo,query,branch);
        res.json({
            success: true,
            data: {
                query,
                branch,
                results
            }
        });
    }
    catch (error) {

        console.error(error.message);

        res.status(500).json({
            success: false,
            error: {
                message: error.message
            }
        });    
}
}