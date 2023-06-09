import {Octokit} from "@octokit/rest";

// const octokit = new Octokit({
//     auth: process.env.TOKEN,
// });


const octokit = new Octokit({
    auth: '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'
})

//const owner = 'qa-github1'
const owner = 'Safe-QA'
const repo = 'safe-web-test-automation'
const env = 'github-pages'
const dateAndTime = new Date();
const currentDayInMonth = new Date().getDate().toLocaleString();
let newRepo = 'repo_' + currentDayInMonth
const newBranch = 'branch_' + dateAndTime.toLocaleString().replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, "_").replace(/ /g, "_").slice(0, -13)
//const newRepo = 'repo_' + dateAndTime.toLocaleString().replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g,"_").replace(/ /g,"_").slice(0, -13)
const source = {
    branch: newBranch,
    path: '/'
}

try {


    //// delete all repositories
    // for (let i = 1; i < 32; i++) {
    //     let month = i < 10 ? '0' + i : i;
    //  //   newRepo = 'report_June_' + month
    //     await octokit.request('DELETE /repos/{owner}/{repo}', {
    //         owner: 'Safe-QA',
    //         repo:  'report_June_' + month,
    //         headers: {
    //             'X-GitHub-Api-Version': '2022-11-28'
    //         }
    //     })
    // }


    for (let i = 1; i<32; i++){
        let  month = i < 10? '0' + i : i;
        newRepo = 'report_June_' + month

        // make 31 repositories -- 1 repo for each day in the month
        await octokit.request('POST /orgs/{org}/repos', {
            org: 'Safe-QA',
            name: newRepo,
            description: 'Test Reports ',
            homepage: 'https://github.com',
            'private': false,
            has_issues: true,
            has_projects: true,
            has_wiki: true,
            auto_init: true,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })

        // enable GItHub pages on all newly created repositories
          await octokit.request('POST /repos/{owner}/{repo}/pages', {
              owner,
              repo : newRepo,
              source: {
                  branch: 'main',
                  path: '/'
              },
              headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
              }
          })
    }



    //// list commits
    // const response = await octokit.rest.repos.listCommits({
    //      owner,
    //      repo : newRepo,
    //  });

    //// make a new branch
    // const response =
    //       await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
    //           owner,
    //           repo : newRepo,
    //           ref: 'refs/heads/' + newBranch,
    //           sha: response.data[0].sha,
    //           headers: {
    //               'X-GitHub-Api-Version': '2022-11-28'
    //           }
    //       })
    //
    //   await octokit.request('POST /repos/{owner}/{repo}/pages', {
    //       owner,
    //       repo : newRepo,
    //       source: source,
    //       headers: {
    //           'X-GitHub-Api-Version': '2022-11-28'
    //       }
    //   })

    // changes the settings for gitHUb pages to point to a newly created branch
    //  const response =
    //        await octokit.request('PUT /repos/{owner}/{repo}/pages', {
    //            owner,
    //            repo : newRepo,
    //            source: source,
    //            headers: {
    //                'X-GitHub-Api-Version': '2022-11-28'
    //            }
    //        })


    //console.log(response)

} catch (error) {
    if (error.response) {
        console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
    }
    console.error(error)
}
