import { saveAs } from "file-saver";
import axios from "axios";

export const downloadImage = async (src: string) => {
  try {
    const response = await axios.get(src, {
      responseType: "blob",
    });
    const fileName = src.substring(src.lastIndexOf("/") + 1);
    saveAs(response.data, fileName);
  } catch (error) {
    console.error("Image download failed", error);
  }
};

export const copyImageToClipboard = async (src: string) => {
  try {
    const response = await axios.get(src, { responseType: "blob" });
    const blob = response.data;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = await createImageBitmap(blob);
    canvas.width = image.width;
    canvas.height = image.height;
    if (ctx) {
      ctx.drawImage(image, 0, 0);
    }

    canvas.toBlob(async (newBlob) => {
      if (newBlob) {
        const clipboardItem = new ClipboardItem({ [newBlob.type]: newBlob });
        await navigator.clipboard.write([clipboardItem]);
        console.log("image copied successfully!");
      }
    }, blob.type);
  } catch (err) {
    console.error("Failed to copy on clipboard", err);
  }
};
