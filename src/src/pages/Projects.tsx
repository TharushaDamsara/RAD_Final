import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchProjects, createProject } from '../store/slices/projectSlice';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Loader } from '../components/common/Loader';
import { Project } from '../types';

export function Projects() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector(state => state.projects);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as Project['status'],
    priority: 'medium' as Project['priority']
  });

  useEffect(() => {
    dispatch(fetchProjects({}));
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createProject(formData));
    setShowForm(false);
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium'
    });
  };

  const statusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'planning':
        return 'bg-gray-100 text-gray-700';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <Loader size="lg" />
        </div>
    );
  }

  return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage your projects and teams</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Create Project Form */}
        {showForm && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Project Name"
                    value={formData.name}
                    onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={formData.description}
                      onChange={e =>
                          setFormData({ ...formData, description: e.target.value })
                      }
                      required
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit">Create Project</Button>
                  <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
        )}

        {/* Project List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
              projects.map(project => (
                  <Card
                      key={project._id}
                      className="p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor(
                              project.status
                          )}`}
                      >
                  {project.status}
                </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Priority: {project.priority}
                </span>
                      <span className="text-gray-500">
                  {project.members.length} members
                </span>
                    </div>
                  </Card>
              ))
          ) : (
              <p className="text-gray-500">No projects found.</p>
          )}
        </div>
      </div>
  );
}
