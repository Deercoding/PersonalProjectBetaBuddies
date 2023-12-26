import path from "path";
import fs from "fs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// upload object
export async function uploadObject(bucketName, imageFiles, REGION, toFolder) {
  const client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESSKEY,
      secretAccessKey: process.env.S3_SECRETACCESSKEY,
    },
  });
  const params = imageFiles.map((image) => {
    return {
      Bucket: bucketName,
      Key: image.filename,
      Body: fs.createReadStream(
        path.resolve(toFolder, "..//public//images//", image.filename) + ""
      ),
    };
  });
  try {
    let data = await Promise.all(
      params.map((uploadParam) =>
        client.send(new PutObjectCommand(uploadParam))
      )
    );
    console.log("Image uploaded successfully:", data);
    return data;
  } catch (err) {
    console.error("Error uploading image", err);
  }
}

// upload video
export async function uploadVideoS3(
  bucketName,
  oneVideo,
  videoSaveName,
  REGION,
  toFolder
) {
  const client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESSKEY,
      secretAccessKey: process.env.S3_SECRETACCESSKEY,
    },
  });

  const params = {
    Bucket: bucketName,
    Key: videoSaveName,
    Body: fs.createReadStream(
      path.resolve(toFolder, "..//public//videos//", oneVideo.filename) + ""
    ),
  };

  try {
    let data = await client.send(new PutObjectCommand(params));
    console.log("Video uploaded successfully:", data);
    return data;
  } catch (err) {
    console.error("Error uploading video", err);
  }
}

// upload video
export async function uploadObjectGame(
  bucketName,
  imageFiles,
  REGION,
  toFolder
) {
  const client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESSKEY,
      secretAccessKey: process.env.S3_SECRETACCESSKEY,
    },
  });

  const resultArray = [
    ...imageFiles.main_image,
    ...imageFiles.second_image,
    ...imageFiles.advertise_image,
  ];
  const params = resultArray.map((image) => {
    return {
      Bucket: bucketName,
      Key: image.filename,
      Body: fs.createReadStream(
        path.resolve(toFolder, "..//public//images//", image.filename) + ""
      ),
    };
  });
  try {
    let data = await Promise.all(
      params.map((uploadParam) =>
        client.send(new PutObjectCommand(uploadParam))
      )
    );
    console.log("Image uploaded successfully:", data);
    return data;
  } catch (err) {
    console.error("Error uploading image", err);
  }
}
