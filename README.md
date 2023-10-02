# Video Chunk Upload and Merge App

This Node.js and Express.js application allows you to upload video chunks from the front end at intervals. The server stores these chunks as blobs in a folder. The application also provides an endpoint to retrieve a list of videos with unique IDs and URLs.

## Table of Contents

- [Setup](#setup)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [API](#api)
- [Response Format](#response-format)
- [Methods](#methods)
- [Contributing](#contributing)
- [License](#license)

## Setup

1. **Clone the Repository**

    ```bash
    git clone https://github.com/ayhameed/video-streaming-endpoint.git
    cd repo
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
    Change the `BASE_URL` value if needed.

4. **Run the Application**

    ```bash
    npm start
    ```

    The application will start, and you can access it at `http://localhost:3000`.

## Dependencies 
- Node.js
- Express.js
- Multer
- Fluent-ffmpeg
- EJS

## Usage

- ### Upload Video:
    - Navigate to the homepage http://localhost:3000.
    - Choose a video file and assign a name (ID) to the video.
    - Click "Upload Video."

- ### View Uploaded Videos:
    - Navigate to http://localhost:3000/videos.
    - Explore the list of uploaded videos.

- ### Play Video:
    - Click on the video name to open a new tab and play the video.

## API
### Method
- **POST**

#### Endpoint
- `/saveVideo`

#### Request Parameters
- **video**: The video file (MP4 format) to be uploaded. (In the request body, using `multipart/form-data`)
- **videoName**: The name (ID) to be assigned to the video. (In the request body, using `multipart/form-data`)

#### Response
- **Success (Status Code: 200 OK)**
  - **Content-Type**: `application/json`
  - **Body**: JSON object with properties:
    - `success`: `true`
    - `message`: A success message.
    - `fileName`: The filename of the uploaded video.
    - `date`: The timestamp of the upload.

- **Error (Status Code: 500 Internal Server Error)**
  - **Content-Type**: `application/json`
  - **Body**: JSON object with properties:
    - `success`: `false`
    - `message`: An error message.

#### Example
```bash
curl -X POST -F "video=@video.mp4" -F "videoName=MyVideo" http://localhost:3000/saveVideo
```

### Success Resonse :( Status 200 OK)
```json
    {
    "success": true,
    "message": "Video uploaded successfully",
    "fileName": "video_merged_base64.blob",
    "date": "2023-10-02T00:01:27.174Z"
    }
```
### Error Response (Status: 500 Internal Server Error):
```json
    {
    "success": false,
    "message": "Error uploading video: <error message>"
    }
```

### Get All Videos (/videos)
#### Method
- **GET**

#### Endpoint
- `/videos`

#### Response
- **Success (Status Code: 200 OK)**
    - `Content-Type`: application/json or text/html
    - `Body`: JSON object with properties:
    - `videos`: An array of video objects, each containing name, url, and base64Data.

- **Example**
```bash
    curl -X GET http://localhost:3000/videos
```

- **Error (Status Code: 500 Internal Server Error)**
    - `Content-Type`: application/json or text/plain
    - `Body`: JSON object with properties:
    - `success`: `false`
    - `message`: An error message.

## Contribution
To contribute to this, make a PR request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.