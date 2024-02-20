

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const Order=require('../Models/Order')

const register = async (req, res) => {
  try {
    const { username, email, password,answer } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      username,
      email,
      answer,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id },process.env.JWT_SECRET,{
      expiresIn: '12h',
    });

    res.json({user,token});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const test=async(req,res)=>{

  res.send("Protected Route")
}

const findAllUsers = async (req, res) => {
  try {
    // Query the database to find all users
    const users = await User.find();
    
    // If users are found, return them in the response
    res.status(200).json(users);
  } catch (error) {
    // If an error occurs, return an error response
    console.error('Error finding users:', error);
    res.status(500).json({ error: 'An error occurred while finding users.' });
  }
};


const forgotPassword=async(req,res)=>{

  try {
    const {email,answer,newPassword}=req.body

      if(!email){
        res.status(400).send({
          error:"Email is required"
        })
      }

      if(!answer){
        res.status(400).send({
          error:"Answer is required"
        })
      }

      if(!newPassword){
        res.status(400).send({
          error:"Password is required"
        })
      }

      const user=await User.findOne({email,answer})

      if(!user){
        res.status(400).send({
          sucess:false,
          message:"Wrong email or answer"
        })
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

       await User.findByIdAndUpdate(user._id,{password:hashedPassword})

       res.status(200).send({message:"Password Reset Successfully"})

  } catch (error) {
    res.status(401).send({error:"Internal server Error"})
  }


}


// const updateUser=async(req,res)=>{

// try {
//   const{username,email,password}=req.body
//   const user=await User.findById(req.user._id)

//   if(password && password<6){
//     return res.json({error:'Password is required and 6 charcters long'})
//   }
//   const saltRounds = 10;
//   const hashedPassword = await bcrypt.hash(password, saltRounds);

//   const updatedUser=await User.findByIdAndUpdate(req.user._id,{
//     username:username||user.username,
//     password:hashedPassword||user.password,
//     // name:name||user.name,
//   },{new:true})

//   res.status(201).send({
//     sucess:true,
//     message:"Profile Updated sucessfully",
//     updatedUser
//   })

// } catch (error) {
//   res.status(401).send({error:"Internal server Error", sucess:false})
//   console.log(error)
// }

// }

const updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findById(req.user._id);

    // Check password length
    if (password && password.length < 6) {
      return res.json({ error: 'Password must be at least 6 characters long' });
    }

    // Hash the password if provided
    let hashedPassword;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // Update user data conditionally
    const updatedUserData = {};
    if (username) updatedUserData.username = username;
    if (hashedPassword) updatedUserData.password = hashedPassword;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updatedUserData,
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Profile updated successfully',
      updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error', success: false });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error', success: false });
  }
};




const getOrders=async(req,res)=>{ 

  try {

    const orders=await Order.find({buyer:req.user.userId}).populate("products","-img").populate("buyer","name")
     res.send(orders)
    
  } catch (error) {
    console.error('Error in getting orders:', error);
    res.status(500).json({ error: 'Internal server error', success: false });
  }

}


const getAllorders=async(req,res)=>{
  try {
    const orders=await Order.find({}).populate("products","-name").populate('buyer','name').sort({createdAt:'-1'})
    res.send(orders)
  } catch (error) {
    console.error('Error in fetching orders:', error);
    res.status(500).json({ error: 'Internal server error', success: false })
  }
}


module.exports = { register,findAllUsers,getOrders,deleteUser, getAllorders,login ,test,forgotPassword,updateUser};




  
