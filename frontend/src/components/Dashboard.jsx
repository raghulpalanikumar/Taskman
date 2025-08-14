import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI } from "../services/api.js";
import TaskForm from "./TaskForm.jsx";
import TaskFilters from "./TaskFilters.jsx";
import Header from "./Header.jsx";
import Calendar from "./Calendar.jsx";
import KanbanBoard from "./KanbanBoard.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [view, setView] = useState('kanban');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    dueDate: null,
  });
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !task.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    return true;
  });

  // Function to open edit task modal
  const openEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user data and tasks on component mount
    const fetchData = async () => {
      try {
        const userResponse = await taskAPI.getUserProfile();
        setUser(userResponse); // Remove .data as the backend sends the user object directly

        const tasksResponse = await taskAPI.getTasks();
        setTasks(tasksResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.message.includes('No token, authorization denied') || error.message.includes('401')) {
          // Token is invalid or expired, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('name');
          navigate('/login');
        } else if (error.message.includes('Unexpected token')) {
          console.error('The server returned an invalid JSON response. Check if the backend is running and the endpoint is correct.');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      await taskAPI.updateTask(taskId, { completed: !task.completed });

      setTasks(tasks.map(t => t._id === taskId ? { ...t, completed: !t.completed } : t));
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await taskAPI.deleteTask(taskId);
        setTasks(tasks.filter(t => t._id !== taskId));
        setNotification({
          type: 'success',
          message: 'Task deleted successfully!'
        });
        setTimeout(() => setNotification(null), 3000);
      } catch (error) {
        console.error("Error deleting task:", error);
        setNotification({
          type: 'error',
          message: 'Failed to delete task'
        });
        setTimeout(() => setNotification(null), 3000);
      }
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskAPI.createTask(taskData);
      setTasks([...tasks, newTask]);
      setShowTaskForm(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      const updatedTask = await taskAPI.updateTask(editingTask._id, taskData);
      setTasks(tasks.map(t => t._id === editingTask._id ? updatedTask : t));
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      dueDate: null,
    });
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await taskAPI.updateTask(taskId, updates);
      setTasks(tasks.map(t => t._id === taskId ? { ...t, ...updates } : t));
      
      // Show notification
      if (updates.completed !== undefined) {
        setNotification({
          type: 'success',
          message: updates.completed ? 'Task marked as completed!' : 'Task marked as incomplete!'
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setNotification({
        type: 'error',
        message: 'Failed to update task'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleQuickAddTask = (status) => {
    setEditingTask(null);
    setShowTaskForm(true);
    // Store the status to pre-fill the form
    // Map frontend column IDs to backend status values
    const statusMap = {
      'todo': 'todo',
      'inprogress': 'inprogress',
      'done': 'done'
    };
    localStorage.setItem('quickAddStatus', statusMap[status] || 'todo');
  };

  const handleTaskClick = (task) => {
    openEditTask(task);
  };

  return (
    <div className="dashboard" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Header user={user} onLogout={handleLogout} />
      
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`} style={{ background: 'var(--card-bg)', color: 'var(--text)', borderColor: 'var(--primary)' }}>
          {notification.message}
        </div>
      )}
      
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h1 style={{ color: 'var(--primary)' }}>Welcome back, {user?.name}!</h1>
            <p style={{ color: 'var(--text)' }}>Here's what's happening with your tasks today</p>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <div className="stat-number" style={{ color: 'blue' }}>{tasks.length}</div>
                  <div className="stat-label" style={{ color: 'blue' }}>Total Tasks</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <div className="stat-number" style={{ color: 'blue' }}>{tasks.filter(t => t.status === 'inprogress').length}</div>
                  <div className="stat-label" style={{ color: 'blue' }}>In Progress</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number" style={{ color: 'blue' }}>{tasks.filter(t => t.completed).length}</div>
                  <div className="stat-label" style={{ color: 'blue' }}>Completed</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔴</div>
                <div className="stat-content">
                  <div className="stat-number" style={{ color: 'blue' }}>{tasks.filter(t => t.priority === 'high').length}</div>
                  <div className="stat-label" style={{ color: 'blue' }}>High Priority</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-number" style={{ color: 'blue' }}>
                    {tasks.length > 0 
                      ? Math.round(tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / tasks.length)
                      : 0}%
                  </div>
                  <div className="stat-label" style={{ color: 'blue' }}>Avg Progress</div>
                </div>
              </div>
            </div>
          </section>

          {/* Task Management Section */}
          <section className="tasks-section">
            <div className="tasks-header">
              <div className="tasks-header-left">
                <h2 style={{ color: 'var(--primary)' }}>Task Management</h2>
                <div className="task-counter" style={{ color: 'var(--text)' }}>
                  {filteredTasks.length} of {tasks.length} tasks
                </div>
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="search-input"
                  />
                  <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="tasks-actions">
                  <button onClick={() => setShowFilters(!showFilters)} className="filter-toggle-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 3H2L9 12.46V19L15 16V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Filters
                  </button>
                  <button onClick={() => setShowTaskForm(true)} className="add-task-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add Task
                  </button>
                  <button onClick={() => setView(view === 'kanban' ? 'calendar' : 'kanban')} className="view-toggle-button">
                    {view === 'kanban' ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Calendar View
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Kanban View
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            {showFilters && (
              <TaskFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            )}

            {/* View Content */}
            <div className="view-content">
            {view === 'kanban' ? (
                <KanbanBoard
                  tasks={filteredTasks}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskClick={handleTaskClick}
                  onTaskDelete={handleDeleteTask}
                  onQuickAddTask={handleQuickAddTask}
                />
              ) : (
                <Calendar
                  tasks={filteredTasks}
                  onTaskClick={handleTaskClick}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleDeleteTask}
                />
                )}
              </div>
          </section>
        </div>
      </main>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
