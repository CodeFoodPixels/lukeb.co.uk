const { request } = require("node:https");
const { schedule } = require("@netlify/functions");
// const { cron } = require("../../dist/nextbuild.json");

exports.handler = schedule("37 14 28 11 1", (event, context) => {
  const options = {
    hostname: "api.netlify.com",
    path: `/build_hooks/${process.env.BUILD_HOOK}`,
    method: "POST",
  };

  const req = request(options, (res) => {
    console.log("statusCode:", res.statusCode);
    console.log("headers:", res.headers);

    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (e) => {
    console.error(e);
  });
  req.end();

  return {
    statusCode: 200,
  };
});
