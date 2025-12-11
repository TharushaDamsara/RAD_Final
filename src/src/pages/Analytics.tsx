import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '../components/common/Card';
export function Analytics() {
  const taskData = [{
    name: 'Todo',
    value: 12
  }, {
    name: 'In Progress',
    value: 8
  }, {
    name: 'Review',
    value: 5
  }, {
    name: 'Done',
    value: 25
  }];
  const projectData = [{
    name: 'Jan',
    projects: 4
  }, {
    name: 'Feb',
    projects: 6
  }, {
    name: 'Mar',
    projects: 8
  }, {
    name: 'Apr',
    projects: 5
  }, {
    name: 'May',
    projects: 9
  }, {
    name: 'Jun',
    projects: 7
  }];
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
  return <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track your productivity and progress
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tasks by Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={taskData} cx="50%" cy="50%" labelLine={false} label={({
              name,
              percent
            }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {taskData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Projects Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="projects" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>;
}