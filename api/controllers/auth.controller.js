import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const singup = async (req, res, next) => {
  const {username, email, password} = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);  
  const newUser = new User({username, email, password: hashedPassword});  
  try {

    await newUser.save();
    res.status(201).json({"message" : "User created successfully"});

  } catch (err) {
    next(err);
  }
};