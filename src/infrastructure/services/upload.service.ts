import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { v2 as cloudinary } from "cloudinary";

const streamifier = require("streamifier");

@Injectable()
export class UploadService {
	constructor() {}

	async uploadFiles(
		files: Express.Multer.File[],
		folderName: string,
		prefix: string,
	): Promise<any[]> {
		try {
			const now = new Date();

			const uploadPromises: Promise<any>[] = files.map((file) => {
				return new Promise((resolve, reject) => {
					const uploadStream = cloudinary.uploader.upload_stream(
						{
							resource_type: "auto",
							folder: folderName,
							public_id: `${prefix}-${file.fieldname}-${now.toISOString()}`,
						},
						(error, result) => {
							if (error) return reject(error);
							resolve(result);
						},
					);

					streamifier.createReadStream(file.buffer).pipe(uploadStream);
				});
			});

			return Promise.all(uploadPromises);
		} catch (error) {
			console.error(`Failed to upload files: ${error.message}`, error.stack);
			throw error;
		}
	}
}
