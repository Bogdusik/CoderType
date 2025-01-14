import { Repo, RepoFile, repoOptions } from "./data";
import { clearEditor, EditorResult, startEditor } from "./editor";
import {
  chooseOption,
  clearTerminal,
  readLine,
  removeTerminalCursor,
  separatorLine,
  writeLines,
} from "./terminal";

const getRoundLine = (round, wantsToPlayAgain) => {
  if (round === 1) return "Welcome to coder type! 🥳";
  if (wantsToPlayAgain) return "Yay! Let's play again! 😋";
  return "Ah whatever, I'm just gonna let you play again! 😇";
};

const writeFileHeader = async (repo, file) => {
  clearTerminal();
  await writeLines([
    `${repo.label} it is!`,
    separatorLine,
    `Repo: ${repo.url}`,
    `File: ${file.path}`,
    " ",
    "When you are ready, start typing! ⌨️",
    separatorLine,
    " ",
  ]);
};

const writeResult = async (result) => {
  const errors = result.totalCharacters - result.correctCharacters;
  const accuracy =
    result.totalCharacters > 0
      ? (result.correctCharacters / result.totalCharacters) * 100
      : 0;
  const ccps = (result.correctCharacters / result.totalTime) * 1000 * 60;

  await writeLines([
    result.reachedTheEnd
      ? "Wow you've completed the entire snippet ✅"
      : "Time's up!! ⌛️",
    `Here are your results:`,
    separatorLine,
    " ",
    `Correct characters per minute: ${ccps.toFixed(2)}`,
    "Total errors: " + (errors > 0 ? errors : "No errors, what a performance!"),
    `Accuracy: ${accuracy.toFixed(2)}%`,
    " ",
    separatorLine,
    "Wanna play again? (y, n)",
    " ",
  ]);
};

const runGame = async () => {
  let round = 1;
  let wantsToPlayAgain = true;

  while (true) {
    clearTerminal();
    await writeLines([
      getRoundLine(round, wantsToPlayAgain),
      "Please select practice repo:",
      " ",
    ]);
    const repo = await chooseOption(repoOptions);
    const file = repo.files[Math.floor(Math.random() * repo.files.length)];
    await writeFileHeader(repo, file);
    removeTerminalCursor();

    const result = await startEditor(file.code);

    clearEditor();
    clearTerminal();
    await writeResult(result);

    wantsToPlayAgain = (await readLine()) === "y";
    round++;
  }
};

runGame();