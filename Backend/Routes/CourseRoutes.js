
const express = require('express');
const formidable=require('express-formidable')
const router = express.Router();
const courseController = require('../Controllers/CourseController');
const { authenticateUser, isAdmin } = require('../Middlewares/authMiddleware');


router.post('/add',authenticateUser, isAdmin,formidable(), courseController.addCourse);
router.get('/all',  courseController.getAllCourses);
router.get('/:slug',courseController.getSingleCourse);
router.get('/search/:keyword',courseController.searchCourseController);
router.get('/category/:category', courseController.getCoursesByCategory); // New route for category-wise courses
router.put('/:pid', authenticateUser, isAdmin,formidable(),courseController.updateCourse);
router.delete('/:id',authenticateUser, isAdmin, courseController.deleteCourse);
router.get('/product-photo/:pid',courseController.photoCourseController)
router.post('/razorpay/payment',authenticateUser,courseController.razorpayPaymentController);
module.exports = router;
