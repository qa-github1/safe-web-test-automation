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
const day = today.getDate().toString().padStart(2, '0'); // Current day of the month

const repoName = `report_${currentMonthName}_${day}`;

async function cleanupBranch(branchName) {
    try {
        // Check if the repo exists first
        const repo = await octokit.request('GET /repos/{owner}/{repo}', {
            owner: org,
            repo: repoName
        });

        if (repo) {
            console.log(`🛠 Found repo: ${repoName}`);

            const localRepoDir = path.join(__dirname, repoName);

            // Remove existing local repo dir if it exists
            if (fs.existsSync(localRepoDir)) {
                console.log(`❌ Directory ${localRepoDir} already exists. Removing it...`);
                fs.rmSync(localRepoDir, { recursive: true, force: true });
                console.log(`✅ Removed existing directory: ${localRepoDir}`);
            }

            // Clone the repo
            const cloneUrl = `https://github.com/${org}/${repoName}.git`;

            exec(`git clone ${cloneUrl} ${localRepoDir}`, (cloneErr, cloneOut) => {
                if (cloneErr) {
                    console.error(`❌ Error cloning repository: ${cloneErr}`);
                    return;
                }

                console.log(cloneOut);
                console.log(`📥 Cloned repository ${repoName}`);

                // Change into repo dir
                process.chdir(localRepoDir);

                // Checkout the branch
                exec(`git checkout ${branchName}`, (checkoutErr, checkoutOut) => {
                    if (checkoutErr) {
                        console.error(`❌ Error checking out ${branchName} branch: ${checkoutErr}`);
                        return;
                    }

                    console.log(checkoutOut);

                    // Delete all tracked and untracked files
                    exec('git rm -r --cached . && rm -rf *', (rmErr, rmOut) => {
                        if (rmErr) {
                            console.error(`❌ Error removing files: ${rmErr}`);
                            return;
                        }

                        console.log(rmOut);
                        console.log(`🧹 Files removed from ${branchName}`);

                        // Stage deletions
                        exec('git add -A', (addErr, addOut) => {
                            if (addErr) {
                                console.error(`❌ Error staging deletions: ${addErr}`);
                                return;
                            }

                            console.log(addOut);

                            // Commit changes
                            exec(`git commit -m "Clean ${branchName} content for fresh deploy"`, (commitErr, commitOut) => {
                                if (commitErr) {
                                    console.error(`❌ Error committing changes: ${commitErr}`);
                                    return;
                                }

                                console.log(commitOut);

                                // Push the changes
                                exec(`git push origin ${branchName}`, (pushErr, pushOut) => {
                                    if (pushErr) {
                                        console.error(`❌ Error pushing to ${branchName}: ${pushErr}`);
                                        return;
                                    }

                                    console.log(pushOut);
                                    console.log(`✅ Successfully cleaned ${branchName} in ${repoName}`);
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

// Clean both gh-pages and main
(async () => {
    await cleanupBranch('gh-pages');
    await cleanupBranch('main');
})();
