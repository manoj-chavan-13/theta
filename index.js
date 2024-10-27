import express from "express";
import bodyParser from "body-parser";
import ytdl from "@distube/ytdl-core";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

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

// Function to download audio
const downloadAudio = async (videoURL) => {
  const audioFilePath = path.join(__dirname, "audio.mp3"); // Path to save audio
  const audioStream = ytdl(videoURL, {
    filter: (format) => format.hasAudio,
    quality: "highest",
  });
  return new Promise((resolve, reject) => {
    audioStream
      .pipe(fs.createWriteStream(audioFilePath))
      .on("finish", () => {
        console.log("Audio download complete!");
        resolve(audioFilePath);
      })
      .on("error", (err) => {
        console.error("Error downloading audio:", err);
        reject(err);
      });
  });
};

// Function to download video
const downloadVideo = async (videoURL) => {
  const videoFilePath = path.join(__dirname, "video.mp4"); // Path to save video
  const videoStream = ytdl(videoURL, {
    filter: (format) => format.hasVideo,
    quality: "highestvideo",
  });
  return new Promise((resolve, reject) => {
    videoStream
      .pipe(fs.createWriteStream(videoFilePath))
      .on("finish", () => {
        console.log("Video download complete!");
        resolve(videoFilePath);
      })
      .on("error", (err) => {
        console.error("Error downloading video:", err);
        reject(err);
      });
  });
};

// Function to combine audio and video
const combineAudioVideo = async (audioFilePath, videoFilePath, title) => {
  const outputFilePath = path.join(__dirname, `${title}.mp4`); // Path for the final output using video title
  return new Promise((resolve, reject) => {
    ffmpeg()
      .setFfmpegPath(ffmpegPath)
      .input(videoFilePath)
      .input(audioFilePath)
      .outputOptions("-c:v copy")
      .outputOptions("-c:a aac")
      .output(outputFilePath)
      .on("end", () => {
        console.log("Merging finished! Output saved to:", outputFilePath);
        resolve(outputFilePath);
      })
      .on("error", (err) => {
        console.error("Error during merging:", err);
        reject(err);
      })
      .run();
  });
};

// Function to delete specific files after a delay
const deleteFilesAfterDelay = (filePaths, delay) => {
  setTimeout(() => {
    filePaths.forEach((filePath) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}:`, err);
        } else {
          console.log(
            `File deleted after ${delay / 1000} seconds: ${filePath}`
          );
        }
      });
    });
  }, delay);
};

// Endpoint to handle download requests
app.post("/download", async (req, res) => {
  const { videoURL } = req.body;

  try {
    const info = await ytdl.getInfo(videoURL); // Fetch video info
    const title = info.videoDetails.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase(); // Clean title for filename

    const audioFilePath = await downloadAudio(videoURL);
    const videoFilePath = await downloadVideo(videoURL);
    const outputFilePath = await combineAudioVideo(
      audioFilePath,
      videoFilePath,
      title
    );

    // Respond with the output file path for download
    res.json({
      success: true,
      outputFile: `/download/${path.basename(outputFilePath)}`,
    });

    // Schedule deletion of the temporary audio and video files after 10 minutes
    deleteFilesAfterDelay(
      [audioFilePath, videoFilePath, outputFilePath],
      10 * 60 * 1000
    );
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Endpoint to serve the output file for download
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Could not download the file.");
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
