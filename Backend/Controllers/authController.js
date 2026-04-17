import User from '../Models/Users.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import Customer from '../Models/Customer.js'
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
// 2. FORGOT PASSWORD (The Logic)
export const forgotPassword = async (req, res) => {
  const customer = await Customer.findOne({ email: req.body.email });
  if (!customer) return res.status(404).json({ msg: "User not found" });

  // Reset Token banao
  const resetToken = crypto.randomBytes(20).toString('hex');
  customer.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  customer.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 mins expiry

  await customer.save();

  // Email bhejo
  const resetUrl = `${process.env.PRODUCTIONURL}/reset-password/${resetToken}` ;
  
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { customer: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  await transporter.sendMail({
    to: customer.email,
    subject: 'Euphoria - Password Reset Request',
    text: `Reset your password here: ${resetUrl}`
  });

  res.json({ msg: "Reset link sent to your email! 📧" });
};