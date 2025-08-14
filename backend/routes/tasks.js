import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all tasks for a user with filtering
router.get('/', auth, async (req, res) => {
  try {
    const { category, priority, completed, search, tags } = req.query;
    
    // Build filter object
    const filter = { user: req.user.id };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }
    
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, category, tags, dueDate, progress } = req.body;
    
    console.log('Create task - received progress:', progress, 'type:', typeof progress);
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const task = new Task({
      title,
      description: description || '',
      priority: priority || 'medium',
      category: category || 'other',
      tags: tags || [],
      dueDate: dueDate || null,
      progress: Number(progress) || 0,
      user: req.user.id
    });
    
    console.log('Create task - setting progress to:', task.progress);
    await task.save();
    console.log('Create task - saved progress:', task.progress);
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
  try {
  const { title, description, completed, priority, category, tags, dueDate, status, progress } = req.body;
    
    console.log('Update task - received progress:', progress, 'type:', typeof progress);
    
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Update fields
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;
  if (priority !== undefined) task.priority = priority;
  if (category !== undefined) task.category = category;
  if (tags !== undefined) task.tags = tags;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (status !== undefined) task.status = status;
  if (progress !== undefined) {
    task.progress = Number(progress);
    console.log('Update task - setting progress to:', task.progress);
  }
    
    await task.save();
    console.log('Update task - saved progress:', task.progress);
    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle task completion
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    task.completed = !task.completed;
    await task.save();
    
    res.json(task);
  } catch (err) {
    console.error('Error toggling task:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get task statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    console.log('Stats request - User ID:', req.user.id);
    console.log('Stats request - Full user object:', req.user);
    
    const stats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          pending: { $sum: { $cond: ['$completed', 0, 1] } }
        }
      }
    ]);
    
    const categoryStats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const priorityStats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('Stats aggregation result:', stats);
    console.log('Category stats result:', categoryStats);
    console.log('Priority stats result:', priorityStats);
    
    const response = {
      overview: stats[0] || { total: 0, completed: 0, pending: 0 },
      categories: categoryStats,
      priorities: priorityStats
    };
    
    console.log('Sending stats response:', response);
    res.json(response);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
