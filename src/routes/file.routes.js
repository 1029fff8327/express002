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

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: File management
 */

/**
 * @swagger
 * /files/{name}:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     parameters:
 *       - in: path
 *         name: name
 *         description: Name of the file
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'ok'
 *                 Warning:
 *                   type: string
 *                   example: 'Attention, the directory size is more than 10 megabytes'
 */

fileRouter.post('/:name', fileMiddleware, (req, res) => controller.create(req, res));

/**
 * @swagger
 * /files/{name}:
 *   get:
 *     summary: Download a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: name
 *         description: Name of the file
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: File downloaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'ok'
 *       '404':
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'error'
 *                 description:
 *                   type: string
 *                   example: 'file not found'
 */

fileRouter.get('/:name', fileMiddleware, (req, res) => controller.getById(req, res));

// Swagger UI endpoint
fileRouter.use('/docs', swaggerUi.serve);
fileRouter.get('/docs', swaggerUi.setup(swaggerConfig));

module.exports = fileRouter;
