import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['create', 'update', 'verify', 'reject', 'access', 'download'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: String
});

const evidenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  caseNumber: {
    type: String,
    required: [true, 'Case number is required'],
    index: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'document', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  hash: {
    type: String,
    required: [true, 'File hash is required'],
    unique: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  transactionId: {
    type: String,
    default: function() {
      return 'TX' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
    }
  },
  blockNumber: {
    type: Number,
    default: function() {
      return Math.floor(Math.random() * 1000000) + 100000;
    }
  },
  blockchainTimestamp: {
    type: Date,
    default: Date.now
  },
  activityLog: [activityLogSchema],
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

evidenceSchema.index({ title: 'text', description: 'text', caseNumber: 'text' });

evidenceSchema.methods.addActivity = function(type, userId, description, ipAddress) {
  this.activityLog.push({
    type,
    user: userId,
    description,
    ipAddress
  });
  return this.save();
};

const Evidence = mongoose.model('Evidence', evidenceSchema);

export default Evidence;
