using Amazon;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;

namespace PortfolioApi.Services;

public interface IEmailService
{
    Task SendContactNotificationAsync(string senderName, string senderEmail, string subject, string message);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendContactNotificationAsync(string senderName, string senderEmail, string subject, string message)
    {
        var fromEmail = _config["AWS:SES:FromEmail"] ?? throw new InvalidOperationException("SES FromEmail not configured");
        var toEmail = _config["AWS:SES:ToEmail"] ?? fromEmail;
        var region = _config["AWS:Region"] ?? "us-east-1";

        try
        {
            using var client = new AmazonSimpleEmailServiceClient(RegionEndpoint.GetBySystemName(region));

            var sendRequest = new SendEmailRequest
            {
                Source = fromEmail,
                Destination = new Destination { ToAddresses = new List<string> { toEmail } },
                Message = new Message
                {
                    Subject = new Content($"[Portfolio] New contact from {senderName}: {subject}"),
                    Body = new Body
                    {
                        Html = new Content($@"
                            <h2>New Contact Form Submission</h2>
                            <p><strong>Name:</strong> {senderName}</p>
                            <p><strong>Email:</strong> {senderEmail}</p>
                            <p><strong>Subject:</strong> {subject}</p>
                            <hr/>
                            <p><strong>Message:</strong></p>
                            <p>{message}</p>
                        "),
                        Text = new Content($"From: {senderName} ({senderEmail})\nSubject: {subject}\n\n{message}")
                    }
                }
            };

            await client.SendEmailAsync(sendRequest);
            _logger.LogInformation("Contact notification email sent to {ToEmail}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send contact notification email");
            throw;
        }
    }
}
