import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
    MONGO_DB_CON_STR: str(),
    PORT: port(),
    JWT_SECRET: str(),
    CLOUDINARY_API_KEY: str(),
    CLOUD_NAME: str(),
    CLOUDINARY_SECRET: str()
})