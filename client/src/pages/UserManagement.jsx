import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserList, addUser, removeUser } from '../store/slices/userSlice';
import { userAPI } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Table from '../components/Table';

export default function UserManagement() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { userList } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAll();
      dispatch(setUserList(response.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await userAPI.create(formData);
      dispatch(addUser(response.data));
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        role: '',
        password: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(userId);
        dispatch(removeUser(userId));
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { 
      key: 'role',
      header: 'Role',
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
          ${value === 'Admin' ? 'bg-purple-100 text-purple-800' :
            value === 'Investigator' ? 'bg-blue-100 text-blue-800' :
            value === 'Analyst' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'}`}
        >
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, user) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="danger"
            onClick={() => handleDeleteUser(user.id)}
            disabled={user.id === currentUser.id}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  if (currentUser?.role !== 'Admin') {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Access denied. Admin privileges required.
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            User Management
          </h1>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add New User'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'Admin', label: 'Admin' },
                { value: 'Investigator', label: 'Investigator' },
                { value: 'Analyst', label: 'Analyst' },
                { value: 'Auditor', label: 'Auditor' }
              ]}
              required
            />

            <div className="flex justify-end">
              <Button type="submit">Create User</Button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : userList.length > 0 ? (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <Table columns={columns} data={userList} />
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}