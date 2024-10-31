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
app.use(express.static("public"));

// Serve index.html at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Redirect requests for index.html to /
app.get("/index.html", (req, res) => {
  res.redirect("/");
});

// Validate URL format
const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Function to download audio
const downloadAudio = async (videoURL) => {
  if (!ytdl.validateURL(videoURL)) {
    throw new Error("Invalid YouTube URL");
  }

  const audioFilePath = path.join(__dirname, "audio.mp3");
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
        reject(new Error("Failed to download audio. Please try again."));
      });
  });
};


// Function to download video
const downloadVideo = async (videoURL) => {
  if (!ytdl.validateURL(videoURL)) {
    throw new Error("Invalid YouTube URL");
  }

  const videoFilePath = path.join(__dirname, "video.mp4");
  const videoStream = ytdl(videoURL, {
    filter: (format) => format.hasVideo,
    quality: "highestvideo",
    requestOptions: {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
      },
    },
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
          reject(new Error("Failed to download video. Please try again."));
      });
  });
};

// Function to combine audio and video
const combineAudioVideo = async (audioFilePath, videoFilePath) => {
  const outputFilePath = path.join(__dirname, "output.mp4");
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
        reject(new Error("Failed to combine audio and video. Please try again."));
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
          console.log(`File deleted after ${delay / 1000} seconds: ${filePath}`);
        }
      });
    });
  }, delay);
};

// Endpoint to handle download requests
app.post("/download", async (req, res) => {
  const { videoURL } = req.body;

  if (!isValidURL(videoURL)) {
    return res.status(400).json({ success: false, message: "Invalid URL format. Please enter a valid URL." });
  }

  try {
    const audioFilePath = await downloadAudio(videoURL);
    const videoFilePath = await downloadVideo(videoURL);
    const outputFilePath = await combineAudioVideo(audioFilePath, videoFilePath);

    res.json({
      success: true,
      outputFile: `/download/${path.basename(outputFilePath)}`,
    });

    deleteFilesAfterDelay([audioFilePath, videoFilePath, outputFilePath], 10 * 60 * 1000);
  } catch (error) {
    console.error("Error processing download request:", error.message || error);
    const message = "An error occurred while processing your request. Please try again.";
    res.status(500).json({ success: false, message });
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
