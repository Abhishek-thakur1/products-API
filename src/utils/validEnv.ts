import { cleanEnv, port, str } from "envalid";

const validEnv = () => {
    cleanEnv(process.env, {
        NODE_ENV: str(),
        PORT: port(),
        POSTGRES_HOST: str(),
        POSTGRES_PORT: port(),
        POSTGRES_USER: str(),
        POSTGRES_PASSWORD: str(),
        POSTGRES_DB: str()
    });
}

export default validEnv;
