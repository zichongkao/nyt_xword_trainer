"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from random import sample
from api.models import db, User, ClueAnswer
from api.utils import generate_sitemap, APIException

api = Blueprint('api', __name__)


@api.route('/clue', methods=['GET'])
def get_clues():
    args = request.args
    round_size = args.get("round_size", default=10, type=int)
    min_answer_rank = args.get("min_answer_rank", default=1, type=int)
    max_answer_rank = args.get("max_answer_rank", default=10, type=int)

    # Two queries, but faster than "ORDER BY random()"
    possible_ids = [x[0] for x in ClueAnswer.query\
        .filter(ClueAnswer.answer_rank >= min_answer_rank)\
        .filter(ClueAnswer.answer_rank <= max_answer_rank)\
        .with_entities(ClueAnswer.id)\
        .all()]
    actual_ids = possible_ids if round_size >= len(possible_ids) else sample(possible_ids, round_size)
    res = ClueAnswer.query.filter(ClueAnswer.id.in_(actual_ids)).all()

    response_body = {
        "clue_list": [clue.serialize() for clue in res]
    }

    '''
    response_body = {
        "clue_list": [{
            "clue":"\"___ Baba and the 40 Thieves\"",
            "answer_rank":21,
            "answer_count":23,
            "weekday":"Mon",
            "answer":"ALI",
            "index":"2-DOWN",
            "year":2010,
            "month":12,
            "day":20
        }, {
            "clue": "Two Elvis' middle name?",
            "answer_rank":212,
            "answer_count":232,
            "answer": "TwoAron", 
            "weekday": "Tues",
            "index":"2-DOWN",
            "year":2012,
            "month":11,
            "day":22
        }]
    }
    print(response_body)
    '''

    return jsonify(response_body), 200