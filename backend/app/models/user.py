from datetime import datetime, timezone

from ..extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(80), nullable=True)
    theme = db.Column(db.String(10), nullable=False, default="light")
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    transactions = db.relationship("Transaction", back_populates="user")
    budgets = db.relationship("Budget", back_populates="user")
