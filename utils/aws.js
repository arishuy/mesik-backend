import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const uploadAudio = (filename, file) => {
  return new Promise((resolve, reject) => {
    const params = {
      Key: filename,
      Bucket: "mesickaudio",
      Body: file,
      ContentType: "audio/mpeg",
      ACL: "public-read",
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

export { uploadAudio };
