import { backspaceKey, enterKey } from "./keyboard";

const terminalElement = document.getElementById("terminal");
const cursorElement = document.getElementById("cursor");

export const separatorLine = "®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®®";
const promptPrefix = "$ ";
const typingDelay = 20;

export const addTerminalCursor = () => {
	if (cursorElement.parentElement !== terminalElement)
		terminalElement.appendChild(cursorElement);
}

export const removeTerminalCursor = () => {
	if (cursorElement.parentElement === terminalElement)
		terminalElement.removeChild(cursorElement);
}

export const writeLines = async (lines) => {
	removeTerminalCursor();
	for (const line of lines) {
		await writeSingleLine(line);
		writeLineBreak();
	}
	terminalElement.appendChild(cursorElement)
}

const writeSingleLine = (line) => {
	return new Promise(resolve => {
		let index = 0;
		const interval = setInterval(() => {
			writeChar(line[index++]);
			if (index === line.length) {
				clearInterval(interval);
				resolve();
			}
		}, typingDelay);
	})
};

const writeChar = (char) => {
	const span = document.createElement("span");
	span.textContent = char;
	terminalElement.appendChild(span);
	terminalElement.appendChild(cursorElement);
	terminalElement.scrollTop = terminalElement.scrollHeight;
}

const removeLastChar = () => {
	terminalElement.removeChild(cursorElement);
	const last = terminalElement.lastChild;
	if (last) terminalElement.removeChild(last);
	terminalElement.appendChild(cursorElement);
}

const writeLineBreak = () => {
	terminalElement.appendChild(document.createElement("br"));
}

const inputRegex = /^[\w\d ]$/

export const readLine = () => {
	return new Promise(resolve => {
		let line = "";

		const listener = (event) => {
			const key = event.key;
			if (inputRegex.test(key)) {
				line += key;
				writeChar(key);
			} else if (key === enterKey && line.length > 0) {
				document.removeEventListener("keydown", listener);
				writeLineBreak();
				resolve(line);
			} else if (key === backspaceKey && line.length > 0) {
				line = line.slice(0, line.length - 1);
				removeLastChar();
			}
		}

		writeSingleLine(promptPrefix);
		document.addEventListener("keydown", listener);
	})
}


const chooseOptionErrorMessages = [
    ["Come on, just type a", "It's simple, enter a number between 1 and 3, not a magic spell! 🧙‍♂️"],
    ["A", "Not a letter, I need a number between 1 and 3! Don't make me ask again! 🔢"],
    ["Alright, enough fun... Enter a", "This isn't a game, give me a number from 1 to 3, please! 🎮"],
    ["What does that even mean? Please, a", "Stop speaking in riddles, just give me 1, 2, or 3! 🤨"],
    ["Okay, seriously now... How about a", "We need a number, 1 to 3. It's not rocket science! 🚀"],
    ["Let me check... Nope, that's not a", "Try again with a number between 1 and 3! No more tricks! 🧐"],
    ["Come on, just type a", "It's a simple choice, between 1 and 3! No need for a fortune teller 🔮"],
    ["Another try? Give me a", "I'm running out of patience... just 1, 2, or 3! ⏳"],
    ["C'mon, don't leave me hanging! Give me a", "I need a number from 1 to 3, not your favorite color! 🌈"],
    ["Why so shy? Just type a", "No need to be scared, 1, 2, or 3 – your call! 🥳"],
];

export const chooseOption = async (options) => {
	await writeLines([
		...options.map((opt, index) => `${index + 1}. ${opt.label}`),
		" "
	]);
	let tryIndex = 0;

	let index = -1;
	while (index === -1) {
		const number = parseInt(await readLine());
		if (number > 0 && number <= options.length) {
			index = number - 1;
		} else {
			const errorMessage = chooseOptionErrorMessages[tryIndex++];
			tryIndex = tryIndex % chooseOptionErrorMessages.length;

			await writeLines([
				" ",
				`${errorMessage[0]} number between 1 and ${options.length}.`,
				errorMessage[1],
				" "
			]);
		}
	}

	return options[index];
}

export const clearTerminal = () => {
	terminalElement.innerHTML = "";
}