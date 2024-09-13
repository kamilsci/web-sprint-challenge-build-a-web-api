const express = require('express');
const Projects = require('./projects-model'); 
const { validateProjectBody } = require('./projects-middleware');

const router = express.Router();


router.use(express.json());

router.get('/', async (req, res) => {
  try {
    const projects = await Projects.get();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get projects' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Projects.get(req.params.id);
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to get project' });
  }
});

router.post('/', validateProjectBody, async (req, res) => {
    try {
      const { name, description, completed } = req.body;
      const newProject = await Projects.insert({ name, description, completed: completed || false });
      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create project' });
    }
  });

router.put('/:id', async (req, res) => {
try {
  const { name, description, completed } = req.body;
  if (!name || !description || completed === undefined) {
    return res.status(400).json({ message: 'Missing required fields: name, description, and completed' });
    }
    const updatedProject = await Projects.update(req.params.id, { name, description, completed });
    if (updatedProject) {
    res.status(200).json(updatedProject);
    } else {
    res.status(404).json({ message: 'Project not found' });
    }
    } catch (error) {
      res.status(500).json({ message: 'Failed to update project' });
    }
  });
  

  

router.delete('/:id', async (req, res) => {
  try {
    const count = await Projects.remove(req.params.id);
    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

router.get('/:id/actions', async (req, res) => {
  try {
    const project = await Projects.get(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const actions = await Projects.getProjectActions(req.params.id);
    res.status(200).json(actions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get actions' });
  }
});

module.exports = router;