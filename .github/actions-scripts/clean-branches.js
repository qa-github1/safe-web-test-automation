import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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

async function cleanupBranch(branchName) {
    try {
        // Check if the repo exists
        const repo = await octokit.request('GET /repos/{owner}/{repo}', {
            owner: org,
            repo: repoName
        });

        if (repo) {
            console.log(`🛠 Found repo: ${repoName}`);

            const localRepoDir = path.join(__dirname, repoName);

            // Clean up existing local directory if exists
            if (fs.existsSync(localRepoDir)) {
                console.log(`❌ Directory ${localRepoDir} already exists. Removing it...`);
                fs.rmSync(localRepoDir, { recursive: true, force: true });
                console.log(`✅ Removed existing directory: ${localRepoDir}`);
            }

            const cloneUrl = `https://github.com/${org}/${repoName}.git`;

            exec(`git clone ${cloneUrl} ${localRepoDir}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error cloning repository: ${error}`);
                    return;
                }

                console.log(stdout);
                console.log(`Cloned repository ${repoName}`);

                process.chdir(localRepoDir);

                // Checkout the desired branch
                exec(`git checkout ${branchName}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error checking out ${branchName} branch: ${error}`);
                        return;
                    }

                    console.log(stdout);

                    // Remove all files in the branch
                    exec('rm -rf *', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Error removing files from ${branchName}: ${error}`);
                            return;
                        }

                        console.log(stdout);
                        console.log(`✅ Removed all content from ${branchName} in ${repoName}`);

                        // Create a placeholder file (optional for main, necessary for gh-pages)
                        const placeholderContent = `<!DOCTYPE html><html><head><title>Cleaned</title></head><body><h1>Branch '${branchName}' cleaned</h1></body></html>`;
                        fs.writeFileSync('index.html', placeholderContent);

                        // Stage files
                        exec('git add .', (error, stdout, stderr) => {
                            if (error) {
                                console.error(`Error adding files: ${error}`);
                                return;
                            }

                            // Commit changes
                            exec('git commit -m "Clean branch and add placeholder index.html"', (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`Error committing changes to ${branchName}: ${error}`);
                                    return;
                                }

                                console.log(stdout);

                                // Push changes
                                exec(`git push origin ${branchName} --force`, (error, stdout, stderr) => {
                                    if (error) {
                                        console.error(`Error pushing to ${branchName}: ${error}`);
                                        return;
                                    }

                                    console.log(stdout);
                                    console.log(`✅ ${branchName} branch cleaned and updated for repo: ${repoName}`);
                                });
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
            console.error(`❌ Error cleaning up ${branchName} for ${repoName}:`, error);
        }
    }
}

// Main function to clean up both branches
(async () => {
    await cleanupBranch('gh-pages');
    await cleanupBranch('main');
})();
