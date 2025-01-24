const { select, input, checkbox } = require("@inquirer/prompts");

const goal = {
  value: "",
  checked: false,
};

const goals = [goal];

const registerGoal = async () => {
  const goal = await input({
    message: "Enter a goal",
  });

  if (goal.length === 0) {
    console.log("The goal cannot be empty");
    return registerGoal();
  }

  goals.push({
    value: goal,
    checked: false,
  });
};

const listGoals = async () => {
  const response = await checkbox({
    message:
      "Use the arrows to change goals, the space bar to select or deselect and enter to finish this step",
    choices: [...goals],
    instructions: false,
  });

  if (response === 0) {
    console.log("Unknown goal selected!");
    return;
  }

  metas.forEach((goal) => {
    goal.checked = false;
  });

  response.forEach((res) => {
    const goal = goals.find((goal) => {
      return goal.value == res;
    });

    goal.checked = true;
  });

  console.log("Goal conclued");
};

const start = async () => {
  while (true) {
    const opcao = await select({
      message: "Menu >",
      choices: [
        {
          name: "Meta register",
          value: "register",
        },
        {
          name: "List goal",
          value: "list",
        },
        {
          name: "Quit",
          value: "quit",
        },
      ],
    });

    switch (opcao) {
      case "register":
        await registerGoal();
        console.log(goals);

        break;

      case "list":
        await listGoals();

        break;

      case "quit":
        return;
    }
  }
};
start();
