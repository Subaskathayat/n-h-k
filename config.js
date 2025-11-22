// Load environment variables from .env file
const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = envContent.split('\n').reduce((acc, line) => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match && !line.startsWith('#')) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/(^['"]|['"]$)/g, '');
            acc[key] = value;
        }
        return acc;
    }, {});

    // Make them available in process.env
    Object.assign(process.env, envVars);
}

// Export the configuration
module.exports = {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
};
