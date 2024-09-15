# Contribution

> https://github.com/Kamitoad/wbs2-team02

## How to Start

- Install the necessary npm packages of client and server (by right-clicking the client and server package.json
and then "Run 'npm install'" or via terminal with following commands):
    ```
    cd client
    npm i
  
    cd ..
    cd server
    npm i
    ```

## Client

- To run the client terminal commands, be sure to be in the "client" folder:
- If not navigate from the root folder to "client" run following command:
    ```
    cd client
    ```

- Run the Angular CLI Server to see the client-sided website:
    ```
    npm run start
    ```

- To test the client **without** server functionalities it can be accessed under:
    ```
    localhost:4200
    ```
- It is not advised though, all pages should be tested on a local server <br> <br>

- As Nest.js delivers the static page to the client, it is necessary that Angular builds / exports the page constantly
when changes are being made. This guarantees that the server will always have the recent exported pages from the 
updated client/dist folder.
- Because of this Angular should be run beside the earlier command with following command as well to export
the recent changes constantly:
    ```
    npm run watch
    ```

## Server

- To stay up-to-date build the Angular website with following command if changes to the client have been made (You have to be
in the "client" folder to run this command):
    ```
    npm run build
    ```

- To run the server terminal commands, be sure to be in the "server" folder:
- To navigate from the root folder to "server" run following command:
    ```
    cd server
    ```
  
- To simply run the nest.js Server, do it with following command:
    ```
    npm run start
    ```

- To properly debug the nest.js Server, run following command:
    ```
    npm run start:debug
    ```

- To test both client and server functionalities the nest.js server runs with the current state of the website under:
    ```
    localhost:3000
    ```

- Swagger server documentation and server tests are accessible with:
    ```
    localhost:3000/api
    ```
  
## Database

- At the initial start of the server (or if the Game or User entities are empty), a new database / new data is created.
Data and credentials of these users and games can be seen in:
    ```
    server\src\database\seed-service\seed.service.ts
    ```

- The database itself is saved in:
    ```
    server\db.sqlite
    ```