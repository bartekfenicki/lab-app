import multer from "multer";

const storage = multer.diskStorage({}); // temporary storage
export const upload = multer({ storage });