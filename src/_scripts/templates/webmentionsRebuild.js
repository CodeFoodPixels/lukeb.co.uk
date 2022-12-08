const { request } = require("https");
const { schedule } = require("@netlify/functions");

exports.handler = schedule("0 * * * *", async () => {
  const webmentions = await new Promise((resolve, reject) => {
    const req = request(
      "https://webmention.io/api/mentions.jf2?domain=<<domain>>&token=<<token>>&since=2022-12-08T12:23:43.310Z",
      { method: "get" },
      (res) => {
        console.log("statusCode:", res.statusCode);
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });

        res.on("end", () => {
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (e) {
            console.error(e);
            reject();
          }
        });
      }
    );

    req.on("error", (e) => {
      console.error(e);
      reject();
    });
    req.end();
  });

  if (webmentions.children.length > 0) {
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
  }

  return {
    statusCode: 200,
  };
});
