# 📟 Pastel Retro Pocket Calculator (RETRO-1200)

A vintage-inspired pocket calculator built with vanilla HTML, Tailwind CSS, custom CSS, and JavaScript. Styled with a nostalgic pastel palette, recessed LCD screen, realistic tactile button bevels, and an inline keyboard shortcuts panel.

---

## ✨ Features

- **🎨 Retro Pastel Aesthetic**:
  - Warm cream chassis (`#ece5d8`) with soft 3D bevels and ambient drop shadows.
  - Ivory white numeric buttons, mint functional buttons, and deep forest-green operator keys.
  - Realistic 4-cell solar panel with gloss highlights.

- **📟 Authentic Recessed LCD Display**:
  - 12-digit capacity rendered in `Share Tech Mono`.
  - Faint ghost `888888888888` background segments mimicking real physical liquid crystal displays.
  - Dynamic LCD status indicators:
    - **M**: Active memory stored
    - **−**: Negative sign indicator
    - **E**: Error state (e.g. division by zero, overflow)

- **🧮 Comprehensive Calculation Suite**:
  - Basic arithmetic: Addition (`+`), Subtraction (`−`), Multiplication (`×`), Division (`÷`).
  - Advanced operations: Square Root (`√`), Percentage (`%`), Double Zero (`00`).
  - Independent memory registers: Recall/Clear (`MRC`), Memory Add (`M+`), Memory Subtract (`M−`).
  - Clear Entry (`CE`) vs. All Clear (`AC`).

- **⌨️ Inline Keyboard Shortcuts Panel**:
  - Clicking the **`?`** help button in the header toggles a retro keyboard shortcut card directly on the page DOM below the calculator.
  - Can be dismissed via the **`✕`** close button or <kbd>Escape</kbd>.

- **🔊 Tactile Click Audio**:
  - Synthesized plastic key click effects generated using the native browser **Web Audio API** (no external audio assets required).

- **📱 Fully Responsive**:
  - Optimized for desktop, tablet, and mobile screens with touch-friendly button layouts.

---

## ⌨️ Keyboard Shortcuts

All primary features can be operated using your keyboard:

| Key(s) | Action | Function Description |
| :--- | :--- | :--- |
| `0` – `9` | Digits | Enter numbers |
| `.` | Decimal Point | Insert decimal place |
| `+`, `-`, `*`, `/` | Operators | Add, Subtract, Multiply, Divide |
| `Enter` or `=` | Equals | Calculate result |
| `Backspace` | Backspace | Delete last entered digit |
| `Delete` or `C` | Clear Entry (`CE`) | Clear current input while keeping active calculation |
| `Escape` | All Clear (`AC`) | Reset entire calculation state (or close shortcuts card) |
| `%` | Percentage | Calculate percentage |
| `S` or `R` | Square Root (`√`) | Calculate square root of current number |
| `M` | MRC | First press: Recall memory; Second press: Clear memory |

---

## 🛠️ Built With

- **HTML5**: Semantic document structure.
- **Tailwind CSS**: Utility-first styling and responsive layout grid.
- **Custom CSS (`style.css`)**: 3D button depths, LCD screen inset shadows, and custom tactile styling.
- **JavaScript (`script.js`)**: State management, arithmetic logic, keyboard event handling, and Web Audio API synthesizer.
- **Google Fonts**:
  - [`Space Grotesk`](https://fonts.google.com/specimen/Space+Grotesk) for button typography and UI text.
  - [`Share Tech Mono`](https://fonts.google.com/specimen/Share+Tech+Mono) for the 12-digit retro digital display.

---

## 📁 Project Structure

```text
Calcu/
├── index.html       # Calculator UI, status bar, and inline shortcuts container
├── style.css        # Tactile bevels, 3D shadows, and LCD styling
├── script.js        # Calculator logic, Web Audio synthesizer, and shortcut routing
└── README.md        # Project documentation
```

---

## 🚀 Getting Started

No compilation, Node.js packages, or build steps are required.

1. Clone or download this repository.
2. Open `index.html` in any modern web browser (Google Chrome, Firefox, Microsoft Edge, Safari).
3. Alternatively, run a local development server (such as VS Code's **Live Server** extension).

---

## 📄 License

This project is open-source and free to use for personal and educational projects.

