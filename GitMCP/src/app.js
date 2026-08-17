import express from "express"
import repositoryRoutes from "./routes/repositoryRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app =express();
app.use(express.json())

app.get("/api/health",(req,res)=>{
    res.status(200).json({
        status:"ok",
        message:"Github ai assistant backend is running"
    });
});
app.use(express.static("public"));

app.use("/api/repository",repositoryRoutes);
app.use("/api",chatRoutes);

export default app;