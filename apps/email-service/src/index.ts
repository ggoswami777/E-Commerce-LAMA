import sendMail from "./utils/mailer";

const start=async()=>{
    try{
        await sendMail({
            email:"gaurav.goswami1304@gmail.com",
            subject:"test",
            text:"This is a test email from E-com application!"
        })
    }catch(error){
        console.error('Error starting the email service:', error);
    }
}
start();