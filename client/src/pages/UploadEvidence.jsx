import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEvidence } from '../store/slices/evidenceSlice';
import { evidenceAPI } from '../services/api';
import { calculateFileHash, validateFileType } from '../utils/helpers';
import FileUpload from '../components/FileUpload';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';

export default function UploadEvidence() {
  const [file, setFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caseNumber: '',
    evidenceType: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const evidenceTypes = [
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
    { value: 'document', label: 'Document' },
    { value: 'other', label: 'Other' },
  ];

  const handleFileSelect = async (selectedFile) => {
    if (!validateFileType(selectedFile)) {
      setError('Invalid file type');
      return;
    }
    setFile(selectedFile);
    try {
      const hash = await calculateFileHash(selectedFile);
      setFileHash(hash);
    } catch (err) {
      setError('Error calculating file hash');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !fileHash) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append('fileHash', fileHash);

    try {
      const response = await evidenceAPI.create(formDataToSend);
      dispatch(addEvidence(response.data));
      setFile(null);
      setFileHash('');
      setFormData({
        title: '',
        description: '',
        caseNumber: '',
        evidenceType: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading evidence');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
        Upload Evidence
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <Input
          label="Case Number"
          name="caseNumber"
          value={formData.caseNumber}
          onChange={handleChange}
          required
        />

        <Select
          label="Evidence Type"
          name="evidenceType"
          value={formData.evidenceType}
          onChange={handleChange}
          options={evidenceTypes}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 dark:bg-gray-800"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Evidence File
          </label>
          <FileUpload
            onFileSelect={handleFileSelect}
            accept="image/*,video/*,application/pdf"
          />
          {file && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selected file: {file.name}
            </p>
          )}
          {fileHash && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              File hash (SHA-256): {fileHash}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !file}
          className="w-full"
        >
          {loading ? 'Uploading...' : 'Upload Evidence'}
        </Button>
      </form>
    </div>
  );
}