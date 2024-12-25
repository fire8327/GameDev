const INITIAL_LIST_NAME = "initial-list";
const TARGET_LIST_NAME = "target-list";

const words = [];

const targetList = document.querySelector("[data-list='target-list']");
const initialList = document.querySelector("[data-list='initial-list']");

const form = document.querySelector("form");

targetList.addEventListener("dragover", dragOverTargetList);
targetList.addEventListener("drop", dropToTargetList);
form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
    event.preventDefault();

    resetBoard();

    const inputElement = document.querySelector("input");

    const value = inputElement.value;

    const splittedValues = value.split("-").map((word) => word.trim());

    const words = splittedValues.filter((value) => isNaN(value)).sort();
    const numbers = splittedValues
        .filter((value) => !isNaN(value))
        .sort((a, b) => a - b);

    const result = [
        ...words.map((word, index) => ({ [`a${index + 1}`]: word })),
        ...numbers.map((number, index) => ({ [`n${index + 1}`]: number })),
    ];

    addInitialBlocks(result);
}

function addInitialBlocks(wordsObjects) {
    wordsObjects.forEach((wordObj) => {
        const [key] = Object.keys(wordObj);
        const value = wordObj[key];

        if (value.length > 0) {
            const wordElement = createWordBlock(key, value);
            initialList.appendChild(wordElement);
        }
    });
}

function createWordBlock(key, value) {
    const wordElement = document.createElement("li");
    wordElement.className = "word-block";
    wordElement.draggable = "true";

    const divElement = document.createElement("div");
    divElement.textContent = `${key}: ${value}`;
    wordElement.appendChild(divElement);

    wordElement.addEventListener("dragstart", startDraggingBlock);
    wordElement.addEventListener("dragend", stopDraggingBlock);

    return wordElement;
}

function dropToTargetList(event) {
    event.preventDefault();

    if (!event.target.hasAttribute("data-list")) return;

    const wordBlock = document.querySelector(".dragging");

    if (!wordBlock) return;

    const listName = wordBlock.dataset.block;

    const clonedBlock = wordBlock.cloneNode(true);

    clonedBlock.setAttribute("data-block", TARGET_LIST_NAME);
    clonedBlock.classList.remove("dragging");

    clonedBlock.addEventListener("dragstart", startDraggingBlock);
    clonedBlock.addEventListener("dragend", stopDraggingBlock);

    if (listName === INITIAL_LIST_NAME) {
        targetList.prepend(clonedBlock);

        const emptyBlock = document.createElement("li");
        emptyBlock.className = "empty-block";
        wordBlock.replaceWith(emptyBlock);
        displaySentence();
    }

    if (listName === TARGET_LIST_NAME) {
        const listHeight = targetList.offsetHeight;

        const top = event.offsetY;
        const bottom = listHeight - top;

        const blocks = targetList.querySelectorAll(".word-block");

        const blocksHeight = blocks.length * 28 + (blocks.length - 1) * 10;

        if (bottom > blocksHeight && blocks.length > 1) {
            wordBlock.remove();
            targetList.prepend(clonedBlock);
            displaySentence();
        }
    }
}

function startDraggingBlock(event) {
    const wordBlock = event.target;

    wordBlock.classList.add("dragging");

    const list = wordBlock.closest("[data-list]");
    const listName = list.dataset.list;

    if (listName === INITIAL_LIST_NAME) {
        wordBlock.setAttribute("data-block", INITIAL_LIST_NAME);
    }

    if (listName === TARGET_LIST_NAME) {
        wordBlock.setAttribute("data-block", TARGET_LIST_NAME);
    }
}

function stopDraggingBlock(event) {
    const wordBlock = event.target;

    wordBlock.classList.remove("dragging");
}

function dropToTopTargetList(event) {
    event.preventDefault();
}

function dragOverTargetList(event) {
    event.preventDefault();
}

function displaySentence() {
    const headerElement = document.querySelector(".header");
    headerElement.innerHTML = "";

    const blocks = document.querySelectorAll("[data-block='target-list']");
    
    blocks.forEach((block) => {
        const wordElement = document.createElement("div");
        const wordValue = block.textContent.split(" ")[1];
        wordElement.textContent = wordValue;
        headerElement.prepend(wordElement);
    });
}

function resetBoard() {
    const headerElement = document.querySelector(".header");
    headerElement.innerHTML = "";
    targetList.innerHTML = "";
    initialList.innerHTML = "";
}
