const { schedule } = require("@netlify/functions");
const { cron } = require("../../dist/nextbuild.json");

exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: cron }),
  };
};
