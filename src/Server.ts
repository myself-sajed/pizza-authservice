import app from "./app";
import { Config } from "./config";

const startServer = () => {
    try {
        const PORT = Config.PORT;
        app.listen(PORT, () => console.log(`Server running at ${PORT}`));
    } catch (error) {
        console.log("Could not start server");
        process.exit(1);
    }
};

startServer();
