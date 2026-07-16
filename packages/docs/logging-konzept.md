# Logging Concept for the Payment Process

## Purpose

Logging helps detect errors quickly and makes payment processes traceable without storing sensitive data.

---

## Which events should be logged?

- User login attempts
- Payment started
- Payment completed successfully
- Payment failed
- API errors
- Database errors
- Server errors
- Changes to the order or payment status
- Refunds and cancellations

---

## Which data must NOT be logged?

The following information must never be stored in log files:

- Passwords
- Full credit card numbers
- CVV or CVC codes
- Full IBANs
- PayPal credentials
- Access tokens
- Session IDs
- API secrets
- Sensitive personal data that is not required for troubleshooting

Where identifiers are necessary, they should be masked or pseudonymized.

---

## Recommended log levels

| Log level | Meaning |
|-----------|---------|
| INFO | Normal and successful events |
| WARN | Unusual events that do not stop the application |
| ERROR | Failed operations and errors |
| DEBUG | Detailed information for development only |

---

## Security measures

- Restrict access to log files
- Protect logs against unauthorized modification and deletion
- Archive logs regularly
- Define suitable retention periods
- Anonymize or pseudonymize personal data
- Encrypt log transmission where necessary
- Prevent log injection by validating user-controlled input
- Monitor security-relevant events

---

## Example log entries

Good examples:

```text
INFO payment_started orderId=4711
INFO payment_completed orderId=4711 status=CAPTURED
WARN payment_provider_timeout orderId=4711
ERROR payment_failed orderId=4711 errorCode=PAYMENT_DECLINED