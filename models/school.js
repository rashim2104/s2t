import mongoose, { Schema, models } from "mongoose";

/**
 * Schema definition for School model
 * @typedef {Object} SchoolSchema
 * @property {string} id - Unique identifier for the school
 * @property {string} name - Name of the school
 * @property {number} status - Current status of the school (0: inactive, 1: active)
 * @property {string} deskNo - Desk/Department number
 * @property {string} deskHead - Name of the desk head/department head
 * @property {string} deskheadPhoneNumber - Contact number of desk head
 * @property {string} schoolStaff - Name of school staff representative
 * @property {string} schoolStaffPhone - Contact number of school staff
 */
const schoolSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: Number,
    required: true,
    default: 0,
    enum: [0, 1]
  },
  deskNo: {
    type: String,
    required: true,
    trim: true
  },
  deskHead: {
    type: String,
    required: true,
    trim: true
  },
  deskheadPhoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  schoolStaff: {
    type: String,
    required: true,
    trim: true
  },
  schoolStaffPhone: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

/**
 * Mongoose model for School
 * @type {mongoose.Model}
 */
const School = models.School || mongoose.model('School', schoolSchema);

export default School;