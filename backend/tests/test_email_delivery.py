import sys
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.api.endpoints.auth import send_password_reset_otp


class PasswordResetEmailTest(unittest.TestCase):
    @patch("app.api.endpoints.auth.smtplib.SMTP_SSL")
    @patch("app.api.endpoints.auth.settings.GMAIL_APP_PASSWORD", "test-app-password")
    @patch("app.api.endpoints.auth.settings.GMAIL_USER", "sender@example.com")
    def test_sends_password_reset_code_via_gmail_smtp(self, smtp_ssl):
        smtp = MagicMock()
        smtp_ssl.return_value.__enter__.return_value = smtp

        send_password_reset_otp("recipient@example.com", "123456")

        smtp_ssl.assert_called_once_with("smtp.gmail.com", 465, timeout=10)
        smtp.login.assert_called_once_with("sender@example.com", "test-app-password")
        smtp.send_message.assert_called_once()


if __name__ == "__main__":
    unittest.main()
