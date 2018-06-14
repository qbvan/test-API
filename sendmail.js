const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Mail = require('../servers/mail');
const nodemailer = require('nodemailer');
const User = require('./../servers/user');
const jwt = require('jsonwebtoken');
const config = require('../db/db');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
//const methodOverride = require('method-override');

// this line is mongoDB uri
mongoose.Promise = global.Promise;
mongoose.connect(db, (err) => {
    if (err) {
        consele.log(err);
    } else {
        console.log('connect successfully');
    }
});

router.get('/khachhang', (req, res) => {
    Mail.find({}, (err, mails) => {
        if (err) {
            res.json({success: false, message: err});
        } else {
            if (!mails) {
                res.json({success: false, message: 'does not exist'});
            } else {
                res.json({success: true, mails: mails});
            }
        }
    }).sort({'_id': -1});
});


router.post('/sendmail', (req, res) => {
    if (!req.body.name) {
        res.json({success: false, message: 'name is required'});
    } else {
        if (!req.body.email) {
            res.json({success: false, message: 'email is required'});
        } else {
            if (!req.body.phone) {
                res.json({success: false, message: 'phone is required'});
            } else {
                if (!req.body.date) {
                    res.json({success: false, message:'date is required'});
                } else {
                    if (!req.body.hours) {
                        res.json({success: false, message: 'hours is required'});
                    } else {
                        const mail = new Mail ({
                            name: req.body.name,
                            email: req.body.email,
                            phone: req.body.phone,
                            date: req.body.date,
                            hours: req.body.hours,
                            child: req.body.child,
                            person: req.body.person,
                            message: req.body.message
                        });
                        mail.save((err) => {
                            if (err) {
                                res.json({success:false, message: err});
                            } else {
                                res.json({success: true, message: 'send'});
                                const output = `
                                        <h4>Reservation: </h4>
                                        <table>
                                            <tr>
                                                <td>Name</td>
                                                <td>${req.body.name}</td>
                                            </tr>
                                            <tr>
                                                <td>Email</td>
                                                <td>${req.body.email}</td>
                                            </tr>
                                            <tr>
                                                <td>Phone</td>
                                                <td>${req.body.phone}</td>
                                            </tr>
                                            <tr>
                                                <td>Person</td>
                                                <td>${req.body.person}</td>
                                            </tr>
                                            <tr>
                                                <td>Child</td>
                                                <td>${req.body.child}</td>
                                            </tr>
                                            <tr>
                                                <td>Date</td>
                                                <td>${req.body.date}</td>
                                            </tr>
                                            <tr>
                                                <td>Hours</td>
                                                <td>${req.body.hours}</td>
                                            </tr>
                                            <tr>
                                                <td>Message</td>
                                                <td>${req.body.message}</td>
                                            </tr>
                                    </table>

                                    `;
      nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: '*******', // generated ethereal user
                pass: '---' // generated ethereal password
            }
        });
        // setup email data with unicode symbols
        const mailOptions = {
            from: '"EMILY RESTAURANT 👻"', /// sender address
            to: `${req.body.email} , ***`, // list of receivers
            subject: 'Reservation: ', // Subject line
            text: 'Hello world?', // plain text body
            html: output // html body
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
                        }
                        });
                    }
                }
            }
        }
    }
});

router.post('/register', (req, res) => {
    if (!req.body.email) {
        res.json({
          success: false,
          message: 'you must provide e-mail'
        });
      } else {
        if (!req.body.username) {
          res.json({
            success: false,
            message: 'you must provide username'
          });
        } else {
          if (!req.body.password) {
            res.json({
              success: false,
              message: 'you must provide password'
            });
          } else {
            let user = new User({
              email: req.body.email,
              username: req.body.username,
              password: req.body.password
            });
            user.save((err) => {
              // Check if error occured
              if (err) {
                // Check if error is an error indicating duplicate account
               console.log(err);
              } else {
                res.json({
                  success: true,
                  message: 'Acount registered!'
                }); // Return success
              }
            });
          }
        }
      }
});
// log in api
router.post('/login', (req, res) => {
    if (!req.body.email) {
        res.json({success: false, message: 'no Email'});
    } else {
        if (!req.body.password) {
            res.json({success: false, message: 'no Password'});
        } else {
            User.findOne({email: req.body.email.toLowerCase()}, (err, user) => {
                if (err) {
                    res.json({success: false, message: err});
                } else {
                    if (!user) {
                        res.json({success: false, message: 'user not found'});
                    } else {
                        // check valid password
                        const validPassword = user.comparePassword(req.body.password);
                        if(!validPassword) {
                            res.json({success: false, message:'Invalid password'});
                        } else {
                            // create token user
                            const token = jwt.sign({userId: user._id}, config.secret, {
                                expiresIn: '1h'
                            });
                            //
                            res.json({
                                success: true,
                                message: 'Success',
                                token: token,
                                user: {
                                    user: user.email
                                }
                            });
                        }
                    }
                }
            });
        }
    }
});
router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.json({
        success: false,
        message: 'No token provided'
      }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token, config.secret, (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.json({
            success: false,
            message: 'Token invalid: ' + err
          }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  });



module.exports = router;
