import express from "express"
import { getRepository } from "./services/githubService.js";
import repositoryRoutes from "./routes/repositoryRoutes.js";

const app =express();
app.use(express.json())

app.get("/api/health",(req,res)=>{
    res.status(200).json({
        status:"ok",
        message:"Github ai assistant backend is running"
    });
});

app.use("/api/repository",repositoryRoutes);
export default app;