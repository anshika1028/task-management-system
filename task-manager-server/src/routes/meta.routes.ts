import express from 'express';
import { getMetaData } from '../controllers/meta.controller';

const router = express.Router();

/**
 * @swagger
 * /api/meta:
 *   get:
 *     summary: Get metadata like roles, priorities, public holidays
 *     tags: [Meta]
 *     responses:
 *       200:
 *         description: Metadata fetched successfully
 */
router.get('/', getMetaData);

export default router;
