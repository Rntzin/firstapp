const { select, input, checkbox } = require("@inquirer/prompts");
const fs = require("fs").promises;

let message = "Welcome to the Goals App";
let goals = [];

const loadGoals = async () => {
  try {
    const data = await fs.readFile("goals.json", "utf-8");
    goals = JSON.parse(data);
  } catch (error) {
    goals = [];
  }
};

const saveGoals = async () => {
  await fs.writeFile("goals.json", JSON.stringify(goals, null, 2));
};

const addGoal = async () => {
  const goal = await input({ message: "Enter your goal:" });

  if (!goal.trim()) {
    message = "The goal cannot be empty.";
    return;
  }

  goals.push({ value: goal, checked: false });
  message = "Goal added successfully!";
};

const listGoals = async () => {
  if (goals.length === 0) {
    message = "No goals available!";
    return;
  }

  const selectedGoals = await checkbox({
    message: "Use arrows to navigate, space to select, and Enter to confirm.",
    choices: goals.map((goal) => ({ name: goal.value, checked: goal.checked })),
    instructions: false,
  });

  goals.forEach((goal) => {
    goal.checked = selectedGoals.includes(goal.value);
  });

  message = selectedGoals.length
    ? "Goal(s) marked as completed!"
    : "No goals selected!";
};

const showCompletedGoals = async () => {
  const completed = goals.filter((goal) => goal.checked);

  if (completed.length === 0) {
    message = "No completed goals yet!";
    return;
  }

  await select({
    message: `Completed Goals: ${completed.length}`,
    choices: completed.map((goal) => ({ name: goal.value })),
  });
};

const showOpenGoals = async () => {
  const openGoals = goals.filter((goal) => !goal.checked);

  if (openGoals.length === 0) {
    message = "All goals are completed!";
    return;
  }

  await select({
    message: `Open Goals: ${openGoals.length}`,
    choices: openGoals.map((goal) => ({ name: goal.value })),
  });
};

const deleteGoals = async () => {
  if (goals.length === 0) {
    message = "No goals to delete!";
    return;
  }

  const selectedForDeletion = await checkbox({
    message: "Select goals to delete:",
    choices: goals.map((goal) => ({ name: goal.value })),
    instructions: false,
  });

  if (selectedForDeletion.length === 0) {
    message = "No goals selected for deletion!";
    return;
  }

  goals = goals.filter((goal) => !selectedForDeletion.includes(goal.value));
  message = "Goal(s) deleted successfully!";
};

const displayMessage = () => {
  console.clear();
  if (message) {
    console.log(message);
    console.log("");
    message = "";
  }
};

const start = async () => {
  await loadGoals();

  while (true) {
    displayMessage();
    await saveGoals();

    const option = await select({
      message: "Menu >",
      choices: [
        { name: "Add a goal", value: "add" },
        { name: "List goals", value: "list" },
        { name: "Show completed goals", value: "completed" },
        { name: "Show open goals", value: "open" },
        { name: "Delete goals", value: "delete" },
        { name: "Exit", value: "exit" },
      ],
    });

    try {
      switch (option) {
        case "add":
          await addGoal();
          break;
        case "list":
          await listGoals();
          break;
        case "completed":
          await showCompletedGoals();
          break;
        case "open":
          await showOpenGoals();
          break;
        case "delete":
          await deleteGoals();
          break;
        case "exit":
          console.log("Goodbye!");
          return;
      }
    } catch (error) {
      message = `An error occurred: ${error.message}`;
    }
  }
};

start();
