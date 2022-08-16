"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException

api = Blueprint('api', __name__)


@api.route('/clue', methods=['GET'])
def get_clue():

    response_body = {
        "clue_list": [{
            "clue": "Elvis' middle name?",
            "answer": "Arono", 
            "year": 2002,
            "weekday": "Mon",
            "total": "23",
            "explanation": "Elvis Presley's full name was Elvis Aron Presley."
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

    return jsonify(response_body), 200