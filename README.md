## Code Style and Quality Tools

This project uses ESLint and Prettier to keep JavaScript and React code consistent across all team members.

We use the [Airbnb JavaScript and React Style Guide](https://airbnb.io/javascript/react/) as a general reference. The Prettier configuration and rules below are the final style decisions for this project.

### Required Setup

After cloning the repository, install all project dependencies:

npm install

Each contributor should also install these VS Code extensions:

- Prettier - Code formatter
- ESLint
  In VS Code settings:

1. Enable Format On Save.
2. Set Prettier - Code formatter as the default formatter.
   This automatically formats code whenever a file is saved and shows ESLint warnings/errors while editing.

Commands
Run the following commands from the project folder:
npm run lint

Checks JavaScript and React code for potential errors and code-quality issues.
npm run format

Automatically formats project files with Prettier.
npm run format:check

Checks whether files are already formatted correctly without changing them.
Before pushing code to GitHub, contributors should run:
npm run lint
npm run format

Formatting Rules
Prettier automatically applies the following formatting rules:

- Use double quotes for strings.
- Use semicolons at the end of JavaScript statements.
- Use 2 spaces for indentation.
- Keep lines at approximately 100 characters or fewer.
- Use trailing commas in multiline objects and arrays where JavaScript allows them.
- Put spaces inside object braces, such as { name: "Dillon" }.
- Always use parentheses around arrow-function parameters.
- Use consistent LF line endings to avoid unnecessary Git changes between Windows and Mac computers.

Naming Conventions

- Use PascalCase for React component names and component files, such as RestaurantCard.jsx.
- Use camelCase for variables and functions, such as averageRating and getRestaurantRating().
- Name boolean variables beginning with is, has, or can, such as isLoading, hasReviews, or canSubmit.
- Use UPPER_SNAKE_CASE only for values that truly never change, such as MAX_RATING.
- Use const by default. Use let only when a variable needs to change.
- Use lowercase, hyphenated CSS class names, such as restaurant-card.

Team Expectation
All team members should have ESLint and Prettier set up before contributing code. This keeps the codebase readable, consistent, and easier to review.
