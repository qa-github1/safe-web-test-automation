import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const octokit = new Octokit({ auth: process.env.TOKEN });

const org = 'Safe-QA';

// Get current date info
const today = new Date();
const currentMonthName = today.toLocaleString('default', { month: 'long' }); // e.g., April
const year = today.getFullYear();
const currentMonthIndex = today.getMonth(); // 0-based index
const day = today.getDate().toString().padStart(2, '0'); // Current day of the month

const repoName = `report_${currentMonthName}_${day}`;

async function cleanupGhPagesBranch() {
    try {
        // Check if the repo exists first
        const repo = await octokit.request('GET /repos/{owner}/{repo}', {
            owner: org,
            repo: repoName
        });

        if (repo) {
            console.log(`🛠 Found repo: ${repoName}`);

            // Clone the repository to clean the gh-pages branch
            const cloneUrl = `https://github.com/${org}/${repoName}.git`;
            const localRepoDir = path.join(__dirname, repoName);

            exec(`git clone ${cloneUrl} ${localRepoDir}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error cloning repository: ${error}`);
                    return;
                }

                console.log(stdout);
                console.log(`Cloned repository ${repoName}`);

                // Change directory to the cloned repo
                process.chdir(localRepoDir);

                // Checkout gh-pages branch
                exec('git checkout gh-pages', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error checking out gh-pages branch: ${error}`);
                        return;
                    }

                    console.log(stdout);

                    // Remove all files in the gh-pages branch
                    exec('rm -rf *', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Error removing files: ${error}`);
                            return;
                        }

                        console.log(stdout);
                        console.log(`✅ Removed all content from gh-pages in ${repoName}`);

                        // Commit the changes
                        exec('git commit -am "Delete all content from gh-pages branch"', (error, stdout, stderr) => {
                            if (error) {
                                console.error(`Error committing changes: ${error}`);
                                return;
                            }

                            console.log(stdout);

                            // Push the changes to the gh-pages branch
                            exec('git push origin gh-pages', (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`Error pushing to gh-pages: ${error}`);
                                    return;
                                }

                                console.log(stdout);
                                console.log(`✅ Content deleted from gh-pages branch for repo: ${repoName}`);
                            });
                        });
                    });
                });
            });
        }
    } catch (error) {
        if (error.status === 404) {
            console.log(`❌ Repo ${repoName} not found`);
        } else {
            console.error(`❌ Error cleaning up gh-pages for ${repoName}:`, error);
        }
    }
}

// Main function to clean up the gh-pages branch
(async () => {
    // Clean up the gh-pages branch of the current day's report
    await cleanupGhPagesBranch();
})();
