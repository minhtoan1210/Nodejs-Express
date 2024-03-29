// import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
// import { config } from 'dotenv'
// import fs from 'fs'
// import path from 'path'
// config()
// // Create SES service object.
// const sesClient = new SESClient({
//   region: process.env.AWS_REGION,
//   credentials: {
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
//   }
// })

// const verifyEmailTemplate = fs.readFileSync(path.resolve('src/templates/verify-email.html'), 'utf8')

// const createSendEmailCommand = ({
//   fromAddress,
//   toAddresses,
//   ccAddresses = [],
//   body,
//   subject,
//   replyToAddresses = []
// }: {
//   fromAddress: string
//   toAddresses: string | string[]
//   ccAddresses?: string | string[]
//   body: string
//   subject: string
//   replyToAddresses?: string | string[]
// }) => {
//   return new SendEmailCommand({
//     Destination: {
//       /* required */
//       CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
//       ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
//     },
//     Message: {
//       /* required */
//       Body: {
//         /* required */
//         Html: {
//           Charset: 'UTF-8',
//           Data: body
//         }
//       },
//       Subject: {
//         Charset: 'UTF-8',
//         Data: subject
//       }
//     },
//     Source: fromAddress,
//     ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
//   })
// }

// const sendVerifyEmail = async (toAddress: string, subject: string, body: string) => {
//   const sendEmailCommand = createSendEmailCommand({
//     fromAddress: process.env.SES_FROM_ADDRESS as string,
//     toAddresses: toAddress as string | string[],
//     body: body as string,
//     subject: subject as string
//   })
//     return await sesClient.send(sendEmailCommand)
// }

// export const sendVerifyRegisterEmail = (
//   toAddress: string,
//   email_verify_token: string,
//   template: string = verifyEmailTemplate
// ) => {
//   return sendVerifyEmail(
//     toAddress,
//     'Verify your email',
//     template
//       .replace('{{title}}', 'Please verify your email')
//       .replace('{{content}}', 'Click the button below to verify your email')
//       .replace('{{titleLink}}', 'Verify')
//       .replace('{{link}}', `${process.env.clientUrl}/email-verifications?token=${email_verify_token}`)
//   )
// }

// export const sendForgotPasswordEmail = (
//   toAddress: string,
//   forgot_password_token: string,
//   template: string = verifyEmailTemplate
// ) => {
//   return sendVerifyEmail(
//     toAddress,
//     'Forgot Password',
//     template
//       .replace('{{title}}', 'You are receiving this email because you requested to reset your password')
//       .replace('{{content}}', 'Click the button below to reset your password')
//       .replace('{{titleLink}}', 'Reset Password')
//       .replace('{{link}}', `${process.env.clientUrl}/forgot-password?token=${forgot_password_token}`)
//   )
// }

// // sendVerifyEmail('nguyenvuminhtoan1999@gmail.com', 'Tiêu đề email', '<h1>Nội dung email</h1>')
