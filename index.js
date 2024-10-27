import express from "express";
import bodyParser from "body-parser";
import ytdl from "@distube/ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for PORT

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files from the 'public' directory

// Serve index.html at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Serve the index.html
});

// Redirect requests for index.html to /
app.get("/index.html", (req, res) => {
  res.redirect("/");
});

// Function to download audio as a stream
const downloadAudio = (videoURL) => {
  return ytdl(videoURL, {
    filter: (format) => format.hasAudio,
    quality: "highest",
  });
};

// Function to download video as a stream
const downloadVideo = (videoURL) => {
  return ytdl(videoURL, {
    filter: (format) => format.hasVideo,
    quality: "highestvideo",
  });
};

// Combine audio and video streams
const combineAudioVideo = (audioStream, videoStream) => {
  return new Promise((resolve, reject) => {
    const outputStream = ffmpeg()
      .setFfmpegPath(ffmpegPath)
      .input(videoStream)
      .input(audioStream)
      .outputOptions("-c:v copy")
      .outputOptions("-c:a aac")
      .format("mp4") // Change to desired output format
      .on("end", () => {
        console.log("Merging finished!");
        resolve(outputStream); // Returning output stream
      })
      .on("error", (err) => {
        console.error("Error during merging:", err);
        reject(err);
      })
      .pipe(); // Use pipe for direct streaming output
  });
};

// Endpoint to handle download requests
app.post("/download", async (req, res) => {
  const { videoURL } = req.body;

  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();

    const audioStream = downloadAudio(videoURL);
    const videoStream = downloadVideo(videoURL);
    const outputStream = await combineAudioVideo(audioStream, videoStream);

    // Set appropriate headers for streaming
    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp4"`);
    outputStream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
