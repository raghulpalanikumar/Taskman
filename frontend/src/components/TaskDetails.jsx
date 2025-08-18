import { useState, useEffect } from 'react';
import './TaskDetails.css';
import { taskAPI } from '../services/api';

export default function TaskDetails({ taskId, onClose }) {
  const [task, setTask] = useState(null);
  const [comment, setComment] = useState('');
  const [attachment, setAttachment] = useState({ filename: '', url: '' });
  const [activity, setActivity] = useState([]);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtasks, setSubtasks] = useState([]);

  useEffect(() => {
    async function fetchTask() {
      const t = await taskAPI.getTask(taskId);
      setTask(t);
      setSubtasks(t.subtasks || []);
    }
    async function fetchActivity() {
      const log = await taskAPI.getTaskActivity(taskId);
      setActivity(log);
    }
    fetchTask();
    fetchActivity();
  }, [taskId]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    await taskAPI.addTaskComment(taskId, comment);
    setComment('');
    const t = await taskAPI.getTask(taskId);
    setTask(t);
  };

  const handleAddAttachment = async () => {
    if (!attachment.filename || !attachment.url) return;
    await taskAPI.addTaskAttachment(taskId, attachment.filename, attachment.url);
    setAttachment({ filename: '', url: '' });
    const t = await taskAPI.getTask(taskId);
    setTask(t);
  };

  const handleAddSubtask = async () => {
    if (!subtaskTitle.trim()) return;
    // Create subtask
    const subtask = await taskAPI.createTask({ title: subtaskTitle, parent: taskId });
    await taskAPI.addTaskSubtask(taskId, subtask._id);
    setSubtaskTitle('');
    const t = await taskAPI.getTask(taskId);
    setTask(t);
    setSubtasks(t.subtasks || []);
  };

  if (!task) return <div className="task-details-modal">Loading...</div>;

  return (
    <div className="task-details-modal">
      <div className="task-details-header">
        <h2>{task.title}</h2>
        <button onClick={onClose}>&times;</button>
      </div>
      <div className="task-details-body">
        <p>{task.description}</p>
        <div><strong>Status:</strong> {task.status}</div>
        <div><strong>Priority:</strong> {task.priority}</div>
        <div><strong>Tags:</strong> {task.tags && task.tags.join(', ')}</div>
        <div><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'None'}</div>
        <div><strong>Subtasks:</strong>
          <ul>
            {subtasks.map(st => <li key={st._id}>{st.title}</li>)}
          </ul>
          <input value={subtaskTitle} onChange={e => setSubtaskTitle(e.target.value)} placeholder="Add subtask..." />
          <button onClick={handleAddSubtask}>Add Subtask</button>
        </div>
        <div><strong>Comments:</strong>
          <ul>
            {task.comments && task.comments.map((c, i) => <li key={i}><b>{c.user}</b>: {c.text}</li>)}
          </ul>
          <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add comment..." />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
        <div><strong>Attachments:</strong>
          <ul>
            {task.attachments && task.attachments.map((a, i) => <li key={i}><a href={a.url} target="_blank" rel="noopener noreferrer">{a.filename}</a></li>)}
          </ul>
          <input value={attachment.filename} onChange={e => setAttachment({ ...attachment, filename: e.target.value })} placeholder="Filename" />
          <input value={attachment.url} onChange={e => setAttachment({ ...attachment, url: e.target.value })} placeholder="URL" />
          <button onClick={handleAddAttachment}>Add Attachment</button>
        </div>
        <div><strong>Activity Log:</strong>
          <ul>
            {activity.map((a, i) => <li key={i}>{a.action} by {a.user} at {new Date(a.timestamp).toLocaleString()}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
