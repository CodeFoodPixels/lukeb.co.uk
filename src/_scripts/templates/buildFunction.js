const { request } = require("https");
const { schedule } = require("@netlify/functions");

exports.handler = schedule("0 0 0 0 0", async () => {
  await new Promise((resolve, reject) => {
    const req = request(
      "https://api.netlify.com/build_hooks/<<build_hook>>",
      { method: "POST" },
      (res) => {
        console.log("statusCode:", res.statusCode);
        resolve();
      }
    );

    req.on("error", (e) => {
      console.error(e);
      reject();
    });
    req.end();
  });

  return {
    statusCode: 200,
  };
});
