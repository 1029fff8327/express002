const express = require('express');
const routes = require('./src/routes/file.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./src/config/swagger-config');
const dotenv = require('dotenv');
const mongoConfig = require('./src/config/mongo-config'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoConfig.connect(); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
