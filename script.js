// State variables
let currentInput = "0";
let previousOperand = null;
let activeOperation = null;
let shouldResetScreen = false;
let memoryValue = 0;
let isError = false;
let isSoundEnabled = false;

// DOM Elements
const displayEl = document.getElementById("display");
const flagMemory = document.getElementById("flagMemory");
const flagMinus = document.getElementById("flagMinus");
const flagError = document.getElementById("flagError");

const infoBtn = document.getElementById("infoBtn");
const shortcutsCard = document.getElementById("shortcutsCard");
const closeShortcutsBtn = document.getElementById("closeShortcutsBtn");

// Web Audio API Synthesizer for tactile plastic clicks
let audioCtx = null;

function playKeyClickSound() {
  if (!isSoundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      70,
      audioCtx.currentTime + 0.035,
    );

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.035);
  } catch (err) {
    // Fail silently if audio isn't supported or allowed yet
  }
}

// Update LCD screen presentation
function updateDisplay() {
  // Error handling
  if (isError) {
    displayEl.textContent = "Error";
    flagError.classList.remove("opacity-0");
    flagMinus.classList.add("opacity-0");
    return;
  }
  flagError.classList.add("opacity-0");

  // Negative minus indicator flag
  const numericVal = parseFloat(currentInput);
  if (!isNaN(numericVal) && numericVal < 0) {
    flagMinus.classList.remove("opacity-0");
  } else {
    flagMinus.classList.add("opacity-0");
  }

  // Memory flag
  if (memoryValue !== 0) {
    flagMemory.classList.remove("opacity-0");
  } else {
    flagMemory.classList.add("opacity-0");
  }

  // Sanitize display string for negative sign (flag handles the visual minus)
  let cleanValue = currentInput;
  if (cleanValue.startsWith("-")) {
    cleanValue = cleanValue.substring(1);
  }

  // Enforce 12-digit visual capacity
  if (cleanValue.length > 12) {
    cleanValue = cleanValue.slice(0, 12);
  }

  displayEl.textContent = cleanValue;
}

// Input digit
function appendDigit(digit) {
  if (isError) return;

  if (currentInput === "0" || shouldResetScreen) {
    currentInput = digit;
    shouldResetScreen = false;
  } else {
    // Limit to max 12 digits
    const digitsOnly = currentInput.replace(".", "").replace("-", "");
    if (digitsOnly.length >= 12) return;
    currentInput += digit;
  }
  updateDisplay();
}

// Append '00'
function appendDoubleZero() {
  if (isError) return;
  if (currentInput === "0" || shouldResetScreen) {
    currentInput = "0";
    shouldResetScreen = false;
  } else {
    const digitsOnly = currentInput.replace(".", "").replace("-", "");
    if (digitsOnly.length <= 10) {
      currentInput += "00";
    } else if (digitsOnly.length === 11) {
      currentInput += "0";
    }
  }
  updateDisplay();
}

// Append decimal separator
function appendDecimal() {
  if (isError) return;
  if (shouldResetScreen) {
    currentInput = "0.";
    shouldResetScreen = false;
    updateDisplay();
    return;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
    updateDisplay();
  }
}

// Backspace single digit
function backspace() {
  if (isError || shouldResetScreen) return;
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === "-" || currentInput === "") currentInput = "0";
  } else {
    currentInput = "0";
  }
  updateDisplay();
}

// Clear Entry (CE)
function clearEntry() {
  currentInput = "0";
  isError = false;
  updateDisplay();
}

// All Clear (AC)
function allClear() {
  currentInput = "0";
  previousOperand = null;
  activeOperation = null;
  shouldResetScreen = false;
  isError = false;
  updateDisplay();
}

// Basic Math Operations (+, -, *, /)
function setOperation(op) {
  if (isError) return;
  if (activeOperation !== null && !shouldResetScreen) {
    calculate();
  }
  previousOperand = parseFloat(currentInput);
  activeOperation = op;
  shouldResetScreen = true;
}

// Execute calculation (=)
function calculate() {
  if (isError || activeOperation === null || previousOperand === null) return;

  const current = parseFloat(currentInput);
  let result = 0;

  switch (activeOperation) {
    case "add":
      result = previousOperand + current;
      break;
    case "subtract":
      result = previousOperand - current;
      break;
    case "multiply":
      result = previousOperand * current;
      break;
    case "divide":
      if (current === 0) {
        isError = true;
        updateDisplay();
        return;
      }
      result = previousOperand / current;
      break;
    default:
      return;
  }

  // Format result to fit in 12 digits
  result = formatResult(result);
  currentInput = result.toString();
  previousOperand = null;
  activeOperation = null;
  shouldResetScreen = true;
  updateDisplay();
}

// Square Root
function squareRoot() {
  if (isError) return;
  const num = parseFloat(currentInput);
  if (num < 0) {
    isError = true;
    updateDisplay();
    return;
  }
  const result = Math.sqrt(num);
  currentInput = formatResult(result).toString();
  shouldResetScreen = true;
  updateDisplay();
}

// Percentage
function percentage() {
  if (isError) return;
  const num = parseFloat(currentInput);
  let result;
  if (previousOperand !== null) {
    result = (previousOperand * num) / 100;
  } else {
    result = num / 100;
  }
  currentInput = formatResult(result).toString();
  shouldResetScreen = true;
  updateDisplay();
}

// Memory Operations
let mrcClickedOnce = false;
let mrcTimer = null;

function memoryRecallClear() {
  if (mrcClickedOnce) {
    // Second click: Clear memory
    memoryValue = 0;
    mrcClickedOnce = false;
    clearTimeout(mrcTimer);
  } else {
    // First click: Recall memory
    currentInput = formatResult(memoryValue).toString();
    shouldResetScreen = true;
    mrcClickedOnce = true;
    mrcTimer = setTimeout(() => {
      mrcClickedOnce = false;
    }, 700);
  }
  updateDisplay();
}

function memoryAdd() {
  if (isError) return;
  memoryValue += parseFloat(currentInput);
  shouldResetScreen = true;
  updateDisplay();
}

function memorySubtract() {
  if (isError) return;
  memoryValue -= parseFloat(currentInput);
  shouldResetScreen = true;
  updateDisplay();
}

// Precision helper (bounds within 12 digits)
function formatResult(num) {
  if (!isFinite(num) || isNaN(num)) {
    isError = true;
    return 0;
  }
  // If number exceeds 12 digits exponent boundary
  if (Math.abs(num) >= 1e12) {
    isError = true;
    return 0;
  }

  // Float precision cleanup
  let str = parseFloat(num.toPrecision(12)).toString();
  if (str.length > 12) {
    str = parseFloat(num.toFixed(8)).toString();
  }
  return str;
}

// Button Click Routing
document.querySelectorAll("button[data-num]").forEach((btn) => {
  btn.addEventListener("click", () => {
    playKeyClickSound();
    appendDigit(btn.getAttribute("data-num"));
  });
});

document.querySelectorAll("button[data-action]").forEach((btn) => {
  btn.addEventListener("click", () => {
    playKeyClickSound();
    const action = btn.getAttribute("data-action");
    switch (action) {
      case "00":
        appendDoubleZero();
        break;
      case "dot":
        appendDecimal();
        break;
      case "add":
        setOperation("add");
        break;
      case "subtract":
        setOperation("subtract");
        break;
      case "multiply":
        setOperation("multiply");
        break;
      case "divide":
        setOperation("divide");
        break;
      case "equals":
        calculate();
        break;
      case "sqrt":
        squareRoot();
        break;
      case "percent":
        percentage();
        break;
      case "backspace":
        backspace();
        break;
      case "ce":
        clearEntry();
        break;
      case "ac":
        allClear();
        break;
      case "mrc":
        memoryRecallClear();
        break;
      case "m-plus":
        memoryAdd();
        break;
      case "m-minus":
        memorySubtract();
        break;
    }
  });
});

// Keyboard Shortcuts DOM Display Handler
function toggleShortcuts() {
  playKeyClickSound();
  if (!shortcutsCard) return;
  const isHidden = shortcutsCard.classList.contains("hidden");
  if (isHidden) {
    shortcutsCard.classList.remove("hidden");
    shortcutsCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else {
    shortcutsCard.classList.add("hidden");
  }
}

function hideShortcuts() {
  playKeyClickSound();
  if (!shortcutsCard) return;
  shortcutsCard.classList.add("hidden");
}

if (infoBtn) {
  infoBtn.addEventListener("click", toggleShortcuts);
}

if (closeShortcutsBtn) {
  closeShortcutsBtn.addEventListener("click", hideShortcuts);
}

// Full Keyboard Support
window.addEventListener("keydown", (e) => {
  if (shortcutsCard && !shortcutsCard.classList.contains("hidden")) {
    if (e.key === "Escape") {
      hideShortcuts();
      return;
    }
  }

  if (e.key >= "0" && e.key <= "9") {
    playKeyClickSound();
    appendDigit(e.key);
  } else if (e.key === ".") {
    playKeyClickSound();
    appendDecimal();
  } else if (e.key === "+" || e.key === "-") {
    playKeyClickSound();
    setOperation(e.key === "+" ? "add" : "subtract");
  } else if (e.key === "*") {
    playKeyClickSound();
    setOperation("multiply");
  } else if (e.key === "/") {
    e.preventDefault();
    playKeyClickSound();
    setOperation("divide");
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    playKeyClickSound();
    calculate();
  } else if (e.key === "Backspace") {
    playKeyClickSound();
    backspace();
  } else if (e.key === "Escape") {
    playKeyClickSound();
    allClear();
  } else if (e.key === "Delete" || e.key.toLowerCase() === "c") {
    playKeyClickSound();
    clearEntry();
  } else if (e.key === "%") {
    playKeyClickSound();
    percentage();
  } else if (e.key.toLowerCase() === "m") {
    playKeyClickSound();
    memoryRecallClear();
  } else if (e.key.toLowerCase() === "s" || e.key.toLowerCase() === "r") {
    playKeyClickSound();
    squareRoot();
  }
});

// Initialize display state on boot
updateDisplay();
