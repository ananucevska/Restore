using API.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;

namespace API.Controllers
{
    public class ContactController : BaseApiController
    {
        private readonly IConfiguration _configuration;

        public ContactController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<ActionResult> SendContactMessage([FromBody] ContactDto contactDto)
        {
            try
            {
                // Email configuration
                var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp-mail.outlook.com";
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var smtpUsername = _configuration["EmailSettings:Username"] ?? "";
                var smtpPassword = _configuration["EmailSettings:Password"] ?? "";
                var fromEmail = _configuration["EmailSettings:FromEmail"] ?? "";
                var toEmail = "ana.nucevska@students.finki.ukim.mk";

                // Validate configuration
                if (string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword) || string.IsNullOrEmpty(fromEmail))
                {
                    return BadRequest(new { message = "Email configuration is incomplete" });
                }

                // Create email message
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail, "Diplomska Contact Form"),
                    Subject = $"Contact Form: {contactDto.Subject}",
                    Body = $@"
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Name:</strong> {contactDto.FirstName} {contactDto.LastName}</p>
                        <p><strong>Email:</strong> {contactDto.Email}</p>
                        <p><strong>Subject:</strong> {contactDto.Subject}</p>
                        <p><strong>Message:</strong></p>
                        <p>{contactDto.Message}</p>
                    ",
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                // Configure SMTP client
                using var smtpClient = new SmtpClient(smtpServer, smtpPort)
                {
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    Timeout = 30000 // 30 seconds timeout
                };

                // Send email
                await smtpClient.SendMailAsync(mailMessage);

                return Ok(new { message = "Contact message sent successfully" });
            }
            catch (SmtpException smtpEx)
            {
                return BadRequest(new { message = "SMTP Error: " + smtpEx.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to send contact message: " + ex.Message });
            }
        }
    }
}
