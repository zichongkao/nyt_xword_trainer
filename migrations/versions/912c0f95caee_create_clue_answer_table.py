"""create clue_answer table

Revision ID: 912c0f95caee
Revises: 2807edd385a2
Create Date: 2022-08-08 13:45:34.203015

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '912c0f95caee'
down_revision = '2807edd385a2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('clue_answer',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('year', sa.Integer(), nullable=True),
    sa.Column('month', sa.Integer(), nullable=True),
    sa.Column('day', sa.Integer(), nullable=True),
    sa.Column('weekday', sa.String(length=3), nullable=True),
    sa.Column('clue', sa.String(length=240), nullable=True),
    sa.Column('answer', sa.String(length=64), nullable=True),
    sa.Column('index', sa.String(length=12), nullable=True),
    sa.Column('answer_count', sa.Integer(), nullable=True),
    sa.Column('answer_rank', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('clue_answer')
    # ### end Alembic commands ###
