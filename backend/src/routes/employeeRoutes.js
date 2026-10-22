const express = require('express');
const controller = require('../controllers/employeeController');
const { validateEmployee, validateId } = require('../middleware/validateEmployee');

const router = express.Router();

router.get('/', controller.list);
router.get('/:id', validateId, controller.getOne);
router.post('/', validateEmployee, controller.create);
router.put('/:id', validateId, validateEmployee, controller.update);
router.delete('/:id', validateId, controller.remove);

module.exports = router;
