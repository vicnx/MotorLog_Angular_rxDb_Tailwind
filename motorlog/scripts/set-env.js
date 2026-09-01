const fs = require('fs');
const path = require('path');

// Sanitizar variables eliminando espacios o saltos de línea accidentales
const logoToken = (process.env.LOGO_DEV_TOKEN || '').trim();
const googleId = (process.env.GOOGLE_CLIENT_ID || '').trim();
const baseUrl = '/MotorLog_Angular_rxDb_Tailwind/';

function createEnvContent(isProd) {
	return `export const environment = {
  production: ${isProd},
  logoDevToken: ${JSON.stringify(logoToken)},
  baseUrl: ${JSON.stringify(baseUrl)},
  googleClientId: ${JSON.stringify(googleId)}
};
`;
}

const envDir = path.join(__dirname, '..', 'src', 'environments');
if (!fs.existsSync(envDir)) {
	fs.mkdirSync(envDir, { recursive: true });
}

fs.writeFileSync(path.join(envDir, 'environment.ts'), createEnvContent(false));
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), createEnvContent(true));

console.log('Environment files generated successfully.');
