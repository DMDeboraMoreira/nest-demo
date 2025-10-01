import { v2 } from 'cloudinary';
import { config as dotenvConfig } from 'dotenv';

//npm i cloudinary buffer-to-stream

dotenvConfig({ path: ".env.development" });

export const Cloudinary = {
    provide: 'CLOUDINARY',
    useFactory: () => {
        return v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    },
}