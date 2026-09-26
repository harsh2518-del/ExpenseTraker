from datetime import date, datetime, timezone
from decimal import Decimal

from ..extensions import db


class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    transaction_type = db.Column(db.String(20), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    transaction_date = db.Column(db.Date, nullable=False, default=date.today)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    user = db.relationship("User", back_populates="transactions")
    category = db.relationship("Category", back_populates="transactions")

    def to_dict(self):
        return {
            "id": self.id,
            "amount": str(Decimal(self.amount).quantize(Decimal("0.01"))),
            "type": self.transaction_type,
            "description": self.description,
            "date": self.transaction_date.isoformat(),
            "user_id": self.user_id,
            "category_id": self.category_id,
            "category": self.category.name if self.category else None,
        }