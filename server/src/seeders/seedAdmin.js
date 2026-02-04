import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'NOT FOUND');

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ role: 'Admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log(`  Email: ${existingAdmin.email}`);
      console.log('  Skipping seed...');
    } else {
      const admin = await User.create({
        name: 'System Admin',
        email: 'admin@forenchain.com',
        password: 'admin123',
        role: 'Admin',
        badge: 'ADMIN-001',
        department: 'Administration'
      });

      console.log('✅ Admin user created successfully:');
      console.log(`  Name: ${admin.name}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Password: admin123`);
      console.log(`  Role: ${admin.role}`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
