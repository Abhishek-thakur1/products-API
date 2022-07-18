import "reflect-metadata"
import { DataSource } from "typeorm";
import logger from "../src/shared/Logger";


const PostgresDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "abhi",
    password: "password",
    database: "products",
    entities: [
        // ....
    ],
});

PostgresDataSource.initialize()
    .then(() => {
        logger.info("Postgres data source initialized!")
    })
    .catch((err) => {
        logger.error("Postgres data source Error during Data Source initialization", err)
    });




// exporting DataSource instance... 
export default PostgresDataSource


