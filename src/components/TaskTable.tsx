import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  name: string;
  tags: string[];
  active: boolean; // Thêm trường active
}

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3010/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setTasks(data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching tasks. Please try again later.');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h3 className="text-2xl font-semibold mb-4">List of Tasks</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="min-w-full border border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left bg-gray-200">ID</th>
              <th className="p-3 text-left bg-gray-200">Name</th>
              <th className="p-3 text-left bg-gray-200">Tags</th>
              <th className="p-3 text-left bg-gray-200">Active</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="p-3">{task.id}</td>
                <td className="p-3">{task.name}</td>
                <td className="p-3">{task.tags.join(', ')}</td>
                <td className="p-3">
                  {task.active ? 'Active' : 'Inactive'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskTable;
