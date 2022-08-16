"""fill clue_answer table

Revision ID: f2cb3d55f82b
Revises: 912c0f95caee
Create Date: 2022-08-08 13:47:40.319805

"""
import os
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f2cb3d55f82b'
down_revision = '912c0f95caee'
branch_labels = None
depends_on = None


def upgrade():
    filename = os.path.join(os.getenv("ROOT_PATH"), 'data', 'NYT Crossword_2009_2016_processed.csv')
    op.execute(f"""COPY clue_answer(year,weekday,clue,answer,explanation,answer_count,answer_rank) FROM '{filename}' DELIMITER ',' CSV HEADER QUOTE '"';""", execution_options=None)
    pass


def downgrade():
    op.execute("TRUNCATE TABLE clue_answer RESTART IDENTITY;")

