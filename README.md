# Sudoku Game Application

This application allow users to solve Sudoku puzzles and engage in multiplayer puzzle-solving mode, respectively. The project can be deployed using Docker Compose. This repository contains 2 applications `sudoku-app-game` and `sudoku-multiplayer-backend`.

## Start the application

Run `npx nx serve sudoku-app-game` to start the frontend development server. Run `npx nx serve sudoku-multiplayer-backend` to start the backend development server(multiplayer).Happy coding!

## Generate Test Report

Run `nx run-many --all --target=test --codeCoverage` to generate the test coverage report.

## Docker Compose

You can also utilize Docker Compose to start the project. Simply execute the following command in the root directory of the project:

```bash
docker-compose up
```

This command will build and start both `sudoku-app-game` and `sudoku-multiplayer-backend` applications in separate containers.

## Set up CI!

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/nx-cloud/features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

## Explore the project graph

Run `npx nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)

Author: Nipuna Rajapaksha
