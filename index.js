const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

async function main() {
    const fileSystems = await getFileSystems();
    for (const fileSystem of fileSystems) {
        await findImageFiles(fileSystem);
    }
}

main()
    .then(() => console.log('Done!'))
    .catch(error => console.error(error));

//
// Get a list of file systems.
//
async function getFileSystems() {
    return new Promise((resolve, reject) => {
        if (process.platform === 'win32') {
            // For Windows
            exec('wmic logicaldisk get name', (error, stdout) => {
                if (error) {
                    reject(error);
                    return;
                }
                const drives = stdout.split('\n')
                    .slice(1)
                    .map(drive => `${drive.trim()}/`)
                    .filter(drive => drive)
                resolve(drives);
            });
        }
        else {
            // For macOS and Linux
            exec('df -h', (error, stdout) => {
                if (error) {
                    reject(error);
                    return;
                }
                console.log(stdout); //todo:
            });

            exec('mount', (error, stdout, stderr) => { // Or use `df -h`
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(stdout);
                // Parse the stdout for mount points using network protocols
            });
        }
    });
}

//
// List of image file extensions to find.
//
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp']);

//
// Search a directory for image files.
//
async function findImageFiles(directory) {

    try {
        const files = await fs.readdir(directory, { withFileTypes: true });

        for (const file of files) {
            const filePath = path.join(directory, file.name);
            if (file.isDirectory()) {
                // If the file is a directory, recursively search it.
                await findImageFiles(filePath);
            }
            else {
                // Check if the file is an image based on its extension.
                if (imageExtensions.has(path.extname(file.name).toLowerCase())) {
                    console.log(`Image file found: ${filePath}`);
                }
            }
        }
    }
    catch (error) {
        if (error.code === "EPERM") {
            // No access.
            return;
        }

        throw error;
    }
}