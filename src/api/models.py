from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }

class ClueAnswer(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    year = db.Column(db.Integer, unique=False, nullable=True)
    month = db.Column(db.Integer, unique=False, nullable=True)
    day = db.Column(db.Integer, unique=False, nullable=True)
    weekday = db.Column(db.Integer, unique=False, nullable=True)
    clue = db.Column(db.String(240), unique=False, nullable=True)
    answer = db.Column(db.String(64), unique=False, nullable=True)
    index = db.Column(db.String(12), unique=False, nullable=True)
    answer_count = db.Column(db.Integer, unique=False, nullable=True)
    answer_rank = db.Column(db.Integer, unique=False, nullable=True)

    def __repr__(self):
        return '<ClueAnswer %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "year": self.year,
            "month": self.month,
            "day": self.day,
            "weekday": self.weekday,
            "clue": self.clue,
            "answer": self.answer,
            "index": self.index,
            "answer_count": self.answer_count,
            "answer_rank": self.answer_rank,
        }