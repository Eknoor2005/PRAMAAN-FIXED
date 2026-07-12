import { connectDB, disconnectDB } from '../config/database.js';
import { UserModel } from '../models/User.js';
import { AuthService } from '../services/auth.service.js';
import { EncryptionService } from '../services/encryption.service.js';

const ADMIN_EMAIL = 'eknoor112211@gmail.com';
const ADMIN_PASSWORD = 'TemporaryAdminPassword123!'; // MUST CHANGE

async function seedAdmin() {
  try {
    await connectDB();

    const existingAdmin = await UserModel.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Admin user already exists.');
    } else {
      const hashedPassword = await AuthService.hashPassword(ADMIN_PASSWORD);
      const { publicKey, privateKey } = EncryptionService.generateKeyPair();

      const adminUser = new UserModel({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        publicKey,
        privateKeyEncrypted: privateKey,
        isEmailVerified: true,
      });

      await adminUser.save();
      console.log('✓ Admin user created successfully.');
    }
  } catch (error) {
    console.error('✗ Error seeding admin:', error);
  } finally {
    await disconnectDB();
  }
}

seedAdmin();
