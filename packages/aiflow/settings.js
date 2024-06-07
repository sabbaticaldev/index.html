const __dirname = process.env.INIT_CWD || process.cwd();
const env = process.env || {};
env.__dirname = __dirname;
export default env;
