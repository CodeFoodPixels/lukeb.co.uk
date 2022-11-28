const { request } = require("node:https");
const { schedule } = require("@netlify/functions");
// const { cron } = require("../../dist/nextbuild.json");

exports.handler = schedule("50 13 28 11 1", (event, context) => {
  const options = {
    hostname: "api.netlify.com",
    path: `/build_hooks/${process.env.BUILD_HOOK}`,
    method: "POST",
  };

  request(options);
});
