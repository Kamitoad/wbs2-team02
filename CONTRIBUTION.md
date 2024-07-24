# Contribution

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
  
- Run the nest.js Server by running following command:
    ```
    npm run start
    ```

- To test both client and server functionalities the nest.js server runs with the current state of the website under:
    ```
    localhost:3000
    ```

- Swagger server documentation and server tests are accessible with:
    ```
    localhost:3000/api
    ```