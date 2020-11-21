const rl = require('readline');
const os = require('os');

function readline(q) {
    const rli = rl.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve, reject) => {
        rli.question(q, a => {
            rli.close();
            resolve(a);
        });
    });
}

function findDevices() {
    const infs = os.networkInterfaces();
    const devs = [];

    for (const name in infs) {
        for (const dev of infs[name]) {
            if (
                dev.family == 'IPv4' &&
                dev.address != '127.0.0.1' &&
                !dev.internal
            ) {
                devs.push({
                    name,
                    address: dev.address
                });
            }
        }
    }

    return devs;
}

async function pickLocalIp() {
    process.stdout.write('\033c'); // CLear screen
    const devs = findDevices();

    if (devs.length == 0) {
        console.log('No devices found!');
        process.exit(1);
    }

    for (const [idx, dev] of devs.entries()) {
        console.log(`${idx + 1}. ${dev.name} (${dev.address})`);
    }

    console.log('');

    let idx = await readline('Select device: ');
    idx = parseInt(idx);

    if (isNaN(idx) || idx < 1) return await pickLocalIp(); // Do it again if not number
    if (devs[idx - 1] == null) return await pickLocalIp(); // Do it again if too high

    process.stdout.write('\033c'); // CLear screen

    return devs[idx - 1].address;
}

async function pickCountry() {
    process.stdout.write('\033c'); // CLear screen

    const country = await readline('Select country: ');

    process.stdout.write('\033c'); // CLear screen

    return country;
}

module.exports = { pickLocalIp, pickCountry };
