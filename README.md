# SLOFoods

[![CI Testing](https://github.com/git2work-team/project1/actions/workflows/ci-testing.yml/badge.svg)](https://github.com/git2work-team/project1/actions/workflows/ci-testing.yml)
[![Deploy to Azure](https://github.com/git2work-team/project1/actions/workflows/main_slofoods.yml/badge.svg)](https://github.com/git2work-team/project1/actions/workflows/main_slofoods.yml)

SLOFoods is a web app for Cal Poly students to find restaurants on and off campus, read and write reviews with photos, and save places they want to try.

## Deployed App

- Frontend: https://slofoods-frontend-c6h7bnaccbe8g4hx.belgiumcentral-01.azurewebsites.net
- Backend API: https://slofoods-d4gbfph3eaczcegh.belgiumcentral-01.azurewebsites.net

## CI/CD

- **CI Testing** (`.github/workflows/ci-testing.yml`) runs on every push to `main`. It installs dependencies with `npm ci`, lints the backend and frontend, builds the frontend, and runs the backend tests.
- **Deploy to Azure** (`.github/workflows/main_slofoods.yml`) runs on every push to `main`. It runs the backend tests, then deploys only the `packages/express-backend` folder to an Azure Web App.
- **Deploy frontend** (`.github/workflows/frontend_slofoods.yml`) runs on every push to `main`. It builds `packages/react-frontend` and deploys the `dist` folder to a second Azure Web App, which serves it with `pm2 serve`. (Azure Static Web Apps are not available in the regions our student subscriptions allow.) Production builds read the backend URL from `packages/react-frontend/.env.production`, and `npm run dev` uses `http://localhost:8000`.

## Running Locally

1. Install dependencies from the project root: `npm install`
2. Create `packages/express-backend/.env` with `MONGODB_URI`, `JWT_SECRET` (at least 32 characters), `GOOGLE_CLIENT_ID`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`. Never commit this file.
3. Start the backend: `npm run dev -w express-backend` (port 8000)
4. Start the frontend: `npm run dev` (port 5173)
5. Run the backend tests: `npm test -w express-backend`

## Figma Storyboard Link

https://www.figma.com/design/r69OzTUJHwbV4n88coYpSb/3100-Project?node-id=0-1&t=N1Dm5d8RDRSwiGb0-1

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
