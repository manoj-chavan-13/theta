
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOM+5A2Z5X9C1oAdQzDJJqHcLIX5iWzW32Y1p1D" crossorigin="anonymous">

# Theta by PlayBucket

![image](https://github.com/user-attachments/assets/4a8e9817-b680-448d-9690-0aaf201965b6)

## 🌟 Overview

**Theta** is an intuitive platform designed for downloading YouTube videos seamlessly. With a user-friendly interface, Theta simplifies the process of saving your favorite videos for offline viewing, making it an essential tool for content lovers everywhere. 



## 🚀 Key Features

### 🖥️ User-Friendly Interface
Navigate easily through a clean and straightforward layout, ensuring a hassle-free experience.

### 📥 High Formats
Download videos in High formats and resolutions to suit your preferences. Enjoy high quality on save content!

### 🌍 Open Source
Contribute and collaborate! **Theta** is open to contributions from anyone looking to enhance its functionality. Join the community and help us grow!


## 🎥 Live Demo

Explore Theta in action here: [theta-bucket.vercel.app](https://theta-bucket.vercel.app/)



## Installation

To run **Theta** locally, follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (version 14 or higher)
- **npm** (Node package manager)

### Steps to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/manoj-chavan-13/theta.git
   cd theta
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the project**:
   ```bash
   npm start
   ```

4. Open your web browser and go to `http://localhost:3000` to start using the application.

## Common Issues

While **Theta** operates smoothly on localhost, users may encounter issues when deploying on platforms like Vercel. Common errors include:

- **Bot Verification Error**: Users may receive a message prompting them to sign in or verify that they are not a bot due to various deployment restrictions.

### Troubleshooting Tips

If you experience any issues, consider the following:

1. **Check the Console**: Look for error messages in your browser's console to diagnose problems.
2. **Network Issues**: Ensure you have a stable internet connection and that there are no network restrictions affecting the application.

If issues persist, please report them on our [GitHub Issues page](https://github.com/manoj-chavan-13/theta/issues).

## Contribution

We welcome and encourage contributions to **Theta**! To get involved, please follow these steps:

1. **Fork the repository**: Click the "Fork" button on the repository page.
2. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**: Edit the code and test your modifications locally.
4. **Commit your changes**:
   ```bash
   git commit -m "Brief description of your changes"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request**: Navigate to the original repository and submit a new Pull Request, detailing your changes.



## 📦 Dependencies

**Theta** utilizes several key packages to enhance its functionality. Below is a list of the packages used, their purposes, and basic usage instructions:

### Package List

- **[@distube/ytdl-core](https://www.npmjs.com/package/@distube/ytdl-core)**
  - **Purpose**: Used for downloading YouTube videos.
  - **Usage**: Import the package to handle video downloads. Example:
    ```javascript
    import ytdl from "@distube/ytdl-core";
    ```

- **[@ffmpeg/ffmpeg](https://www.npmjs.com/package/@ffmpeg/ffmpeg)**
  - **Purpose**: Provides FFmpeg functionalities for video processing, allowing you to manipulate audio and video files easily.
  - **Usage**: Import and use FFmpeg to process media files. Example:
    ```javascript
    import ffmpeg from "fluent-ffmpeg";
    ```

- **[body-parser](https://www.npmjs.com/package/body-parser)**
  - **Purpose**: Middleware for parsing incoming request bodies in a middleware before your handlers, available under the `req.body` property.
  - **Usage**: Use this middleware to parse JSON bodies:
    ```javascript
    app.use(bodyParser.json());
    ```

- **[cors](https://www.npmjs.com/package/cors)**
  - **Purpose**: Middleware for enabling Cross-Origin Resource Sharing (CORS), allowing your application to communicate with resources from different origins.
  - **Usage**: Enable CORS with:
    ```javascript
    import cors from "cors";
    app.use(cors());
    ```

- **[express](https://www.npmjs.com/package/express)**
  - **Purpose**: A web framework for Node.js, used to build the application and handle routing.
  - **Usage**: Create an Express application:
    ```javascript
    import express from "express";
    const app = express();
    ```

- **[ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static)**
  - **Purpose**: Provides a static FFmpeg binary for easy use in your application without needing to install FFmpeg separately.
  - **Usage**: Set the path to the FFmpeg binary:
    ```javascript
    import ffmpegPath from "ffmpeg-static";
    ffmpeg().setFfmpegPath(ffmpegPath);
    ```

- **[fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg)**
  - **Purpose**: A wrapper around FFmpeg that makes it easier to work with video and audio processing in Node.js.
  - **Usage**: Use this package for fluent API calls to FFmpeg:
    ```javascript
    ffmpeg()
      .input("video.mp4")
      .output("output.mp4")
      .run();
    ```

- **[mergerino](https://www.npmjs.com/package/mergerino)**
  - **Purpose**: A tool for merging media files, allowing you to combine different audio or video streams.
  - **Usage**: Utilize this package for merging functionalities as required in your application.

- **[mp4box](https://www.npmjs.com/package/mp4box)**
  - **Purpose**: Used for MP4 media manipulation, enabling you to edit and manage MP4 files.
  - **Usage**: Import and use it as needed for MP4 file operations.

- **[ytdl-core](https://www.npmjs.com/package/ytdl-core)**
  - **Purpose**: Library to download YouTube videos, providing options for formats and qualities.
  - **Usage**: Similar to `@distube/ytdl-core`, you can use it to handle video downloads.

### Installation

To install the dependencies, run:

```bash
npm install @distube/ytdl-core @ffmpeg/ffmpeg body-parser cors express ffmpeg-static fluent-ffmpeg mergerino mp4box ytdl-core
```

This will install all the necessary packages for **Theta** to function properly.



## License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions, issues, or feedback, please feel free to raise an issue on the 
<a href="https://github.com/manoj-chavan-13/theta/issues" style="text-decoration: none;">
    <span style="color: #333;">
        <i class="fa fa-github" aria-hidden="true" style="margin-right: 5px;"></i> 
        GitHub Repository
    </span>
</a> 
or connect with me on LinkedIn: 
<a href="https://www.linkedin.com/in/manoj-chavan-1311" style="text-decoration: none;">
    <span style="color: #0077B5;">
        <i class="fa fa-linkedin" aria-hidden="true" style="margin-right: 5px;"></i> 
        manoj-chavan-1311
    </span>
</a>.

---

Thank you for exploring **Theta**! We hope you find it useful for effortlessly downloading your favorite YouTube videos. Happy downloading!

