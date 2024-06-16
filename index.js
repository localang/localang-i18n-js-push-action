const core = require('@actions/core');
const { exec } = require('child_process');
const { push } = require('localang-js-lib');

function run() {
    try {
        const apiKey = core.getInput('api-key');
        const fileExtension = core.getInput('file-extension');
        const projectId = Number(core.getInput('project-id'));
        const masterBranch = core.getInput('master-branch');
        const extensionPattern = new RegExp(`\\.${fileExtension.replace(/\./g, '\\.')}$`);

        // Fetch the diff between the current branch and master
        exec(`git diff --name-only ${masterBranch}`, (error, stdout, stderr) => {
            if (error) {
                core.setFailed(`Error fetching git diff: ${stderr}`);
                return;
            }

            // Get the list of changed files
            const changedFiles = stdout.split('\n').filter(file => extensionPattern.test(file));

            push(apiKey, projectId, changedFiles);
        });
    } catch (error) {
        core.setFailed(`Action failed with error ${error.message}`);
    }
}

run();
