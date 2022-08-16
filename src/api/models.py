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
    weekday = db.Column(db.String(3), unique=False, nullable=True)
    clue = db.Column(db.String(180), unique=False, nullable=True)
    word = db.Column(db.String(64), unique=False, nullable=True)
    total = db.Column(db.Integer, unique=False, nullable=True)
    explanation = db.Column(db.String(2000), unique=False, nullable=True)

    def __repr__(self):
        return '<ClueAnswer %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "year": self.year,
            "weekday": self.weekday,
            "clue": self.clue,
            "answer": self.word,
            "total": self.total,
            "explanation": self.explanation
        }