import { useState, useEffect } from 'react';
import './Calendar.css';

export default function Calendar({ tasks, onTaskClick, onTaskUpdate, onTaskDelete }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [debugMode, setDebugMode] = useState(false); // Debug mode to show all tasks

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    setCalendarDays(days);
  };

  const getTasksForDate = (date) => {
    if (debugMode) {
      console.log('=== DATE COMPARISON DEBUG (DEBUG MODE) ===');
      console.log('Looking for tasks on date:', date.toDateString());
      console.log('All tasks:', tasks);
    }
    
    const filteredTasks = tasks.filter(task => {
      if (!task.dueDate) {
        if (debugMode) {
          console.log('❌ Task has no dueDate:', task.title);
        }
        return false;
      }
      
      // Create date objects and compare only the date part (ignoring time)
      const taskDate = new Date(task.dueDate);
      const compareDate = new Date(date);
      
      // Set time to midnight for both dates to ensure accurate comparison
      taskDate.setHours(0, 0, 0, 0);
      compareDate.setHours(0, 0, 0, 0);
      
      const matches = taskDate.getTime() === compareDate.getTime();
      if (debugMode) {
        console.log(`📅 Task "${task.title}":`);
        console.log(`   - Due Date: ${task.dueDate}`);
        console.log(`   - Task Date: ${taskDate.toDateString()}`);
        console.log(`   - Compare Date: ${compareDate.toDateString()}`);
        console.log(`   - Matches: ${matches ? '✅ YES' : '❌ NO'}`);
      }
      
      return matches;
    });
    
    if (debugMode) {
      console.log('🎯 Final filtered tasks for date:', filteredTasks);
      console.log('=== END DEBUG ===');
    }
    return filteredTasks;
  };

  const getUnscheduledTasks = () => {
    return tasks.filter(task => !task.dueDate);
  };

  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const tasksForDate = getTasksForDate(date);
    setSelectedDateTasks(tasksForDate);
    setShowDateModal(true);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF5630';
      case 'medium': return '#FF8B00';
      case 'low': return '#36B37E';
      default: return '#6B778C';
    }
  };

  const ProgressBar = ({ progress }) => {
    const getProgressColor = (progress) => {
      if (progress >= 80) return '#36B37E';
      if (progress >= 50) return '#FF8B00';
      return '#FF5630';
    };

    return (
      <div className="calendar-progress-bar-container">
        <div className="calendar-progress-bar">
          <div 
            className="calendar-progress-fill" 
            style={{ 
              width: `${progress}%`, 
              backgroundColor: getProgressColor(progress) 
            }}
          />
        </div>
        <span className="calendar-progress-text">{progress}%</span>
      </div>
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="calendar" style={{ background: 'var(--card-bg)', color: 'var(--text)' }}>
      {/* Calendar Header */}
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={goToPreviousMonth} className="nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h2 className="calendar-title">{formatDate(currentDate)}</h2>
          <button onClick={goToNextMonth} className="nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <button onClick={goToToday} className="today-btn">
          Today
        </button>
        <button 
          onClick={() => setDebugMode(!debugMode)} 
          className="debug-mode-btn"
          style={{ 
            background: debugMode ? '#FF5630' : '#6B778C', 
            color: 'white', 
            border: 'none', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            marginLeft: '10px'
          }}
        >
          {debugMode ? 'Debug: ON' : 'Debug: OFF'}
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day Headers */}
        <div className="calendar-day-headers">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="calendar-days">
          {calendarDays.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            const isSelectedDate = isSelected(date);

            return (
              <div
                key={index}
                className={`calendar-day ${!isCurrentMonthDay ? 'other-month' : ''} ${isTodayDate ? 'today' : ''} ${isSelectedDate ? 'selected' : ''} ${dayTasks.length > 0 ? 'has-tasks' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                <div className="day-header-mini">
                  <div className="day-number">{date.getDate()}</div>
                  {dayTasks.length > 0 && (
                    <div className="task-count-badge">{dayTasks.length}</div>
                  )}
                </div>
                <div className="day-tasks">
                  {dayTasks.slice(0, 3).map((task, taskIndex) => (
                    <div
                      key={task._id}
                      className={`calendar-task ${task.completed ? 'completed' : ''}`}
                      style={{ borderLeftColor: getPriorityColor(task.priority) }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                    >
                      <div className="task-title">{task.title}</div>
                      <div className="task-meta-mini">
                        {task.priority && (
                          <span className="priority-dot" style={{ backgroundColor: getPriorityColor(task.priority) }}></span>
                        )}
                        {task.progress > 0 && (
                          <span className="progress-mini">{task.progress}%</span>
                        )}
                        {task.completed && (
                          <svg className="task-completed" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="#36B37E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="more-tasks">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                  {dayTasks.length === 0 && isCurrentMonthDay && (
                    <div className="no-tasks-indicator">
                      <span>•</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Tasks Modal */}
      {showDateModal && selectedDate && (
        <div className="date-modal-overlay" onClick={() => setShowDateModal(false)}>
          <div className="date-modal" onClick={(e) => e.stopPropagation()}>
            <div className="date-modal-header">
              <h3>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <button 
                className="date-modal-close"
                onClick={() => setShowDateModal(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="date-modal-content">
              {selectedDateTasks.length === 0 ? (
                <div className="no-tasks-message">
                  <div className="no-tasks-icon">📅</div>
                  <h4>No tasks scheduled for this date</h4>
                  <p>Click "Add Task" to create a new task for this date</p>
                  <button 
                    className="add-task-for-date-btn"
                    onClick={() => {
                      setShowDateModal(false);
                      // You can add logic here to pre-fill the task form with this date
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add Task for This Date
                  </button>
                </div>
              ) : (
                <div className="date-tasks-list">
                  {selectedDateTasks.map(task => (
                    <div key={task._id} className="date-task-item">
                      <div className="task-main-info">
                        <div className="task-header">
                          <h4 className={`task-title ${task.completed ? 'completed' : ''}`}>
                            {task.title}
                          </h4>
                          <div className="task-status-badges">
                            <span className={`priority-badge ${task.priority}`}>
                              {task.priority}
                            </span>
                            {task.completed && (
                              <span className="completed-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Completed
                              </span>
                            )}
                            <span className={`status-badge ${task.status}`}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className="task-description">{task.description}</p>
                        )}
                        
                        <div className="task-progress-section">
                          <div className="progress-label">
                            Progress: {task.progress || 0}%
                          </div>
                          <ProgressBar progress={task.progress || 0} />
                        </div>
                        
                        {task.tags && task.tags.length > 0 && (
                          <div className="task-tags">
                            {task.tags.map((tag, index) => (
                              <span key={index} className="tag">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="task-actions">
                        <button 
                          className="task-action-btn view-btn"
                          onClick={() => {
                            setShowDateModal(false);
                            onTaskClick(task);
                          }}
                          title="View task details"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        {onTaskUpdate && (
                          <button 
                            className="task-action-btn complete-btn"
                            onClick={() => {
                              const newCompleted = !task.completed;
                              onTaskUpdate(task._id, { 
                                completed: newCompleted,
                                status: newCompleted ? 'done' : 'todo'
                              });
                            }}
                            title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        )}
                        
                        <button 
                          className="task-action-btn progress-btn"
                          onClick={() => {
                            const newProgress = Math.min((task.progress || 0) + 25, 100);
                            onTaskUpdate(task._id, { progress: newProgress });
                          }}
                          title="Increase progress by 25%"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        <button 
                          className="task-action-btn delete-btn"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this task?')) {
                              onTaskDelete(task._id);
                            }
                          }}
                          title="Delete task"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Unscheduled Tasks Section */}
      {getUnscheduledTasks().length > 0 && (
        <div className="unscheduled-tasks-section">
          <h3>Unscheduled Tasks ({getUnscheduledTasks().length})</h3>
          <div className="unscheduled-tasks-list">
            {getUnscheduledTasks().map(task => (
              <div
                key={task._id}
                className="unscheduled-task"
                onClick={() => onTaskClick(task)}
              >
                <div className="task-info">
                  <div className="task-title">{task.title}</div>
                  {task.description && (
                    <div className="task-description">{task.description}</div>
                  )}
                  <ProgressBar progress={task.progress || 0} />
                </div>
                <div className="task-meta">
                  <span className={`priority-badge ${task.priority}`}>
                    {task.priority}
                  </span>
                  {task.completed && (
                    <span className="completed-badge">Completed</span>
                  )}
                  {onTaskUpdate && (
                    <button 
                      className="calendar-complete-btn"
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
                  )}
                  <button 
                    className="calendar-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this task?')) {
                        if (onTaskDelete) {
                          onTaskDelete(task._id);
                        }
                      }
                    }}
                    title="Delete task"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
