/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/**/*.{ts,js,html}",
    "apps/**/bootstrapp.config.@(js|ts)",
    "apps/**/views/*.@(js|ts)",
  ],
};
