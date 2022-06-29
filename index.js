import captureWebsite from 'capture-website';
import fs from "fs";
import { getWallpaper, setWallpaper } from "wallpaper";
import cron from "node-cron";
import { v4 as uuidv4 } from "uuid";


const cameraNumbers = [8, 20, 9, 24];
let lastCameraNumberIndex = -1;
const getUrl = (webcamNumber) =>
  `https://www.steinbock77.ch/webcam_${webcamNumber}/bilder/mega${new Date().getDate()}.jpg`;

cron.schedule("* * * * *", async () => {
  // Generate a unique name for new wallpaper
  const imgPath = `./grachenBackground${uuidv4()}.png`;

  // Create image from html file
  lastCameraNumberIndex++;
  if (lastCameraNumberIndex >= cameraNumbers.length) lastCameraNumberIndex = 0;
  await captureWebsite.file(getUrl(cameraNumbers[lastCameraNumberIndex]), imgPath, {
    beforeScreenshot: async (page, browser) => {
      await new Promise(r => setTimeout(r, 2500));
    }, width: 1920, height: 1080
  });
  console.log("The image was created successfully!", cameraNumbers[lastCameraNumberIndex]);
  //Remove last wallpaper image file if exists
  getWallpaper().then((oldFile) => {
    if (oldFile.includes("grachenBackground")) {
      fs.unlink(oldFile, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Last image successfully removed", oldFile);
      });
    }
  });

  // Set wallpaper with new image
  setWallpaper(imgPath).then((err) => {
    console.log("Wallpaper set successfully", imgPath);
  });
});