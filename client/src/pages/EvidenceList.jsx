import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setEvidenceList } from '../store/slices/evidenceSlice';
import { evidenceAPI } from '../services/api';
import Table from '../components/Table';
import Input from '../components/Input';
import Select from '../components/Select';
import { formatDate } from '../utils/helpers';

export default function EvidenceList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { evidenceList } = useSelector((state) => state.evidence);

  useEffect(() => {
    fetchEvidence();
  }, [dispatch]);

  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const response = await evidenceAPI.getAll();
      // API returns { evidence: [...], totalCount: ... }
      dispatch(setEvidenceList(response.data.evidence || response.data || []));
    } catch (error) {
      console.error('Error fetching evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: '_id', header: 'ID', render: (value) => value?.substring(0, 8) + '...' },
    { key: 'title', header: 'Title' },
    { 
      key: 'uploader',
      header: 'Uploader',
      render: (value) => value?.name || 'Unknown'
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (value) => formatDate(value)
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
          ${value === 'verified' ? 'bg-green-100 text-green-800' : 
            value === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'}`}
        >
          {value}
        </span>
      )
    },
    {
      key: 'hash',
      header: 'Hash',
      render: (value) => (
        <span className="font-mono text-xs">{value ? value.substring(0, 8) + '...' : 'N/A'}</span>
      )
    }
  ];

  const filteredEvidence = (evidenceList || [])
    .filter(evidence => 
      (searchTerm === '' || 
        evidence.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evidence._id?.toString().includes(searchTerm) ||
        evidence.hash?.includes(searchTerm)
      ) &&
      (statusFilter === '' || evidence.status === statusFilter)
    );

  const handleRowClick = (evidence) => {
    navigate(`/evidence/${evidence._id}`);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Evidence List
          </h1>
        </div>
      </div>

      <div className="mt-4 sm:flex sm:items-center sm:gap-4">
        <Input
          placeholder="Search evidence..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-xs"
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: '', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'verified', label: 'Verified' },
            { value: 'rejected', label: 'Rejected' }
          ]}
          className="sm:max-w-xs mt-2 sm:mt-0"
        />
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : filteredEvidence.length > 0 ? (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <Table
                  columns={columns}
                  data={filteredEvidence}
                  onRowClick={handleRowClick}
                />
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No evidence found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}