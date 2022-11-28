const inquirer = require("inquirer");
const slugify = require("slugify");
const fs = require("fs").promises;
const path = require("path");
const config = require("../_data/site")();

inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

async function run() {
  const [postHours, postMinutes] = config.publishTime.split(":");
  const dateInitial = new Date();
  dateInitial.setHours(postHours);
  dateInitial.setMinutes(postMinutes);

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "What do you want generate?",
      choices: ["Post", "Demo"],
    },
    {
      type: "input",
      name: "title",
      message: "What is the title?",
    },
    {
      type: "datetime",
      name: "date",
      message: "What is the publish date/time?",
      format: ["yyyy", "-", "mm", "-", "dd", " ", "HH", ":", "MM"],
      initial: dateInitial,
      when: (answers) => {
        return answers.type === "Post";
      },
    },
  ]);

  if (answers.type === "Demo") {
    let file = await fs.readFile(
      path.join(__dirname, "templates", "demo.js"),
      "utf-8"
    );

    file = file.replace("Default title", answers.title);

    const filename = slug(answers.title);
    await fs.writeFile(
      path.join(__dirname, "..", "_data", "demos", `${filename}.js`),
      file
    );

    console.log(
      `New demo generated at: ${path.join(
        __dirname,
        "..",
        "_data",
        "demos",
        `${filename}.js`
      )}`
    );
  } else if (answers.type === "Post") {
    let file = await fs.readFile(
      path.join(__dirname, "templates", "post.md"),
      "utf-8"
    );

    file = file.replace("Default title", answers.title);

    const formattedDate = `${answers.date.getFullYear()}-${
      answers.date.getMonth() + 1
    }-${answers.date.getDate()} ${answers.date.getHours()}:${answers.date.getMinutes()}:00`;

    file = file.replace("1970-01-01 00:00:00", formattedDate);

    const filename = slug(answers.title);
    await fs.writeFile(
      path.join(__dirname, "..", "posts", `${filename}.md`),
      file
    );

    console.log(
      `New post generated at: ${path.join(
        __dirname,
        "..",
        "posts",
        `${filename}.md`
      )}`
    );
  }
}

function slug(input) {
  const options = {
    replacement: "-",
    remove: /[&,+()$~%.'":*!?<>{}]/g,
    lower: true,
  };
  return slugify(input, options);
}

run();
