from datetime import datetime, timezone
from decimal import Decimal

from ..extensions import db


class Budget(db.Model):
    __tablename__ = "budgets"
    __table_args__ = (
        db.UniqueConstraint("user_id", "category_id", "month", name="uq_budget_user_category_month"),
    )

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    month = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    user = db.relationship("User", back_populates="budgets")
    category = db.relationship("Category", back_populates="budgets")

    def to_dict(self, spent=Decimal("0")):
        amount = Decimal(self.amount)
        spent = Decimal(spent)
        remaining = amount - spent
        percentage = min((spent / amount) * 100, Decimal("100")) if amount else Decimal("0")
        return {
            "id": self.id,
            "amount": f"{amount:.2f}",
            "month": self.month.isoformat(),
            "category_id": self.category_id,
            "category": self.category.name,
            "spent": f"{spent:.2f}",
            "remaining": f"{remaining:.2f}",
            "percentage": f"{percentage:.1f}",
        }