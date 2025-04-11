import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

const octokit = new Octokit({ auth: process.env.TOKEN });

const org = 'Safe-QA';

// Get current date info
const today = new Date();
const currentMonthName = today.toLocaleString('default', { month: 'long' }); // e.g., April
const year = today.getFullYear();
const currentMonthIndex = today.getMonth(); // 0-based index

// Get the previous month's name and number of days
const prevMonthIndex = (currentMonthIndex - 1 + 12) % 12; // Handles January -> December wrap
const prevMonthName = new Date(year, prevMonthIndex).toLocaleString('default', { month: 'long' });

const daysInCurrentMonth = new Date(year, currentMonthIndex + 1, 0).getDate();
const daysInPreviousMonth = new Date(year, prevMonthIndex + 1, 0).getDate();

// Function to delete previous month's repos
async function deletePreviousMonthRepos() {
    for (let i = 1; i <= daysInPreviousMonth; i++) {
        const day = i.toString().padStart(2, '0');
        const repoName = `report_${prevMonthName}_${day}`;

        try {
            // Check if the repo exists first
            const repo = await octokit.request('GET /repos/{owner}/{repo}', {
                owner: org,
                repo: repoName
            });

            if (repo) {
                console.log(`🛠 Deleting repo: ${repoName}`);
                // Delete the repo
                await octokit.request('DELETE /repos/{owner}/{repo}', {
                    owner: org,
                    repo: repoName
                });
                console.log(`✅ Deleted: ${repoName}`);
            }
        } catch (error) {
            if (error.status === 404) {
                console.log(`❌ Repo ${repoName} not found`);
            } else {
                console.error(`❌ Error deleting ${repoName}:`, error);
            }
        }
    }
}

// Function to create current month's repos
async function createCurrentMonthRepos() {
    for (let i = 1; i <= daysInCurrentMonth; i++) {
        const day = i.toString().padStart(2, '0');
        const newRepo = `report_${currentMonthName}_${day}`;
        console.log(`🛠 Creating repo: ${newRepo}`);

        try {
            await octokit.request('POST /orgs/{org}/repos', {
                org: org,
                name: newRepo,
                description: 'Test Reports',
                homepage: 'https://github.com',
                private: false,
                has_issues: true,
                has_projects: true,
                has_wiki: true,
                auto_init: true,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            console.log(`✅ Created: ${newRepo}`);
        } catch (error) {
            if (error.response) {
                console.error(`❌ Error creating ${newRepo}: ${error.response.status} - ${error.response.data.message}`);
            } else {
                console.error(`❌ Unexpected error for ${newRepo}:`, error);
            }
        }
    }
}

// Main function to delete and create repos
(async () => {
    // Delete previous month's reports
    await deletePreviousMonthRepos();

    // Create current month's reports
    await createCurrentMonthRepos();
})();
