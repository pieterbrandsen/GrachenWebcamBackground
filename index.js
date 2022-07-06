import captureWebsite from 'capture-website';
import fs from "fs";
import {setWallpaper, getWallpaper} from "wallpaper";
import cron  from "node-cron";
import { v4 as uuidv4 } from "uuid";


const cameraNumbers = [8, 20, 9, 24];
let lastCameraNumberIndex = -1
const getUrl = (webcamNumber) => {
  const dayNumber = new Date().getDate().toString().length === 1 ? `0${new Date().getDate()}` : new Date().getDate();
return `https://www.steinbock77.ch/webcam_${webcamNumber}/bilder/mega${dayNumber}.jpg`;
}


cron.schedule("* * * * *", async () => {
  // Generate a unique name for new wallpaper
  const imgPath = `./grachenBackground${uuidv4()}.png`;

  // Create image from html file
  lastCameraNumberIndex++;
  if (lastCameraNumberIndex >= cameraNumbers.length) lastCameraNumberIndex = 0;
  console.log(`Downloading image from ${getUrl(cameraNumbers[lastCameraNumberIndex])}`);
  await captureWebsite.file(getUrl(cameraNumbers[lastCameraNumberIndex]), imgPath,{beforeScreenshot: async (page, browser) => {
    await new Promise(r => setTimeout(r, 2500));
},styles: [
  `
  img {
    width: 100%;
    height: 100%;
    display: block; /* remove extra space below image */
  }
  `
]});
    console.log("The image was created successfully!");
    //Remove last wallpaper image file if exists
    const oldFile = await getWallpaper()
      if (oldFile.includes("grachenBackground")) {
        fs.unlink(oldFile, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("Last image successfully removed",oldFile);
        });
      }

    // Set wallpaper with new image
    await setWallpaper(imgPath);
      console.log("Wallpaper set successfully",imgPath);
});