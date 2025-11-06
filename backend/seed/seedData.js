import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});

    // Create admin
    const admin = new User({
      username: 'ramsir',
      password: 'ram123',
      role: 'admin',
      name: 'Ram Sir',
      email: 'ramsir@ramc.com'
    });

    // Create sample courses
    const course1 = new Course({
      title: 'Full Stack Web Development',
      description: 'Learn complete web development with React, Node.js, MongoDB and more',
      duration: '12 weeks',
      price: 15000
    });

    const course2 = new Course({
      title: 'Data Science with Python',
      description: 'Master data science concepts with Python programming',
      duration: '10 weeks',
      price: 12000
    });

    const course3 = new Course({
      title: 'Mobile App Development',
      description: 'Build cross-platform mobile applications',
      duration: '8 weeks',
      price: 10000
    });

    await course1.save();
    await course2.save();
    await course3.save();

    // Create sample students
    const student1 = new User({
      username: 'student1',
      password: '123456',
      role: 'student',
      name: 'Alice Johnson',
      email: 'alice@student.com',
      studentId: 'STU001',
      phone: '+1234567890',
      address: '123 Main St, City, State',
      socials: {
        github: 'https://github.com/alice',
        linkedin: 'https://linkedin.com/in/alice',
        instagram: 'https://instagram.com/alice'
      },
      assignedCourses: [
        {
          course: course1._id,
          startDate: new Date('2024-01-15'),
          fees: {
            total: course1.price,
            paid: 5000,
            remaining: course1.price - 5000
          }
        }
      ]
    });

    const student2 = new User({
      username: 'student2',
      password: '123456',
      role: 'student',
      name: 'Bob Smith',
      email: 'bob@student.com',
      studentId: 'STU002',
      phone: '+0987654321',
      address: '456 Oak St, City, State',
      socials: {
        github: 'https://github.com/bob',
        linkedin: 'https://linkedin.com/in/bob',
        instagram: 'https://instagram.com/bob'
      },
      assignedCourses: [
        {
          course: course2._id,
          startDate: new Date('2024-02-01'),
          fees: {
            total: course2.price,
            paid: 12000,
            remaining: 0
          }
        },
        {
          course: course3._id,
          startDate: new Date('2024-03-01'),
          fees: {
            total: course3.price,
            paid: 3000,
            remaining: course3.price - 3000
          }
        }
      ]
    });

    await admin.save();
    await student1.save();
    await student2.save();

    console.log('Seed data created successfully!');
    console.log('Admin credentials: ramsir / ram123');
    console.log('Student 1 credentials: student1 / 123456');
    console.log('Student 2 credentials: student2 / 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();