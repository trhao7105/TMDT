import logging

logger = logging.getLogger(__name__)

async def send_verification_email(email: str, token: str):
    # This is a mock email sender! In production, use smtplib, fastapi-mail or a 3rd party like SendGrid
    verification_link = f"http://localhost:8000/api/auth/verify-email?token={token}"
    
    print("\n" + "=" * 60)
    print("MOCK EMAIL SENDER ACTIVATED")
    print(f"TO: {email}")
    print(f"SUBJECT: Vui lòng xác thực tài khoản iLocker của bạn")
    print(f"Bấm vào link sau để kích hoạt:\n-> {verification_link} <-")
    print("=" * 60 + "\n")
    
    logger.info(f"Verification email sent to {email}")
