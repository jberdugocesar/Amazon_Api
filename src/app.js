const app = require("./index");
require('dotenv').config();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
    console.log(`Logged Error ${err}`);
    server.close(() => process.exit(1));
});
