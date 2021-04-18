const fs = require('fs');
const path = require('path');

const authControllerPath = path.resolve(__dirname, '..', 'node_modules', 'directus', 'dist', 'controllers', 'auth.js');
const userServicePath = path.resolve(__dirname, '..', 'node_modules', 'directus', 'dist', 'services', 'users.js');
const emailUtilPath = path.resolve(__dirname, '..', 'node_modules', 'directus', 'dist', 'utils', 'get-email-from-profile.js');

fs.writeFileSync(authControllerPath, fs.readFileSync(path.resolve(__dirname, 'controller.auth.js'), { encoding: null }));
fs.writeFileSync(userServicePath, fs.readFileSync(path.resolve(__dirname, 'services.user.js'), { encoding: null }));
fs.writeFileSync(emailUtilPath, fs.readFileSync(path.resolve(__dirname, 'utils.get-email-from-profile.js'), { encoding: null }));

console.log('✨ Directus Auth controller and Users service successfully and atrociously patched!');
