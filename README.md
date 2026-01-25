# CoderType

A speed typing game designed specifically for coders. Challenges users to type code snippets from various repositories as fast and accurately as possible. Features an interactive terminal interface, accuracy tracking, and multiple rounds to improve coding speed and precision.

## Demo

![Game Interface](screenshots/game-interface.png)
![Terminal View](screenshots/terminal.png)
![Results Screen](screenshots/results.png)

## Why It's Cool

- **Code-Focused Typing**: Practice typing with real code snippets from popular repositories (React, Linux, TensorFlow) instead of plain text
- **Terminal Interface**: Authentic command-line environment that mimics real coding experience
- **Detailed Metrics**: Track characters typed, accuracy percentage, errors, and typing speed
- **Multiple Challenges**: Various code snippets and difficulty levels to keep practice engaging
- **Replay System**: Improve performance by replaying rounds and tracking progress over time
- **Simple & Fast**: Lightweight vanilla JavaScript implementation with no dependencies

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Custom CSS with terminal-themed design
- **Deployment**: Vercel

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Bogdusik/CoderType.git
   cd CoderType
   ```

2. **Open in browser:**
   Simply open `index.html` in your web browser, or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```
   Application will be available at `http://localhost:8000`

> **Note**: This is a static website with no build process or dependencies required.

## Project Structure

```
CoderType/
├── index.html                  # Main HTML file
├── index.js                    # Main game logic
├── editor.js                   # Code editor functionality
├── terminal.js                 # Terminal interface
├── keyboard.js                 # Keyboard visualization
│
├── data/                       # Code Snippets
│   ├── index.js               # Main data file
│   ├── react.js               # React code snippets
│   ├── linux.js               # Linux commands
│   └── tensortflow.js         # TensorFlow code
│
├── styles/                     # CSS Styles
│   ├── index.css              # Main styles
│   ├── reset.css              # CSS reset
│   └── theme.css              # Theme styles
│
├── images/                     # Static Assets
│   └── apple-touch-icon.png
│
└── [config files]             # Configuration files
```

## What I Learned

- **Vanilla JavaScript**: Built complete game logic using pure JavaScript without frameworks, understanding DOM manipulation and event handling
- **Game Development**: Implemented typing game mechanics including timer, accuracy calculation, error tracking, and score computation
- **Terminal UI Design**: Created authentic terminal interface using CSS and JavaScript to mimic command-line environment
- **Code Organization**: Structured codebase with modular JavaScript files for maintainability
- **User Experience**: Designed intuitive game flow with clear feedback, replay functionality, and progress tracking
- **Performance**: Optimized real-time typing detection and character matching for smooth gameplay

Fork it, use it, improve it — open to PRs!
