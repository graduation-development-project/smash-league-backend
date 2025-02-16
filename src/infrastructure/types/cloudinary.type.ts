import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

export type TCloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
