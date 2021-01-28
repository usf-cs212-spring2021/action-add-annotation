const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;

async function run() {
  try {
    const octokit = github.getOctokit(core.getInput('token'));

    core.info('Updating annotations...')
    const annotation = await octokit.checks.create({
      owner: context.payload.organization.login,
      repo: context.payload.repository.name,
      name: core.getInput('name'),
      head_sha: context.sha,
      conclusion: core.getInput('conclusion'),
      output: {
        title: core.getInput('title'),
        summary: core.getInput('summary'),
        annotations: [
          {
             path: `.github`,
             start_line: 1,
             end_line: 1,
             annotation_level: core.getInput('level'),
             message: core.getInput('summary'),
             title: core.getInput('title')
          }
        ]
      }
    });

    core.info(`Annotation at: ${annotation.data.html_url}`);
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
