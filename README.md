# project1
## Code Style

Code style is enforced through our ESLint config (`eslint.config.mjs`) - using ESLint's recommended rules plus `eslint-plugin-react`'s recommended rules, and Prettier (`.prettierrc`) for formatting. ESLint checks for common bugs and bad patterns; Prettier automatically formats code (quotes, indentation, spacing) so formatting isn't a point of discussion in code review.

### Editor Setup (VS Code)

1. Install the following extensions:
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
   - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
2. No further configuration is needed — formatting on save and lint checks are already configured via the repo's `.vscode/settings.json`. VS Code may prompt you to install the recommended extensions on opening the project; accept the prompt.
3. If you are not using VS Code, run the following before pushing:

\`\`\`bash
npm install
npm run lint      # check for lint errors
npm run format    # auto-format all files
\`\`\`

Please run `npm run lint` and `npm run format` before opening a pull request.
