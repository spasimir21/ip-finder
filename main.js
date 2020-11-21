const PROTOCOL = require('cap').decoders.PROTOCOL;
const decoders = require('cap').decoders;
const Cap = require('cap').Cap;

const { pickLocalIp, pickCountry } = require('./pick.js');
const logIp = require('./logging.js');

process.title = 'IpFinder';

(async () => {
    const localIp = await pickLocalIp();
    const country = await pickCountry();
    const ips = new Set();

    const cap = new Cap();

    const dev = Cap.findDevice(localIp);
    const packet = Buffer.alloc(65535);
    const bufSize = 10 * 1024 * 1024; // 10 Mb
    const filter = 'ip';

    const linkType = cap.open(dev, filter, bufSize, packet);
    cap.setMinBytes && cap.setMinBytes(0);

    if (linkType != 'ETHERNET') process.exit(1);

    cap.on('packet', (size, trunc) => {
        const ether = decoders.Ethernet(packet);

        if (ether.info.type === PROTOCOL.ETHERNET.IPV4) {
            const ip = decoders.IPV4(packet, ether.offset);

            if (!ips.has(ip.info.srcaddr)) {
                logIp(ip.info.srcaddr, country);
                ips.add(ip.info.srcaddr);
            }

            if (!ips.has(ip.info.dstaddr)) {
                logIp(ip.info.dstaddr, country);
                ips.add(ip.info.dstaddr);
            }
        }
    });
})();
