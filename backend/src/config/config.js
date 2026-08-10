import dotenv from "dotenv"

dotenv.config()

const config={
    port:process.env.port||5000,
    githubToken:process.env.GITHUB_TOKEN
};
export default config;

