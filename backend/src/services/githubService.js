import config from "../config/config.js";


export async function getRepository(owner, repo) {

    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        {
            headers: {
                Authorization: `Bearer ${config.githubToken}`,
                Accept: "application/vnd.github+json"
            }
        }
    );

    if (!response.ok) {
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


export async function getRepositoryTree(owner, repo, branch) {

    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        {
            headers: {
               // Authorization: `Bearer ${config.githubToken}`,
                Accept: "application/vnd.github+json"
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            `GitHub API error: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json();

    return data.tree.map((item) => ({
        path: item.path,
        type: item.type
    }));
}


export async function getFileContent(owner, repo, path, branch) {

    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
            headers: {
               //Authorization: `Bearer ${config.githubToken}`,
                Accept: "application/vnd.github+json"
            }
        }
    );

    console.log("File API status:", response.status);

    if (!response.ok) {

        const errorData = await response.text();

        console.log("GitHub error response:", errorData);

        throw new Error(
            `GitHub API error: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json();

    if (Array.isArray(data)) {
        throw new Error(
            `The requested path "${path}" is a directory, not a file`
        );
    }

    if (data.type !== "file") {
        throw new Error(
            `GitHub returned type: ${data.type}`
        );
    }

    const content = Buffer.from(
        data.content,
        "base64"
    ).toString("utf-8");

    return {
        path: data.path,
        size: data.size,
        content
    };
}

export async function searchRepository(owner,repo,query,branch)
{
    const tree=await getRepositoryTree(
        owner,
        repo,
        branch
    );


    const searchTerm=query.trim().toLowerCase();
    const results=tree.filter((item)=>{
        const path=item.path.toLowerCase();
        return path.includes(searchTerm);
    });
    console.log("Search results:",results);
    return results;
}