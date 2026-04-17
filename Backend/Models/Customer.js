import mongoose from "mongoose";
const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // OAuth users ke liye ye empty rahega
  googleId: { type: String },
  facebookId: { type: String },
  profilePic: { type: String },
  role: { type: String, default: 'customer' }, // 'admin' bhi ho sakta hai
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

export default mongoose.model('Customer', CustomerSchema);