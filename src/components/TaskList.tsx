import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  name: string;
  tags: string[];
  active: boolean;
}

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskName, setNewTaskName] = useState<string>('');
    const [newTaskTags, setNewTaskTags] = useState<string[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
  
    // Trạng thái lọc hiện tại (tất cả, active, unactive)
    const [filteredStatus, setFilteredStatus] = useState<string>('all');
  
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3010/tasks');
        const data = await response.json();
        if (Array.isArray(data)) {
          setTasks(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    // Thêm công việc
    const handleAddTask = async () => {
      if (newTaskName.trim() === '') {
        return; // Không thêm công việc trống
      }
  
      const newTask: Task = {
        id: tasks.length + 1, // Gán một ID duy nhất
        name: newTaskName,
        tags: newTaskTags,
        active: true, // Mặc định, công việc mới là active
      };
  
      try {
        const response = await fetch('http://localhost:3010/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTask),
        });
  
        if (response.status === 201) {
          const createdTask = await response.json();
          setTasks([...tasks, createdTask]);
          setNewTaskName('');
          setNewTaskTags([]);
        } else {
          console.error('Error adding task:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    };
  
    // Chỉnh sửa công việc
    const handleEditTask = (task: Task) => {
      setEditingTask(task);
      setNewTaskName(task.name);
      setNewTaskTags(task.tags);
    };
  
    // Lưu công việc đã chỉnh sửa
    const handleSaveTask = async () => {
      if (newTaskName.trim() === '') {
        return; // Không lưu công việc trống
      }
  
      if (editingTask) {
        const updatedTask: Task = {
          ...editingTask,
          name: newTaskName,
          tags: newTaskTags,
        };
  
        try {
          const response = await fetch(`http://localhost:3010/tasks/${editingTask.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
          });
  
          if (response.status === 200) {
            const updatedTaskData = await response.json();
            const updatedTasks = tasks.map((task) =>
              task.id === updatedTaskData.id ? updatedTaskData : task
            );
  
            setTasks(updatedTasks);
            setNewTaskName('');
            setNewTaskTags([]);
            setEditingTask(null);
          } else {
            console.error('Error saving task:', response.statusText);
          }
        } catch (error) {
          console.error('Error saving task:', error);
        }
      }
    };
  
    // Xóa công việc
    const handleDeleteTask = async (taskId: number) => {
      try {
        const response = await fetch(`http://localhost:3010/tasks/${taskId}`, {
          method: 'DELETE',
        });
  
        if (response.status === 204) {
          const updatedTasks = tasks.filter((task) => task.id !== taskId);
          setTasks(updatedTasks);
        } else {
          console.error('Error deleting task:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };
  
    // Toggle trạng thái active của một tag trong công việc
    const handleToggleTagActive = (task: Task, tagIndex: number) => {
      const updatedTasks = [...tasks];
      const updatedTask = { ...task };
      updatedTask.tags[tagIndex] = task.tags[tagIndex]; // Chuyển đổi trạng thái active của tag
      updatedTasks[task.id - 1] = updatedTask; // Cập nhật công việc trong danh sách
  
      // Gửi công việc đã cập nhật lên API để lưu thay đổi
      fetch(`http://localhost:3010/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      })
        .then((response) => {
          if (response.status === 200) {
            setTasks(updatedTasks);
          } else {
            console.error('Error updating tag status:', response.statusText);
          }
        })
        .catch((error) => {
          console.error('Error updating tag status:', error);
        });
    };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h3 className="text-2xl font-semibold mb-4">Tasks</h3>


      {/* Nút chọn trạng thái lọc */}
      <div className="mb-4">
        <button
          onClick={() => setFilteredStatus('all')}
          className={`mr-2 ${filteredStatus === 'all' ? 'bg-blue-500' : 'bg-gray-300'} text-white p-2 rounded`}
        >
          All
        </button>
        <button
          onClick={() => setFilteredStatus('active')}
          className={`mr-2 ${filteredStatus === 'active' ? 'bg-blue-500' : 'bg-gray-300'} text-white p-2 rounded`}
        >
          Active
        </button>
        <button
          onClick={() => setFilteredStatus('unactive')}
          className={`mr-2 ${filteredStatus === 'unactive' ? 'bg-blue-500' : 'bg-gray-300'} text-white p-2 rounded`}
        >
          Unactive
        </button>
      </div>

      
      <ul>
        {tasks
            .filter((task) => {
                if (filteredStatus === 'active') {
                return task.active;
                } else if (filteredStatus === 'unactive') {
                return !task.active;
                }
                return true; // Hiển thị tất cả trạng thái
            })
            
            .map((task) => (
            <li key={task.id} className="mb-4 p-2 border rounded">
                {task === editingTask ? (
                <div>
                    <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    />
                    {newTaskTags.map((tag, index) => (
                    <div key={index}>
                        <input
                        type="text"
                        value={tag}
                        onChange={(e) => {
                            const updatedTags = [...newTaskTags];
                            updatedTags[index] = e.target.value;
                            setNewTaskTags(updatedTags);
                        }}
                        className="w-full p-2 border rounded mb-2"
                        />
                        <button
                            onClick={() => handleToggleTagActive(task, index)}
                            className={`bg-${task.active ? 'green' : 'red'}-500 text-white p-2 rounded`}
    >
                            {task.active ? 'Active' : 'Inactive'}
                        </button>

                    </div>
                    ))}
                    <button
                    onClick={handleSaveTask}
                    className="bg-blue-500 text-white p-2 rounded"
                    >
                    Save
                    </button>
                </div>
                ) : (
                <div>
                    <p className="text-lg">{task.name}</p>
                    {task.tags.map((tag, index) => (
                    <div key={index}>
                        <p className="text-gray-600 text-sm">Tag: {tag}</p>
                        <button
                            onClick={() => handleToggleTagActive(task, index)}
                            className={`bg-${task.active ? 'green' : 'red'}-500 text-white p-2 rounded`}
                        >
                                {task.active ? 'Active' : 'Inactive'}
                        </button>

                    </div>
                    ))}
                    <button
                    onClick={() => handleEditTask(task)}
                    className="bg-yellow-500 text-white p-2 rounded m-2"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-red-500 text-white p-2 rounded m-2"
                    >
                    Delete
                    </button>
                </div>
                )}
            </li>
            ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Task name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Add tags (comma-separated)"
          value={newTaskTags.join(', ')}
          onChange={(e) => setNewTaskTags(e.target.value.split(', '))}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleAddTask}
          className="bg-green-500 text-white p-2 rounded"
        >
          Add Task
        </button>
      </div>
    </div>
  );
}

export default TaskList;
