const { Router } = require('express');
const FileModel = require('../models/file.model');
const FileAdapter = require('../lib/file.adapter');
const FileService = require('../services/file.service');
const FileController = require('../controllers/file.controller');
const fileMiddleware = require('../middlewares/file.middlewares');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('../config/swagger-config');

const fileRouter = Router();
const controller = new FileController(
  new FileService(
    new FileAdapter(),
    FileModel
  )
);



fileRouter.post('/:name', fileMiddleware, (req, res) => controller.create(req, res));
fileRouter.put('/file/:id', fileMiddleware, (req, res) => controller.update(req, res));
fileRouter.get('/file/:id', fileMiddleware, (req, res) => controller.getById(req, res));

fileRouter.use('/docs', swaggerUi.serve);
fileRouter.get('/docs', swaggerUi.setup(swaggerConfig));

module.exports = fileRouter;
