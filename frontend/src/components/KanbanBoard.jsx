import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './KanbanBoard.css';

export default function KanbanBoard({ tasks, onTaskUpdate, onTaskClick, onTaskDelete, onQuickAddTask }) {
  const [expandedTask, setExpandedTask] = useState(null);

  const columns = [
    { id: 'todo', title: 'To Do', color: '#6B778C', icon: '📋' },
    { id: 'inprogress', title: 'In Progress', color: '#FF8B00', icon: '⚡' },
    { id: 'done', title: 'Done', color: '#36B37E', icon: '✅' }
  ];

  const getTasksByStatus = () => {
    return {
      todo: tasks.filter(task => !task.completed && task.status !== 'inprogress' && task.status !== 'done'),
      'inprogress': tasks.filter(task => task.status === 'inprogress' && !task.completed),
      done: tasks.filter(task => task.completed || task.status === 'done')
    };
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const task = tasks.find(t => t._id === draggableId);
    if (!task) return;

    let newStatus = task.status;
    let completed = task.completed;

    switch (destination.droppableId) {
      case 'todo':
        newStatus = 'todo';
        completed = false;
        break;
      case 'inprogress':
        newStatus = 'inprogress';
        completed = false;
        break;
      case 'done':
        newStatus = 'done';
        completed = true;
        break;
    }

    onTaskUpdate(task._id, { status: newStatus, completed });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF5630';
      case 'medium': return '#FF8B00';
      case 'low': return '#36B37E';
      default: return '#6B778C';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const ProgressBar = ({ progress }) => {
    const getProgressColor = (progress) => {
      if (progress >= 80) return '#36B37E';
      if (progress >= 50) return '#FF8B00';
      return '#FF5630';
    };

    return (
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${progress}%`, 
              backgroundColor: getProgressColor(progress) 
            }}
          />
        </div>
        <span className="progress-text">{progress}%</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', color: '#FF5630' };
    } else if (diffDays === 0) {
      return { text: 'Today', color: '#FF8B00' };
    } else if (diffDays === 1) {
      return { text: 'Tomorrow', color: '#FF8B00' };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} days`, color: '#36B37E' };
    } else {
      return { text: date.toLocaleDateString(), color: '#6B778C' };
    }
  };

  const tasksByStatus = getTasksByStatus();

  return (
    <div className="kanban-container">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board" style={{ background: 'var(--card-bg)', color: 'var(--text)' }}>
          {columns.map(column => (
            <div key={column.id} className="kanban-column">
              <div className="column-header" style={{ borderLeftColor: column.color }}>
                <div className="column-title">
                  <span className="column-icon">{column.icon}</span>
                  <span className="column-name">{column.title}</span>
                  <span className="task-count">{tasksByStatus[column.id]?.length || 0}</span>
                </div>
                <button className="add-task-btn" onClick={() => onQuickAddTask && onQuickAddTask(column.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                  >
                    {tasksByStatus[column.id]?.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`task-card ${snapshot.isDragging ? 'dragging' : ''} ${task.completed ? 'completed' : ''}`}
                            onClick={() => onTaskClick(task)}
                          >
                            <div className="task-header">
                              <div className="task-priority">
                                <span className="priority-icon">{getPriorityIcon(task.priority)}</span>
                                <span className="priority-text">{task.priority}</span>
                              </div>
                              <div className="task-actions">
                                <button 
                                  className="task-action-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedTask(expandedTask === task._id ? null : task._id);
                                  }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button 
                                  className="task-action-btn complete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newCompleted = !task.completed;
                                    onTaskUpdate(task._id, { 
                                      completed: newCompleted,
                                      status: newCompleted ? 'done' : 'todo'
                                    });
                                  }}
                                  title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button 
                                  className="task-action-btn progress-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newProgress = Math.min((task.progress || 0) + 25, 100);
                                    onTaskUpdate(task._id, { progress: newProgress });
                                  }}
                                  title="Increase progress by 25%"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button 
                                  className="task-action-btn delete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onTaskDelete(task._id);
                                  }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="task-content">
                              <h4 className="task-title">{task.title}</h4>
                              {task.description && (
                                <p className="task-description">{task.description}</p>
                              )}
                              <ProgressBar progress={task.progress || 0} />
                            </div>

                            {expandedTask === task._id && (
                              <div className="task-details">
                                {task.category && (
                                  <div className="task-meta">
                                    <span className="meta-label">Category:</span>
                                    <span className="meta-value">{task.category}</span>
                                  </div>
                                )}
                                {task.tags && task.tags.length > 0 && (
                                  <div className="task-tags">
                                    {task.tags.map(tag => (
                                      <span key={tag} className="tag">{tag}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="task-footer">
                              {task.dueDate && (
                                <div className="due-date" style={{ color: formatDate(task.dueDate)?.color }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span>{formatDate(task.dueDate)?.text}</span>
                                </div>
                              )}
                              {task.completed && (
                                <div className="completed-indicator">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 6L9 17L4 12" stroke="#36B37E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
