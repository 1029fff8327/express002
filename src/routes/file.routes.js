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
 * /file:
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
 * /file/{id}:
 *   put:
 *     summary: Update a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the file
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       '200':
 *         description: File updated successfully
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
fileRouter.put('/file/:id', fileMiddleware, (req, res) => controller.update(req, res));

/**
 * @swagger
 * /file/{id}:
 *   get:
 *     summary: Download a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the file
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
 */
fileRouter.get('/file/:id', fileMiddleware, (req, res) => controller.getById(req, res));

fileRouter.use('/docs', swaggerUi.serve);
fileRouter.get('/docs', swaggerUi.setup(swaggerConfig));

module.exports = fileRouter;
