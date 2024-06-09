const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');

function run() {
    try {
        const apiKey = core.getInput('api-key');
        const fileExtension = core.getInput('file-extension');
        const masterBranch = core.getInput('master-branch');
        const extensionPattern = new RegExp(`\\.${fileExtension.replace(/\./g, '\\.')}$`);

        // Fetch the diff between the current branch and master
        exec(`git diff --name-only ${masterBranch}`, (error, stdout, stderr) => {
            if (error) {
                core.setFailed(`Error fetching git diff: ${stderr}`);
                return;
            }

            const files = {};

            // Get the list of changed files
            const changedFiles = stdout.split('\n').filter(file => extensionPattern.test(file));

            // Parse and save to files variable the content and operation of each i18n file
            changedFiles.forEach(file => {
                const filePath = path.resolve(process.cwd(), file);
                const baseFile = filePath.replace(/\.i18n\./, '.');

                if (fs.existsSync(filePath)) {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            core.setFailed(`Error reading file ${file}: ${err.message}`);
                            return;
                        }

                        try {
                            // remove keyset initialization
                            let content = data.replace(/const keyset = |;/g, '');

                            // remove import
                            content = content.substring(content.indexOf('\n') + 1);

                            // remove export
                            content = content.substring(0, content.lastIndexOf('\n'));
                            content = content.substring(0, content.lastIndexOf('\n'));

                            files[baseFile] = {
                                operation: 'update',
                                translations: JSON.parse(content),
                            };
                        } catch (parseError) {
                            core.setFailed(`Error parsing JSON in file ${file}: ${parseError.message}`);
                        }
                    });
                } else {
                    files[baseFile] = {
                        operation: 'delete',
                    };
                }
            });

            const req = https.request({
                hostname: 'https://localang.com',
                port: 443,
                path: '/api/translations/update',
                method: 'POST',
            }, res => {
                let data = '';

                res.on('data', chunk => {
                    data += chunk;
                });

                res.on('end', () => {
                    const result = JSON.parse(data);

                    if (result?.status !== 'success') {
                        core.setFailed('Error syncing keysets');
                    }
                });
            });

            req.on('error', function(e) {
                core.setFailed(`Error syncing keysets: ${e.message}`);
            });

            req.end();
        });
    } catch (error) {
        core.setFailed(`Action failed with error ${error.message}`);
    }
}

run();
