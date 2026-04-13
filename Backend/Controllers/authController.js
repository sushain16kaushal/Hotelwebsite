import User from '../Models/Users.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found!");

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) return res.status(400).json("Wrong password or email!");

    // Token banana jisme role 'admin' ho
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // 1 din tak login rahoge
    );

    // Password hata kar baaki details bhejenge
    const { password, ...otherDetails } = user._doc;
    res.status(200).json({ details: { ...otherDetails }, token });
  } catch (err) {
    res.status(500).json(err);
  }
};