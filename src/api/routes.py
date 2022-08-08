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
        "clue": "Elvis' middle name?",
        "answer": "Aron", 
        "year": 2002,
        "weekday": "Mon",
        "total": "23",
        "explanation": "Elvis Presley's full name was Elvis Aron Presley."
    }

    return jsonify(response_body), 200