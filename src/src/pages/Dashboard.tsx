import React, { useEffect } from 'react';
import { FolderKanban, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchProjects } from '../store/slices/projectSlice';
import { fetchTasks } from '../store/slices/taskSlice';
import { Card } from '../components/common/Card';
import { Loader } from '../components/common/Loader';
export function Dashboard() {
  const dispatch = useAppDispatch();

  const {
    projects = [],
    loading: projectsLoading
  } = useAppSelector(state => state.projects);

  const {
    tasks = [],
    loading: tasksLoading
  } = useAppSelector(state => state.tasks);

  useEffect(() => {
    dispatch(fetchProjects({ limit: 5 }));
    dispatch(fetchTasks({ limit: 10 }));
  }, [dispatch]);

  if (projectsLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: FolderKanban,
      color: 'blue'
    },
    {
      label: 'Active Tasks',
      value: tasks.filter(t => t.status !== 'done').length,
      icon: CheckSquare,
      color: 'green'
    },
    {
      label: 'Pending',
      value: tasks.filter(t => t.status === 'todo').length,
      icon: Clock,
      color: 'yellow'
    },
    {
      label: 'Completed',
      value: tasks.filter(t => t.status === 'done').length,
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's your overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
              </div>
              <div className={`p-3 bg-${color}-100 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${color}-600`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Projects
          </h2>
          <div className="space-y-3">
            {projects.slice(0, 5).map(project => (
              <div key={project._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{project.name}</p>
                  <p className="text-sm text-gray-600">{project.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Tasks
          </h2>
          <div className="space-y-3">
            {tasks.slice(0, 5).map(task => (
              <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
