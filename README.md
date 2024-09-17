# Scan Content Changes-TS

This project is designed to scan web pages for changes in their content and log these changes in a JSON file. It compares the current content of web pages with previously stored versions, logs any detected changes, and optionally commits these changes to a GitHub repository using the GitHub CLI.

## Features

- Fetches and cleans HTML content from a list of URLs.
- Converts HTML content to a structured JSON format.
- Compares current and previous JSON data to detect changes.
- Logs detected changes in a JSON file.
- Optionally commits the updated content and change log to a GitHub repository using GitHub CLI.

## Prerequisites

- Node.js (v16+)
- TypeScript
- GitHub account with a repository to store the logs and content.
- GitHub Personal Access Token with repo access.

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/rajrayala/Scan-Content-Changes-TS.git
    ```

2. Install the required Node.js packages:

    ```sh
    npm install
    ```

3. Install `ts-node` for running TypeScript directly:

    ```sh
    npm install -g ts-node typescript
    ```

## Usage

1. **Setup environment variables:**

    - `GITHUB_WORKSPACE`: Path to your local GitHub workspace (default is the current directory).
    - `GITHUB_TOKEN`: Your GitHub Personal Access Token.
    - `GITHUB_REPOSITORY`: The name of your GitHub repository (e.g., `your-username/Scan-Content-Changes`).

2. **Prepare the URLs CSV file:**

    Create a file named `urls.csv` in the project directory with a list of URLs to scan. Each URL should be on a new line.

    Example `urls.csv`:
    ```csv
    url
    https://google.com/drive
    https://google.in
    ```

3. **Run the script:**

    ```sh
    ts-node main.ts
    ```

## Project Structure

- `main.ts`: Main script to execute the content scanning and logging process.
- `fetcher.ts`: Module to fetch and clean HTML content from URLs.
- `file_utils.ts`: Utility functions for reading URLs, saving/loading JSON files, and updating the change log.
- `github_utils.ts`: Functions to handle GitHub repository updates using GitHub CLI.
- `compare_json.ts`: Custom functions to serialize and compare JSON data.
- `urls.csv`: CSV file containing the list of URLs to scan.
- `results/`: Directory where JSON files for each URL are stored.
- `change_log.json`: File where detected changes are logged.
- `tsconfig.json`: TypeScript configuration file.

## Example Workflow

1. **Fetch Content:** The script fetches HTML content from the URLs listed in `urls.csv`.
2. **Clean and Convert:** The HTML content is cleaned (scripts and styles removed) and converted to a structured JSON format.
3. **Compare:** The current JSON content is compared with the previously stored version.
4. **Log Changes:** Any detected changes are logged in `change_log.json`.
5. **Commit to GitHub:** The updated JSON content and change log are committed to the specified GitHub repository using GitHub CLI.

## Customization

- **HTML Cleaning:** Modify the `fetchCleanContent` function in `fetcher.ts` to customize the cleaning process.
- **Comparison Logic:** Adjust the `compareJson` function in `compare_json.ts` to change how differences are detected.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## Troubleshooting

- **TypeScript Errors:** Ensure TypeScript is properly installed and you are running the script using `ts-node`.
- **GitHub Commit Issues:** Verify your GitHub token has the necessary permissions and the environment variables are correctly set.
- **Dependencies:** Ensure all required packages are installed by running `npm install`.

## Contact

For any questions or issues, please open an issue on the GitHub repository or contact the project maintainer.
