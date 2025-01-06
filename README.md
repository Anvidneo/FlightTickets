
# FlightTickets

This is a code on NodeJs and Express, using libraries like JWT, PDFKit, TypeORM, Bcrypt, Data-Source. The objective is genererate a PDF ticket with the informaction of flights.

## Table of Contents

- [Installation](#installation)
- [Running the API](#running-the-api)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation 💻

1. **Clone the repository**

    ```bash
    git clone https://github.com/Anvidneo/FlightTickets
    cd FlightTickets
    ```

2. **Install dependencies** 

    Make sure you have [Node.js](https://nodejs.org/) installed. Then run:

    ```bash
    npm install
    ```

3. **Set up environment variables**

    Create a `.env` file in the root directory of your project and configure the necessary environment variables. Like the .env.example exist on root directory

    On src/config/ create a file with name data-source.js like the example on the same foldee, change the data with information shared with you.


## Running the API 🏃🏼‍♂️

1. **Start the server**

   - **For development**: Start the server with `nodemon`, which automatically restarts when file changes are detected.

     ```bash
     npm run dev
     ```

   - **For production**: Start the server in production mode.

     ```bash
     npm start
     ```

   By default, the API will be accessible at `http://localhost:3000/`.

3. **Accessing the API**

    Once the server is running, you can access the API at the following URL:

    ```plaintext
    http://localhost:3000/
    ```

    Replace `3000` with the port number you've specified in your `.env` file if it's different.

## API Endpoints 📥

Document the available API endpoints with their respective HTTP methods, paths, and a brief description of their functionality. For example:

- `POST /api/v1/auth/login` - Login and get new token.
- `POST /api/v1/ticket/generate` - Create a pdf with parameters received .

