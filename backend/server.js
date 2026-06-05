import app from './app.js';
import connectdb from './config/database.js';

connectdb();
app.listen(3000, () => {
    console.log("server is running");

})