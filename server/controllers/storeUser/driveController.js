
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { driveAccess } from '../shared.js';
// import { auth } from '../../server.js'; // Adjust the path as necessary
export class DriveController{
     SCOPE = "https://www.googleapis.com/auth/drive";

    
static async  shareFileWithUser(fileId, email) {
 
    const auth=await driveAccess()   
    const drive = google.drive({ version: 'v3', auth });
    // Give read access to the user
    await drive.permissions.create({
      fileId,
      requestBody: {
        type: 'user',
        role: 'reader',
        emailAddress: email,
      },
    });
  
    // Get file webView link
    await drive.files.update({
      fileId,
      requestBody: {
        viewersCanCopyContent: false, // disables download, print, copy
        copyRequiresWriterPermission: true,
      },
    });
    const file = await drive.files.get({
      fileId,
      fields: 'webViewLink',
    });
   
    return file.data.webViewLink;
  }
  
  
  static async  sendDownloadEmail(to, productName, link) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user:process.env.ADMIN_EMAIL, // 🔴 Replace with your email
          pass:process.env.ADMIN_PASS,
      },
    });
  
    const mailOptions = {
      from: '"Your Store" <yourcompany@gmail.com>',
      to,
      subject: `Your download: ${productName}`,
      html: `
       <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Thank You Email</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td align="center" style="background-color:#4f46e5; color:#ffffff; padding:20px;">
                  <h2 style="margin:0; font-size:24px;">Digital Store</h2>
                </td>
              </tr>
  
              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#333333;">
                  <h3 style="margin-top:0; font-size:22px; color:#4f46e5;">Thank you for your purchase!</h3>
                  <p style="font-size:16px; line-height:1.5; margin:16px 0;">
                    You can download <strong>${productName}</strong> here:
                  </p>
  
                  <!-- Download Button -->
                  <p>
                    <a href="${link}" target="_blank" style="display:inline-block; background-color:#4f46e5; color:#ffffff; text-decoration:none; padding:12px 20px; border-radius:6px; font-size:16px;">
                      Download Now
                    </a>
                  </p>
  
                  <!-- Backup Link -->
                  <p style="margin-top:16px; font-size:14px; color:#555;">
                    Or copy the link manually:<br />
                    <a href="${link}" target="_blank" style="color:#4f46e5; word-break:break-word;">${link}</a>
                  </p>
                </td>
              </tr>
  
              <!-- Footer -->
              <tr>
                <td align="center" style="padding:20px; font-size:13px; color:#777777;">
                  &copy; 2025 Novella. All rights reserved.
                </td>
              </tr>
  
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  
      `,
      // <h3>Thank you for your purchase!</h3>
      // <p>You can download <strong>${productName}</strong> here:</p>
      // <a href="${link}" target="_blank">${link}</a>
    };
  
    await transporter.sendMail(mailOptions);
  }
  
}