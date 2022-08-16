"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
import random
from api.models import db, User, ClueAnswer
from api.utils import generate_sitemap, APIException
from sqlalchemy.sql.expression import func


api = Blueprint('api', __name__)


@api.route('/clue', methods=['GET'])
def get_clues():
    args = request.args
    start_year = args.get("start_year", default=2015, type=int)
    round_size = args.get("round_size", default=30, type=int)
    top_x_answers = args.get("top_x_answers", default=200, type=int)

    res = ClueAnswer.query.filter(ClueAnswer.year>=start_year).order_by(func.random()).limit(round_size).all()
    response_body = {
        "clue_list": [clue.serialize() for clue in res]
    }

    '''
    response_body = {
        "clue_list": [{
            "clue":"\"___ Baba and the 40 Thieves\"",
            "explanation":"\"Ali Baba and the Forty Thieves\" is a film released in 1944 directed by Arthur Lubin. It is very loosely based on the tale of Ali Baba from the book \"One Thousand and One Nights\", a collection of Arabic stories compiled in what is termed the Islamic Golden Age (the 8th to 13th centuries AD). In English we often refer to the collection as \"The Arabian Nights\".",
            "total":96,
            "weekday":"Mon",
            "answer":"ALI",
            "year":2010
        }, {
            "clue": "Two Elvis' middle name?",
            "answer": "TwoAron", 
            "year": 2202,
            "weekday": "Tues",
            "total": "24",
            "explanation": "Two Elvis Presley's full name was Elvis Aron Presley."
        }]
    }
    print(response_body)
    '''

    return jsonify(response_body), 200