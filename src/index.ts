import "./LoadEnv"; 
import app from "./Server";
import logger from "./shared/Logger";



// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info(`Server🚀 is running at http://localhost:${port}`);
});
