import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { evidenceAPI } from '../services/api';
import { setSelectedEvidence } from '../store/slices/evidenceSlice';
import Button from '../components/Button';
import { formatDate, formatFileSize } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function EvidenceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [evidence, setEvidence] = useState(null);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const canVerify = user?.role === 'Admin' || user?.role === 'Investigator';

  useEffect(() => {
    fetchEvidenceDetails();
  }, [id]);

  const fetchEvidenceDetails = async () => {
    try {
      const response = await evidenceAPI.getById(id);
      setEvidence(response.data);
      dispatch(setSelectedEvidence(response.data));
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching evidence details');
      setLoading(false);
    }
  };

  const handleViewEvidence = () => {
    setShowPreview(true);
  };

  const handleVerify = async () => {
    setActionLoading(true);
    try {
      await evidenceAPI.verify(id);
      toast.success('Evidence verified successfully!');
      setShowVerifyModal(false);
      setShowPreview(false);
      fetchEvidenceDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify evidence');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setActionLoading(true);
    try {
      await evidenceAPI.reject(id, rejectReason);
      toast.success('Evidence rejected');
      setShowRejectModal(false);
      setShowPreview(false);
      setRejectReason('');
      fetchEvidenceDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject evidence');
    } finally {
      setActionLoading(false);
    }
  };

  const getFileUrl = () => {
    return `http://localhost:5000/${evidence?.filePath?.replace(/\\/g, '/')}`;
  };

  const isImage = evidence?.mimeType?.startsWith('image/');
  const isVideo = evidence?.mimeType?.startsWith('video/');
  const isPdf = evidence?.mimeType === 'application/pdf';

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!evidence) {
    return <div>Evidence not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Evidence Details
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{evidence.title}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Case Number</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{evidence.caseNumber}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${evidence.status === 'verified' ? 'bg-green-100 text-green-800' : 
                    evidence.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'}`}
                >
                  {evidence.status}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Upload Date</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDate(evidence.createdAt)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">File Hash (SHA-256)</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono break-all">
                {evidence.hash}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{evidence.description}</dd>
            </div>
            
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Blockchain Record</dt>
              <dd className="mt-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Transaction ID: </span>
                    <span className="font-mono">{evidence.transactionId}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Block Number: </span>
                    <span className="font-mono">{evidence.blockNumber}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Timestamp: </span>
                    {formatDate(evidence.blockchainTimestamp)}
                  </p>
                </div>
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Activity Log</dt>
              <dd className="mt-1">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {evidence.activityLog?.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== evidence.activityLog.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800
                                ${activity.type === 'create' ? 'bg-blue-500' :
                                  activity.type === 'update' ? 'bg-yellow-500' :
                                  activity.type === 'verify' ? 'bg-green-500' :
                                  'bg-gray-500'}`}
                              >
                                <svg
                                  className="h-5 w-5 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {activity.description}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(activity.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {evidence.status === 'pending' && canVerify && (
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="primary" onClick={handleViewEvidence}>
            Review Evidence
          </Button>
        </div>
      )}

      {evidence.status === 'verified' && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-green-700 dark:text-green-400 font-medium">
            ✓ This evidence has been verified by {evidence.verifiedBy?.name || 'an administrator'}
          </p>
        </div>
      )}

      {evidence.status === 'rejected' && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-700 dark:text-red-400 font-medium">
            ✗ This evidence has been rejected
          </p>
        </div>
      )}

      {/* Evidence Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPreview(false)} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all sm:max-w-4xl sm:w-full mx-4">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Evidence Preview: {evidence.title}
                  </h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="px-4 py-5 sm:px-6">
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                  {isImage && (
                    <img src={getFileUrl()} alt={evidence.title} className="max-h-[500px] object-contain" />
                  )}
                  {isVideo && (
                    <video controls className="max-h-[500px]">
                      <source src={getFileUrl()} type={evidence.mimeType} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {isPdf && (
                    <iframe src={getFileUrl()} className="w-full h-[500px]" title="PDF Preview" />
                  )}
                  {!isImage && !isVideo && !isPdf && (
                    <div className="text-center">
                      <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Preview not available for this file type
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        {evidence.fileName} ({evidence.mimeType})
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>File Hash:</strong> <span className="font-mono">{evidence.hash}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <strong>Case Number:</strong> {evidence.caseNumber}
                  </p>
                </div>
              </div>
              
              {evidence.status === 'pending' && canVerify && (
                <div className="px-4 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                  <Button variant="danger" onClick={() => setShowRejectModal(true)}>
                    Reject Evidence
                  </Button>
                  <Button variant="primary" onClick={() => setShowVerifyModal(true)}>
                    Verify Evidence
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verify Confirmation Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowVerifyModal(false)} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Confirm Verification
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to verify this evidence? This action will mark the evidence as verified and record it in the activity log.
              </p>
              <div className="flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setShowVerifyModal(false)} disabled={actionLoading}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleVerify} disabled={actionLoading}>
                  {actionLoading ? 'Verifying...' : 'Confirm Verify'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowRejectModal(false)} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Reject Evidence
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please provide a reason for rejecting this evidence:
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500"
                placeholder="Enter rejection reason..."
              />
              <div className="flex justify-end space-x-3 mt-4">
                <Button variant="secondary" onClick={() => setShowRejectModal(false)} disabled={actionLoading}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleReject} disabled={actionLoading}>
                  {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}