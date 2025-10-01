import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';  // 👈 nativo de Node

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error('No result returned from Cloudinary'));
          }
        },
      );

      // 👇 reemplazo de toStream
      Readable.from(file.buffer).pipe(upload);
    });
  }
}





// import { Injectable } from '@nestjs/common';
// import { UploadApiResponse, v2 } from 'cloudinary';


// @Injectable()
// export class CloudinaryService {
//   async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
//     return new Promise((resolve, reject) => {
//       const upload = v2.uploader.upload_stream(
//         { resource_type: 'auto' },
//         (error, result) => {

//           if (error) {
//             reject(error);

//           } else if (result) {
//             resolve(result);
            
//           } else {
//             reject(new Error('No result returned from Cloudinary'));
//           }
//         },
//       );
//       toStream(file.buffer).pipe(upload);
//     });
//   }
// }
