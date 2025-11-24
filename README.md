# Widget Trial

This project contains an embeddable chat widget and a Cloudflare Worker backend.

## Project Structure

- `widget.js`: The standalone widget script (Vanilla JS, Shadow DOM).
- `worker.js`: The Cloudflare Worker script (Backend).
- `index.html`: A demo page showing the widget in action.
- `wrangler.toml`: Configuration for Wrangler.

## Setup Instructions

1.  **Install Dependencies**:
    Ensure you have Node.js installed. Then run:

    ```bash
    npm install
    ```

2.  **Start the Backend (Worker)**:
    Run the following command to start the local development server for the worker:

    ```bash
    npm start
    ```

    _Or directly: `npx wrangler dev worker.js`_

    This will start the server at `http://localhost:8787`.

3.  **Run the Demo**:
    Open `index.html` in your browser.
    _Note: You can simply double-click the file, or serve it with a local server like `npx serve .`_

## Usage

To embed this widget on any page:

1.  Add the container div:

    ```html
    <div id="cr-widget"></div>
    ```

2.  Include the script:

    ```html
    <script src="path/to/widget.js"></script>
    ```

3.  Initialize the widget:
    ```javascript
    CRWidget.init({
      apiUrl: "http://localhost:8787/api/widget",
    });
    ```

## Features

- **Shadow DOM**: Complete CSS isolation. No styles leak in or out.
- **Vanilla JS**: No framework dependencies (React, Vue, etc.).
- **Responsive**: Fixed position bubble and chat window.
- **Backend**: Handles POST requests and returns a JSON reply.
