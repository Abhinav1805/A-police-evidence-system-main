import { useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function FileUpload({
  onFileSelect,
  accept = '*/*',
  maxSize = 10485760,
  className = '',
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.size <= maxSize) {
      onFileSelect(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= maxSize) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`relative ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        onChange={handleChange}
        accept={accept}
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className={`flex justify-center w-full h-32 px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none ${
          dragActive ? 'border-blue-500' : ''
        }`}
      >
        <div className="flex items-center space-x-2">
          <CloudArrowUpIcon className="w-6 h-6 text-gray-600" />
          <span className="font-medium text-gray-600">
             click to upload
          </span>
        </div>
      </label>
    </div>
  );
}