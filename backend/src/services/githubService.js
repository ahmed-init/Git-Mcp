import config from "../config/config.js";

export async function getRepository(owner,repo)
{
    const response=await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        {
            headers:{
                Authorization:`Bearer ${config.githubToken}`,
                Accept:"application/vnd.github+json"
            }
        }
    );
    if(!response.ok){
        throw new Error(
             `GitHub API error: ${response.status} ${response.statusText}`
        );
    }
    const data = await response.json();

    return {
        name: data.name,
        description: data.description,
        owner: data.owner.login,
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        defaultBranch: data.default_branch,
        url: data.html_url
    };
}