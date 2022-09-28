

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {

  const msg = {
    to: email, // Change to your recipient
    from: 'federexus@hotmail.com', // Change to your verified sender
    subject: 'Welcome to NoteIt!',
    text: `Thanks for joining in, ${name}. For any suggestion let me know`
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

const sendGoodbyeEmail = (email, name) => {

  const msg = {
    to: email, // Change to your recipient
    from: 'federexus@hotmail.com', // Change to your verified sender
    subject: 'We don\'t want to lose you!',
    text: `You came back everytime you want, ${name}. For any suggestion let me know`
  }
  sgMail
    .send(msg)
    .catch((error) => {
      console.error(error)
    })
}

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail
}