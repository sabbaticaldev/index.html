/**
 * Configuration settings for the aiflow project.
 * @module settings
 */
import "dotenv/config";
const __dirname = process.env.INIT_CWD || process.cwd();
const env = process.env || {};
env.__dirname = __dirname;
export default env;
