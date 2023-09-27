import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv .config();
export const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.NODEMAILER_USER,
        pass:process.env.NODEMAILER_PASS
    }
})

export const mailOptions={
    from:"gangadharana01@gmail.com",
    to:'anbumanickam1972@gmail.com',
    subject:'Hello',
    text:'that was easy'
}
