import User from '../Models/Users.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import Customer from '../Models/Customer.js'
import crypto from 'crypto';
// Admin Register (Sirf ek baar use karne ke liye)
/*export const registerAdmin = async (req, res) => {
    console.log(req.body);
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            email: req.body.email,
            password: hash,
            role: "admin", // Explicitly admin de rahe hain
        });

        await newUser.save();
        res.status(200).json("Admin created successfully!");
    } catch (err) {
        res.status(500).json(err);
    }
};*/
// --- GENERATE TOKEN HELPER ---
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
};
// 1. ADMIN LOGIN (Specifically for Admin Panel)
export const adminLogin = async (req, res) => {
  try {
    // User model (Admin) mein check karega
    const admin = await User.findOne({ email: req.body.email });
    if (!admin) return res.status(404).json("Admin not found!");

    // Check if it's actually an admin
    if (admin.role !== 'admin') return res.status(403).json("Access denied! Not an admin.");

    const isPasswordCorrect = await bcrypt.compare(req.body.password, admin.password);
    if (!isPasswordCorrect) return res.status(400).json("Wrong password or email!");

    const token = generateToken(admin);

    const { password, ...otherDetails } = admin._doc;
    res.status(200).json({ details: { ...otherDetails }, token });
  } catch (err) {
    res.status(500).json(err);
  }
};
// LOGIN LOGIC
export const login = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.body.email });
    if (!customer) return res.status(404).json("User not found!");

    const isPasswordCorrect = await bcrypt.compare(req.body.password, customer.password);
    if (!isPasswordCorrect) return res.status(400).json("Wrong password or email!");

    // Token banana jisme role 'admin' ho
    const token = jwt.sign(
      { id: customer._id, role: customer.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // 1 din tak login rahoge
    );

    // Password hata kar baaki details bhejenge
    const { password, ...otherDetails } = customer._doc;
    res.status(200).json({ details: { ...otherDetails }, token });
  } catch (err) {
    res.status(500).json(err);
  }
};
export const custlogin=async (req, res) => {
    try {
        const customer = await Customer.findOne({ email: req.body.email });
        if (!customer) return res.status(404).json("User not found!");

        // OAuth Check: Agar user ne Google se sign up kiya hai aur password set nahi kiya
        if (!customer.password) {
            return res.status(400).json("This account uses Google/Facebook login. Please use that!");
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, customer.password);
        if (!isPasswordCorrect) return res.status(400).json("Wrong password or email!");

        const token = generateToken(customer);
        const { password, ...otherDetails } = customer._doc;

        res.status(200).json({ details: { ...otherDetails }, token });
    } catch (err) {
        res.status(500).json(err);
    }
};
// 1. SIGN UP (Email/Password)
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let customer = await Customer.findOne({ email });
    if (customer) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    customer = await Customer.create({ name, email, password: hashedPassword });
    
    res.status(201).json({ msg: "Registration successful" });
  } catch (err) { res.status(500).send("Server Error"); }
};
// --- FORGOT PASSWORD ---
export const forgotPassword = async (req, res) => {
    try {
        const customer = await Customer.findOne({ email: req.body.email });
        if (!customer) return res.status(404).json({ msg: "User not found" });

        // Token generation
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // Hash and save to DB
        customer.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        customer.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 mins
        await customer.save();

        const resetUrl = `${process.env.PRODUCTIONURL}/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { 
                user: process.env.EMAIL_USER, // .env mein EMAIL_USER hona chahiye
                pass: process.env.EMAIL_PASS  // Gmail App Password use karna
            }
        });

        await transporter.sendMail({
            to: customer.email,
            subject: 'Euphoria Shimla - Password Reset',
            html: `<h3>Password Reset Request</h3>
                   <p>Click <a href="${resetUrl}">here</a> to reset your password. Valid for 30 mins.</p>`
        });

        res.json({ msg: "Reset link sent to your email! 📧" });
    } catch (err) {
        res.status(500).json("Mail System Error");
    }
};

// --- RESET PASSWORD (Token verify karke naya password set karna) ---
export const resetPassword = async (req, res) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    try {
        const customer = await Customer.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!customer) return res.status(400).json("Invalid or Expired Token");

        // Set naya password
        customer.password = await bcrypt.hash(req.body.password, 10);
        customer.resetPasswordToken = undefined;
        customer.resetPasswordExpire = undefined;
        await customer.save();

        res.status(200).json("Password Updated Successfully!");
    } catch (err) {
        res.status(500).json("Error resetting password");
    }
};