import { useState } from 'react';
import { useAppSelector } from '../store';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
export function Profile() {
  const {
    user
  } = useAppSelector(state => state.auth);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  return <div className="p-6 max-w-2xl mx-auto space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>

    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Personal Information
      </h2>
      <form className="space-y-4">
        <Input label="Full Name" value={formData.name} onChange={e => setFormData({
          ...formData,
          name: e.target.value
        })} />
        <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({
          ...formData,
          email: e.target.value
        })} disabled />
        <Button type="submit">Save Changes</Button>
      </form>
    </Card>

    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Change Password
      </h2>
      <form className="space-y-4">
        <Input label="Current Password" type="password" />
        <Input label="New Password" type="password" />
        <Input label="Confirm New Password" type="password" />
        <Button type="submit">Update Password</Button>
      </form>
    </Card>
  </div>;
}