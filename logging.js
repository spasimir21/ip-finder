const fetch = require('node-fetch').default;
const chalk = require('chalk');

async function logIp(ip, country) {
    try {
        const req = await fetch(`https://json.geoiplookup.io/${ip}`);
        const json = await req.json();

        if (!json.success) return;

        const log = `\rFound IP: ${ip} from ${json.city} (${json.isp})\n`;

        if (json.country_name == country) {
            process.stdout.write(chalk.yellow(log));
        } else {
            process.stdout.write(log);
        }
    } catch (err) {}
}

module.exports = logIp;
