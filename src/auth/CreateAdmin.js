const {userRole} = require("../Users/const");
const User = require("../Users/models");

const createAdmin = async () => {
  try {
    // Check if an admin user already exists
    const existingAdmin = await User.findOne({ role: USER_ROLES.ADMIN });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    // Create a new admin user
    const adminUser = new User({
      username: "admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: USER_ROLES.ADMIN,
    });
    await adminUser.save();
    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};
