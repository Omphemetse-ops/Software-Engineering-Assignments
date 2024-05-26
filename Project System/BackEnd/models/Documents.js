const mongoose = require('mongoose');

const DocumentFieldSchema = new mongoose.Schema({
  path: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const DocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfor', required: true },
  driversLicence: { type: DocumentFieldSchema, required: true },
  id: { type: DocumentFieldSchema, required: true },
  bankStatement: { type: DocumentFieldSchema, required: true },
  learningCertificate: { type: DocumentFieldSchema, required: true }
}, {
  collection: "Documents"
});

module.exports = mongoose.model('Documents', DocumentSchema);

