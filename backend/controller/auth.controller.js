import nodemailer from 'nodemailer'
import bodyparser from 'body-parser'
import randomstring from 'randomstring'
import path from 'path'
import auth from '../middleware/auth';
import { error, info } from 'console';

const otpcache = {};

function genotp()
{
    return randomstring.generate({length : 4 , charset : 'numeric'});
}

function sendotp(email,otp)
{
     const mailoptions = {
        from : "fashionfiesta2056@gmail.com" ,
        to : email,
        subject : 'Otp Verification',
        text : `Your OTP for Fashion_Fiesta is ${otp}`
     };

     let transporter = nodemailer.createTransport({
         service:`Gmail`,
         auth: {
            user : 'fashionfiesta2056@gmail.com',
            pass : 'tejc kbvp bntm rppn',
         },
         tls : {
             rejectUnauthrized : false,
         },
     });

     transporter.sendMail(mailoptions , (error,info) => 
    {
         if(error)
         {
            console.log("Error ocuured" , error)
         }
         else{
             console.log("user email was sent succesfully",info.response)
         }
});
}




