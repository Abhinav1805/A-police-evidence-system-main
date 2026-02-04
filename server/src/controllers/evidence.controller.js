import Evidence from '../models/Evidence.model.js';
import fs from 'fs';
import path from 'path';

export const createEvidence = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { title, description, caseNumber, evidenceType, fileHash } = req.body;

    const existingEvidence = await Evidence.findOne({ hash: fileHash });
    if (existingEvidence) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        message: 'Evidence with this file hash already exists',
        existingId: existingEvidence._id
      });
    }

    const evidence = await Evidence.create({
      title,
      description,
      caseNumber,
      type: evidenceType,
      hash: fileHash,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploader: req.user._id,
      activityLog: [{
        type: 'create',
        user: req.user._id,
        description: `Evidence uploaded by ${req.user.name}`,
        ipAddress: req.ip
      }]
    });

    await evidence.populate('uploader', 'name email badge');

    res.status(201).json(evidence);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

export const getAllEvidence = async (req, res) => {
  try {
    const { status, type, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { caseNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Evidence.countDocuments(query);
    const evidence = await Evidence.find(query)
      .populate('uploader', 'name email badge')
      .populate('verifiedBy', 'name email badge')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      evidence,
      totalCount: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvidenceById = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id)
      .populate('uploader', 'name email badge')
      .populate('verifiedBy', 'name email badge')
      .populate('activityLog.user', 'name email badge');

    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    await evidence.addActivity('access', req.user._id, `Evidence accessed by ${req.user.name}`, req.ip);

    res.json(evidence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvidence = async (req, res) => {
  try {
    const { title, description, caseNumber } = req.body;

    const evidence = await Evidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    if (evidence.status === 'verified') {
      return res.status(400).json({ message: 'Cannot modify verified evidence' });
    }

    evidence.title = title || evidence.title;
    evidence.description = description || evidence.description;
    evidence.caseNumber = caseNumber || evidence.caseNumber;

    evidence.activityLog.push({
      type: 'update',
      user: req.user._id,
      description: `Evidence updated by ${req.user.name}`,
      ipAddress: req.ip
    });

    await evidence.save();
    await evidence.populate('uploader', 'name email badge');

    res.json(evidence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    evidence.status = 'verified';
    evidence.verifiedBy = req.user._id;
    evidence.verifiedAt = new Date();

    evidence.activityLog.push({
      type: 'verify',
      user: req.user._id,
      description: `Evidence verified by ${req.user.name}`,
      ipAddress: req.ip
    });

    await evidence.save();
    await evidence.populate(['uploader', 'verifiedBy']);

    res.json(evidence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectEvidence = async (req, res) => {
  try {
    const { reason } = req.body;
    const evidence = await Evidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    evidence.status = 'rejected';

    evidence.activityLog.push({
      type: 'reject',
      user: req.user._id,
      description: `Evidence rejected by ${req.user.name}. Reason: ${reason || 'Not specified'}`,
      ipAddress: req.ip
    });

    await evidence.save();

    res.json(evidence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    if (evidence.status === 'verified') {
      return res.status(400).json({ message: 'Cannot delete verified evidence' });
    }

    if (fs.existsSync(evidence.filePath)) {
      fs.unlinkSync(evidence.filePath);
    }

    await Evidence.findByIdAndDelete(req.params.id);

    res.json({ message: 'Evidence deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({ message: 'Evidence not found' });
    }

    if (!fs.existsSync(evidence.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    await evidence.addActivity('download', req.user._id, `Evidence downloaded by ${req.user.name}`, req.ip);

    res.download(evidence.filePath, evidence.fileName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
