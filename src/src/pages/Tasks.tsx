import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchTasks } from '../store/slices/taskSlice';
import { Card } from '../components/common/Card';
import { Loader } from '../components/common/Loader';

export function Tasks() {
  const dispatch = useAppDispatch();

  // Default to empty array to prevent undefined
  const { tasks = [], loading } = useAppSelector(state => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks({}));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  // Make sure tasks is always an array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const tasksByStatus = {
    todo: safeTasks.filter(t => t.status === 'todo'),
    'in-progress': safeTasks.filter(t => t.status === 'in-progress'),
    review: safeTasks.filter(t => t.status === 'review'),
    done: safeTasks.filter(t => t.status === 'done')
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>

      <div className="grid lg:grid-cols-4 gap-6">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
              {status.replace('-', ' ')} ({statusTasks.length})
            </h2>
            <div className="space-y-3">
              {statusTasks.map(task => (
                <Card key={task._id} className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-1 rounded-full ${task.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                    >
                      {task.priority}
                    </span>
                    {task.assignedTo && (
                      <span className="text-gray-500">{task.assignedTo.name}</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
