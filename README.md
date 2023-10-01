# Video Chunk Upload and Merge App

This Node.js and Express.js application allows you to upload video chunks from the front end at intervals. The server stores these chunks as blobs in a folder. The application also provides an endpoint to retrieve a list of videos with unique IDs and URLs.

## Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/ayhameed/video-streaming-endpoint.git
    cd your-repo
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Create Environment Variables**

    Create a `.env` file in the root of your project and add the following:

    ```env
    PORT=3000
    BASE_URL=http://localhost:3000
    ```

    Adjust the `PORT` value if necessary.

4. **Run the Application**

    ```bash
    npm start
    ```

    The application will start, and you can access it at `http://localhost:3000`.

## Usage

- **Upload Video Chunks:**
  - Send video chunks to the `/api/videos/save` endpoint using a POST request.

- **Retrieve List of Videos:**
  - Access the list of videos with unique IDs and URLs by making a GET request to `/api/videos/getAll`.

## Folder Structure

```plaintext
project-root
|-- src
|   |-- controllers
|   |   |-- videoController.js
|   |-- routes
|   |   |-- videoRoutes.js
|   |-- utils
|   |   |-- errorHandler.js
|   |-- uploads
|-- app.js
|-- .env
|-- .gitignore
|-- package.json
|-- README.md

**Contributing**
If you'd like to contribute to this project, feel free to submit a pull request.

**License**
This project is licensed under the MIT License - see the LICENSE file for details.

