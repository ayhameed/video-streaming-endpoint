const express = require('express');
const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');
const ejs = require('ejs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

const uploadDir = path.join(__dirname, 'uploads');

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Serve static files
app.use(express.static('public'));

// Set up a route for the root path to serve index.ejs
app.get('/', (req, res) => {
  res.render('index', { message: req.query.message || '' }); // Render index.ejs with a message
});

// Set up a route for the videos page to serve videos.ejs
app.get('/videos', async (req, res) => {
  try {
    const files = await fs.readdir(uploadDir);

    // Create an array of video objects with name and url
    const videos = await Promise.all(
      files.map(async (file, index) => {
        const videoId = file.replace('_merged_base64.blob', ''); // Extract video ID from the file name
        const base64FilePath = getBase64VideoPath(videoId);
        const base64Data = await fs.readFile(base64FilePath, 'utf-8');
        const videoUrl = `/getVideo/${videoId}`;
        return { name: `Video ${index + 1}`, url: videoUrl, base64Data };
      })
    );

    res.render('videos', { videos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving videos.');
  }
});

// Handle file upload
app.post('/saveVideo', upload.single('video'), async (req, res) => {
  try {
    const { videoName } = req.body;
    const videoId = videoName.toLowerCase().replace(/\s+/g, '_');

    if (!req.file || path.extname(req.file.originalname).toLowerCase() !== '.mp4') {
      throw new Error('Invalid file format. Please upload an MP4 file.');
    }

    await saveVideoChunks(videoId, req.file.buffer);

    const base64MergedVideo = await mergeChunks(videoId);

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      fileName: `${videoId}_merged_base64.blob`,
      date: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: `Error uploading video: ${error.message}` });
  }
});

// Helper function to save video chunks as base64
const saveVideoChunks = async (videoId, buffer) => {
  const base64Data = buffer.toString('base64');
  const base64FileName = `${videoId}_base64.blob`;
  const base64FilePath = path.join(uploadDir, base64FileName);
  await fs.writeFile(base64FilePath, base64Data);
};

// Helper function to merge video chunks and return base64 encoded content
const mergeChunks = async (videoId) => {
  const files = await fs.readdir(uploadDir);
  const base64Contents = await Promise.all(
    files
      .filter((file) => file.startsWith(`${videoId}_base64`))
      .map(async (file) => {
        const base64Data = await fs.readFile(path.join(uploadDir, file), 'utf-8');
        return base64Data;
      })
  );

  // Combine base64 chunks
  const base64Merged = base64Contents.join('');
  const base64MergedFileName = `${videoId}_merged_base64.blob`;
  const base64MergedFilePath = path.join(uploadDir, base64MergedFileName);
  await fs.writeFile(base64MergedFilePath, base64Merged);

  // Remove individual base64 chunk files
  await Promise.all(
    files
      .filter((file) => file.startsWith(`${videoId}_base64`))
      .map((file) => fs.unlink(path.join(uploadDir, file)))
  );

  return base64Merged;
};

// Helper function to convert base64 video back to MP4
const getBase64VideoPath = (videoId) => {
  return path.join(uploadDir, `${videoId}_merged_base64.blob`);
};

app.get('/getVideo/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const base64FilePath = getBase64VideoPath(videoId);

    // Read the file and send it as a response
    const base64Data = await fs.readFile(base64FilePath, 'utf-8');
    res.setHeader('Content-Type', 'video/mp4');
    res.send(Buffer.from(base64Data, 'base64'));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving video.');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
