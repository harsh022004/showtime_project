const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = new User({
        name: "System Admin",
        email: "admin@movie.com",
        password: hashedPassword,
        role: "admin"
      });
      await admin.save();
      console.log("Admin account created: admin@movie.com / admin123");
    } else {
      console.log("ℹAdmin already exists, skipping seed.");
    }
  } catch (err) {
    console.error("Seeding error:", err);
  }
};

module.exports = seedAdmin;