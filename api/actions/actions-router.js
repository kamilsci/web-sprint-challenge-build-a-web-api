const express = require('express');
const Actions = require('./actions-model');
const Projects = require('../projects/projects-model'); 
const { validateActionBody } = require('./actions-middlware');

const router = express.Router();


router.use(express.json());

router.get('/', async (req, res) => {
  try {
    const actions = await Actions.get();
    res.status(200).json(actions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get actions' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const action = await Actions.get(req.params.id);
    if (action) {
      res.status(200).json(action);
    } else {
      res.status(404).json({ message: 'Action not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to get action' });
  }
});

router.post('/', validateActionBody, async (req, res) => {
  try {
    const { project_id, description, notes, completed } = req.body;
    const project = await Projects.get(project_id);
    if (!project) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }
    const newAction = await Actions.insert({ project_id, description, notes, completed: completed || false });
    res.status(201).json(newAction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create action' });
  }
});
  
router.put('/:id', async (req, res) => {
  try {
    const { project_id, description, notes, completed } = req.body;
    if (!project_id || !description || !notes || completed === undefined) {
      return res.status(400).json({ message: 'Missing required fields: project_id, description, notes, and completed' });
    }
    const updatedAction = await Actions.update(req.params.id, { project_id, description, notes, completed });
    if (updatedAction) {
      res.status(200).json(updatedAction);
    } else {
      res.status(404).json({ message: 'Action not found' });
    }
    } catch (error) {
      res.status(500).json({ message: 'Failed to update action' });
    }
  });
  
  

router.delete('/:id', async (req, res) => {
  try {
    const count = await Actions.remove(req.params.id);
    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Action not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete action' });
  }
});

module.exports = router;