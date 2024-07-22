const core = require('@actions/core');
const { context } = require('@actions/github');
const { exec } = require('child_process');
const { push } = require('localang-i18n-js');

function run() {
    try {
        const apiKey = core.getInput('api-key');
        const fileExtension = core.getInput('file-extension');
        const projectId = Number(core.getInput('project-id'));
        const extensionPattern = new RegExp(`\\.${fileExtension.replace(/\./g, '\\.')}$`);

        // Fetch the diff between the current branch and master
        exec(`git diff --name-only ${context.payload.before} ${context.payload.after}`, (error, stdout, stderr) => {
            if (error) {
                core.setFailed(`Error fetching git diff: ${stderr}`);
                return;
            }

            // Get the list of changed files
            const changedFiles = stdout.split('\n').filter(file => extensionPattern.test(file));

            if (changedFiles.length !== 0) {
                push(apiKey, projectId, changedFiles);
            }
        });
    } catch (error) {
        core.setFailed(`Action failed with error ${error.message}`);
    }
}

run();
