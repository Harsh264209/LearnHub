
const Course = require('../Models/Course');
const Order=require('../Models/Order')
const Category=require('../Models/Category')
const Razorpay = require('razorpay');
const fs=require('fs')
require('dotenv').config();
const slugify=require('slugify')

const addCourse = async (req, res) => {
  try {
    console.log("Request Fields:", req.fields);
    const { title, description, price,slug,ratings, category } = req.fields;
    const{img}=req.files

    switch(true){
      case !title:
        return res.status(500).send({error:"Title is Required"})
      case !description:
        return res.status(500).send({error:"Description is Required"})
      case !price:
        return res.status(500).send({error:"Price is Required"})
      case !ratings:
        return res.status(500).send({error:"Ratings is Required"})   
        
     case !category:
        return res.status(500).send({error:"category is Required"})
     case img && img.size>1000000:
        return res.status(500).send({error:"Image is Required and should be less than 1mb"})
    }

    const newCourse = new Course({...req.fields,slug:slugify(title)});

    if(img){
      newCourse.img.data=fs.readFileSync(img.path),
      newCourse.img.contentType=img.type
    }

    await newCourse.save();

    res.status(201).json({ message: 'Course added successfully', course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).select("-img").populate('category').limit(12).sort({createdAt:-1});
    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getSingleCourse = async (req, res) => {
  try {
    // const courseId = req.params.id;
    const course =  await Course.findOne({slug:req.params.slug}).select("-img").populate('category')

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




const updateCourse = async (req, res) => {
  try {
    const { title, description, price, slug, ratings, category } = req.fields;
    const img = req.files?.img; // Safely access img property

    // Validate required fields
    switch(true){
      case !title:
        return res.status(400).send({ error: "Title is Required" });
      case !description:
        return res.status(400).send({ error: "Description is Required" });
      case !price:
        return res.status(400).send({ error: "Price is Required" });
      case !ratings:
        return res.status(400).send({ error: "Ratings is Required" });   
      case !category:
        return res.status(400).send({ error: "Category is Required" });
      case img && img.size > 1000000:
        return res.status(400).send({ error: "Image is Required and should be less than 1mb" });
    }

    // Find course by ID
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(title) },
      { new: true }
    );

    // Check if course exists
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update image if provided
    if (img) {
      updatedCourse.img.data = fs.readFileSync(img.path);
      updatedCourse.img.contentType = img.type;
    }

    // Save changes
    await updatedCourse.save();

    // Send response
    res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const deletedCourse = await Course.findByIdAndDelete(courseId).select('-img');

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully', course: deletedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const getCoursesByCategory = async (req, res) => {
  try {
      const categoryName = req.params.category;
      // Find the category based on the name
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
          return res.status(404).json({ message: 'Category not found' });
      }
      const courses = await Course.find({ category: category._id });
      res.status(200).json({ courses });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};


  const photoCourseController=async(req,res)=>{
    try {
      const course =  await Course.findById(req.params.pid).select("img")

      if(course.img.data){
        res.set("Content-type",course.img.contentType)
        return res.status(200).send(course.img.data)
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  }

  const searchCourseController=async(req,res)=>{

    try {
      const{keyword}=req.params
      const results=await Course.find({
        $or:[
          {name:{$regex:keyword,$options:"i"}},
          {description:{$regex:keyword,$options:"i"}},

        ]
      }).select("-img")
      res.json(results)
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }


  }

  // const razorpay = new Razorpay({
  //   key_id: process.env.razorpay_key_id,
  //   key_secret: process.env.razorpay_key_secret
  // });


// const razorpayPaymentController = async (req, res) => {
//   try {
//       const { amount, cart } = req.body;
//       let total = 0;
//       cart.forEach((item) => {
//           total += item.price;
//       });

//       // Check if an order for the same cart items already exists
//       const existingOrder = await Order.findOne({ products: cart, buyer: req.user.userId }).select("-img");

//       if (existingOrder) {
//           // Return the existing order
//           return res.json({ orderDetails: existingOrder });
//       }

//       // Create options for Razorpay order
//       const options = {
//           amount: total * 100,
//           currency: 'INR',
//           receipt: `receipt_order_${Date.now()}`,
//           payment_capture: 1
//       };

//       // Create Razorpay order
//       razorpay.orders.create(options, async function (error, order) {
//           if (error) {
//               console.error(error);
//               return res.status(500).send(error);
//           } else {
//               // Save the order details in your database
//               try {
//                   const orderDetails = new Order({
//                       products: cart,
//                       payment: order,
//                       buyer: req.user.userId
//                   });
//                   await orderDetails.save();
//                   return res.json({ orderDetails });
//               } catch (error) {
//                   console.error(error);
//                   return res.status(500).send(error);
//               }
//           }
//       });
//   } catch (error) {
//       console.error(error);
//       return res.status(500).send(error);
//   }
// };


// const razorpay = new Razorpay({
//   key_id: process.env.razorpay_key_id,
//   key_secret: process.env.razorpay_key_secret
// });

// const razorpayPaymentController = async (req, res) => {
//   try {
//       const { amount, cart } = req.body;
//       let total = 0;
      
//       // Create a new cart without the image data
//       const cartWithoutImages = cart.map(item => ({
//           id: item.id,
//           title: item.title,
//           price: item.price
//       }));

//       // Calculate the total price of items in the cart
//       cartWithoutImages.forEach((item) => {
//           total += item.price;
//       });

//       // Check if an order for the same cart items already exists
//       const existingOrder = await Order.findOne({ products: cartWithoutImages, buyer: req.user.userId });

//       if (existingOrder) {
//           // Return the existing order
//           return res.json({ orderDetails: existingOrder });
//       }

//       // Create options for Razorpay order
//       const options = {
//           amount: total * 100,
//           currency: 'INR',
//           receipt: `receipt_order_${Date.now()}`,
//           payment_capture: 1
//       };

//       // Create Razorpay order
//       razorpay.orders.create(options, async function (error, order) {
//           if (error) {
//               console.error(error);
//               return res.status(500).send(error);
//           } else {
//               // Save the order details in your database
//               try {
//                   const orderDetails = new Order({
//                       products: cartWithoutImages,
//                       payment: order,
//                       buyer: req.user.userId
//                   });
//                   await orderDetails.save();
//                   return res.json({ orderDetails });
//               } catch (error) {
//                   console.error(error);
//                   return res.status(500).send(error);
//               }
//           }
//       });
//   } catch (error) {
//       console.error(error);
//       return res.status(500).send(error);
//   }
// };


const razorpay = new Razorpay({
  key_id: process.env.razorpay_key_id,
  key_secret: process.env.razorpay_key_secret
});

const razorpayPaymentController = async (req, res) => {
  try {
    const { amount, cart } = req.body;
    let total = 0;
    cart.forEach((item) => {
      total += item.price;
    });

    // Extract only necessary data from cart items
    const reducedCart = cart.map(({ _id, title, price }) => ({ _id, title, price }));

    // Check if an order for the same cart items already exists
    const existingOrder = await Order.findOne({ products: reducedCart, buyer: req.user.userId });

    if (existingOrder) {
      // Return the existing order
      return res.json({ orderDetails: existingOrder });
    }

    // Create options for Razorpay order
    const options = {
      amount: total * 100,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1
    };

    // Create Razorpay order
    razorpay.orders.create(options, async function (error, order) {
      if (error) {
        console.error(error);
        return res.status(500).send(error);
      } else {
        // Save the order details in your database
        try {
          const orderDetails = new Order({
            products: reducedCart, // Save the reduced cart data
            payment: order,
            buyer: req.user.userId
          });
          await orderDetails.save();
          return res.json({ orderDetails });
        } catch (error) {
          console.error(error);
          return res.status(500).send(error);
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};




module.exports = { addCourse,getCoursesByCategory,razorpayPaymentController,searchCourseController, getAllCourses,photoCourseController, getSingleCourse,updateCourse, deleteCourse };
