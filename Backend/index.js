require('dotenv').config();

const connectDB= require('./src/db/db.js')
const app = require('./src/app.js')

connectDB();

const PORT= process.env.PORT || 3000
 app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});