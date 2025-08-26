
import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();
// Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, category, tags, dueDate, status, progress } = req.body;
    const recurrence = req.body.recurrence || 'daily';
    const task = new Task({
      title,
      description,
      priority,
      category,
      tags,
      dueDate,
      status,
      progress,
      recurrence,
      user: req.user.id
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
// Get a single task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('GET /tasks/:id', 'User:', req.user.id, 'Task ID:', req.params.id);
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      console.log('Task not found for user:', req.user.id, 'Task ID:', req.params.id);
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a subtask to a task
router.post('/:id/subtasks', auth, async (req, res) => {
  try {
    const { subtaskId } = req.body;
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    task.subtasks.push(subtaskId);
    task.activity.push({ action: 'add_subtask', user: req.user.id, details: { subtaskId } });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error('Error adding subtask:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a comment to a task
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    task.comments.push({ user: req.user.id, text });
    task.activity.push({ action: 'add_comment', user: req.user.id, details: { text } });
    await task.save();
    res.json(task.comments);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add an attachment to a task (URL only, for simplicity)
router.post('/:id/attachments', auth, async (req, res) => {
  try {
    const { filename, url } = req.body;
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    task.attachments.push({ filename, url, user: req.user.id });
    task.activity.push({ action: 'add_attachment', user: req.user.id, details: { filename, url } });
    await task.save();
    res.json(task.attachments);
  } catch (err) {
    console.error('Error adding attachment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get activity log for a task
router.get('/:id/activity', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id })
      .populate('activity.user', 'name username');
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task.activity);
  } catch (err) {
    console.error('Error fetching activity log:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
  try {
  const { title, description, completed, priority, category, tags, dueDate, status, progress, recurrence } = req.body;
    
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
  if (recurrence !== undefined) task.recurrence = recurrence;
    
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

// Get all tasks for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
