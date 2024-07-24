# Coding Guidelines

## Variable Naming Conventions

- Use camelCase for variable names: `matchPoints`, `userId`, `currentUser`, etc.
- Use declarative names for IDs, both in frontend and backend:
  ```typescript
  User.ts:
  
  userId: number,
  userName: string,
  ...
  
  Game.ts:
  gameId: Number,
  changeEloPlayer1: number,
  ...

## Code Indentation

- Use 2 spaces for indentation (4 spaces are too spread out).

## Code Wrapping

- Aim to wrap code before the first visual guideline (80 characters).
- If necessary, wrap before the second visual guideline (120 characters).

## Component Nesting

- Nest components within each other if they only appear within another component:

    ```typescript
    /components
    |--/profile
    |----/user-description
    |----/user-edit
    |--/productsPage
    |----/filter
    |----/productGrid

## Client-Side Logic

- Store main logic in services for easy access by other components.
- Avoid prop drilling as much as possible (if not at all).

## Server Logic

- The server contains the majority of the logic and handles all errors it can respond to.
- The client receives only the responses/bodies from the server and determines how to handle them.
- The server dictates the behavior of the client, ensuring security and simplifying the frontend.

## Routing

- Use Angulars routerLink="/" for navigation within the application:
  ```html
  Use:
  <a routerLink="/profile">

- Do not use "href=/" attributes for navigation as it is inefficient within the Angular Framework:
  ```html
  Don't use:
  <a href="/profile">
  
  <router-outlet></router-outlet>

## Function Size

- Keep functions concise.
- If a function becomes too large, break it into smaller private sub-functions.

## CSS Usage

- Use a global style.css file for most CSS.
- Use component-specific CSS files (xy.component.css) only to override certain properties.
- Example: A delete button that is likely to be used multiple times.

## Commit Messages

- Use meaningful commit messages:
    ```typescript
  Added profile.component and finished profile.component.html and .css
  additionaly cleared up the global styles.css 

- Avoid messages such as "Kein Bock mehr lul, Jesus Christ..."

## REST Routes

- Prefix REST routes with /api.

### Example Backend Route for Creating a User
    CREATE localhost:8080/api/user

### Example Frontend Route for Profile Page

    localhost:8080/profile

## Swagger Attributes

- After completing backend work, add corresponding Swagger attributes for clear interface representation.

## Password Security

- Store passwords in the database in hashed form.






