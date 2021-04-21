const inquirer = require("inquirer");
const slugify = require("slugify");
const fs = require("fs").promises;
const path = require("path");

inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

async function run() {
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
      message: "What is the publish date?",
      format: ["yyyy", "-", "mm", "-", "dd"],
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
    file = file.replace(
      "1970-01-01",
      answers.date.toLocaleDateString("en-CA", { timeZone: "Europe/London" })
    );

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
