
import {getRepository} from "../services/githubService.js";

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