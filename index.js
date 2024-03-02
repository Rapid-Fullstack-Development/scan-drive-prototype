const { exec } = require('child_process');

if (process.platform === 'win32') {
    // For Windows
    exec('wmic logicaldisk get name', (error, stdout) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(stdout);
    });

    //todo: start scanning files and send the results to the FE via ipc
}
else {
    // For macOS and Linux
    exec('df -h', (error, stdout) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(stdout);
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

