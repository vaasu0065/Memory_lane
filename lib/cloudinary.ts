import { v2 as cloudinary } from "cloudinary";

// We explicitly configure it here to ensure Next.js passes the env var correctly
cloudinary.config({
  secure: true,
  url: process.env.CLOUDINARY_URL
});

export function getCloudinarySignature(folder: string) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // We specify any upload parameters we want to enforce
  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinary.config().api_secret!
  );

  return {
    timestamp,
    signature,
    apiKey: cloudinary.config().api_key!,
    cloudName: cloudinary.config().cloud_name!,
  };
}
