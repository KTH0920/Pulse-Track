const express = require('express');
const router = express.Router();
const {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
} = require('../controllers/alertController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getAlerts)
  .post(protect, createAlert);

router.route('/:id')
  .put(protect, updateAlert)
  .delete(protect, deleteAlert);

module.exports = router;
