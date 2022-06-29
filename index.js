// import captureWebsite from 'capture-website';
// import {setWallpaper,getWallpaper} from 'wallpaper';
// import fs from 'fs';
// import cron from 'node-cron';



// await captureWebsite.file('https://pieterbrandsen.github.io/GrachenWebcamBackground/', 'background.png',{defaultBackground:false,beforeScreenshot: async (page, browser) => {
//     await new Promise(r => setTimeout(r, 1000));
// }});

// await setWallpaper('background.png');
// // await getWallpaper();

const fs = require("fs");
const nodeHtmlToImage = require("node-html-to-image");
const wallpaper = require("wallpaper");
const cron = require("node-cron");
const { v4: uuidv4 } = require("uuid");

// Read html file
const html = fs.readFileSync("./index.html", function (err, html) {
  if (err) {
    throw err;
  }
  return html;
});
// Running every 5 minutes
cron.schedule("0/5 * * * *", () => {
  // Generate a unique name for new wallpaper
  const imgPath = `./grachenBackground${uuidv4()}.png`;

  // Create image from html file
  nodeHtmlToImage({
    output: imgPath,
    html: html.toString("utf-8"),
  }).then(() => {
    console.log("The image was created successfully!");
    //Remove last wallpaper image file if exists
    wallpaper.get().then((oldFile) => {
      if (oldFile.includes("grachenBackground")) {
        fs.unlink(oldFile, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("Last image successfully removed");
        });
      }
    });

    // Set wallpaper with new image
    wallpaper.set(imgPath).then((err) => {
      console.log("Wallpaper set successfully");
    });
  });
});