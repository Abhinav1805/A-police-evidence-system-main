import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEvidenceList, setTotalCount } from '../store/slices/evidenceSlice';
import { evidenceAPI } from '../services/api';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { evidenceList, totalCount } = useSelector((state) => state.evidence);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await evidenceAPI.getAll();
        dispatch(setEvidenceList(response.data.evidence || []));
        dispatch(setTotalCount(response.data.totalCount || 0));
      } catch (error) {
        console.error('Error fetching evidence:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  const stats = [
    { name: 'Total Evidence', value: totalCount || 0 },
    { name: 'Uploaded Today', value: (evidenceList || []).filter(e => 
      new Date(e.createdAt).toDateString() === new Date().toDateString()
    ).length },
    { name: 'Pending Review', value: (evidenceList || []).filter(e => e.status === 'pending').length },
    { name: 'Verified', value: (evidenceList || []).filter(e => e.status === 'verified').length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Welcome back, {user?.name}
      </h1>
      
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className="absolute rounded-md bg-blue-500 p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </dd>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
        <div className="mt-4 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                        ID
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Type
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {(evidenceList || []).slice(0, 5).map((evidence) => (
                      <tr key={evidence._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                          {evidence._id?.substring(0, 8)}...
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {evidence.type}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {evidence.status}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(evidence.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}