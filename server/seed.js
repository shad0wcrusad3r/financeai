const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Goal = require('./models/Goal');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected to seed data');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();

  try {
    await User.deleteMany();
    await Transaction.deleteMany();
    await Goal.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test1234', salt);

    const createdUser = await User.create({
      name: 'Test User',
      email: 'test@financeai.com',
      password: hashedPassword,
    });

    const userId = createdUser._id;

    const sampleTransactions = [
      { userId, type: 'income', amount: 5000, category: 'Salary', description: 'Monthly Salary', date: new Date('2023-01-05') },
      { userId, type: 'expense', amount: 1200, category: 'Rent', description: 'Apartment Rent', date: new Date('2023-01-07') },
      { userId, type: 'expense', amount: 300, category: 'Food', description: 'Groceries', date: new Date('2023-01-10') },
      { userId, type: 'income', amount: 800, category: 'Freelance', description: 'Web Project', date: new Date('2023-02-02') },
      { userId, type: 'expense', amount: 1500, category: 'Rent', description: 'Apartment Rent', date: new Date('2023-02-07') },
      { userId, type: 'expense', amount: 400, category: 'Food', description: 'Dining Out', date: new Date('2023-02-15') },
      { userId, type: 'expense', amount: 150, category: 'Transport', description: 'Gas', date: new Date('2023-02-20') },
      { userId, type: 'income', amount: 5000, category: 'Salary', description: 'Monthly Salary', date: new Date('2023-03-05') },
      { userId, type: 'expense', amount: 1500, category: 'Rent', description: 'Apartment Rent', date: new Date('2023-03-07') },
      { userId, type: 'expense', amount: 500, category: 'Food', description: 'Groceries', date: new Date('2023-03-12') },
      { userId, type: 'expense', amount: 200, category: 'Entertainment', description: 'Movies', date: new Date('2023-03-18') },
    ];

    await Transaction.insertMany(sampleTransactions);

    const sampleGoals = [
      { userId, title: 'Emergency Fund', targetAmount: 10000, currentAmount: 3500, deadline: new Date('2024-12-31'), category: 'Emergency Fund' },
      { userId, title: 'New Laptop', targetAmount: 2000, currentAmount: 500, deadline: new Date('2023-08-01'), category: 'Gadget' },
    ];

    await Goal.insertMany(sampleGoals);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
