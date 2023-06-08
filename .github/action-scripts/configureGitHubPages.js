import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: process.env.TOKEN,
});
let filesChanged = []

try {
    const iterator = octokit.paginate.iterator("GET /repos/{owner}/{repo}/pulls/{pull_number}/files", {
        owner: "github",
        repo: "docs",
        pull_number: 22809,
        per_page: 100,
        headers: {
            "x-github-api-version": "2022-11-28",
        },
    });

    for await (const {data} of iterator) {
        filesChanged = [...filesChanged, ...data.map(fileData => fileData.filename)];
    }
} catch (error) {
    if (error.response) {
        console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
    }
    console.error(error)
}
