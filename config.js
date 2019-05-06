
const applicationName = "Fruits";
const buildNumber = "2";
const serverTimeout = process.env['SERVER_TIMEOUT'] ? parseInt(process.env['SERVER_TIMEOUT']) : 120000;

module.exports = {
    applicationName,
    buildNumber,
    serverTimeout
}