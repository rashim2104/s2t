import mongoose, { Schema, models } from "mongoose";

/**
 * Schema for school details
 * @type {Schema}
 */
const DetailSchema = new Schema({
  schoolId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  studentCount: {
    type: Number,
    required: true,
    min: 0,
  },
  teacherCount: {
    type: Number,
    required: true,
    min: 0,
  },
  contact: {
    type: String,
    required: true,
    match: [/^\+?[\d\s-]+$/, 'Please enter a valid phone number'],
  },
  altContact: {
    type: String,
    required: true,
    match: [/^\+?[\d\s-]+$/, 'Please enter a valid phone number'],
  },
  // Token management fields
  firstToken: { type: Number },
  lastToken: { type: Number },
  tFirstToken: { type: Number },
  tLastToken: { type: Number },
  etFirstToken: { type: Number },
  etLastToken: { type: Number },
  // Counts
  eStudentCount: { type: Number, min: 0 },
  eTeacherCount: { type: Number, min: 0 },
  eFirstToken: { type: Number },
  eLastToken: { type: Number },
}, {
  timestamps: true
});

const Details = models.Details || mongoose.model('Details', DetailSchema);

export default Details;