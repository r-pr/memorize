# update readme - must correspond to this code
# repace jsonfiy error with error()
# then deploy to heroku
#

import copy
import os
import re
import datetime

from bson import ObjectId
from flask import Flask, jsonify, request
from functools import wraps
from pymongo import MongoClient
import jwt

from helpers import *


def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers['Authorization']
        if not token:
            return jsonify({'error': 'no token'}), 401
        try:
            token = jwt.decode(token, jwt_secret)
        except:
            return jsonify({"error": "invalid token"}), 401
        kwargs['token'] = token
        return f(*args, **kwargs)
    return decorated_function


def error(message, code):
    return jsonify({'error': message}), code


def error500():
    return jsonify({'error': 'internal server error'}), 500


app = Flask(__name__, static_folder='static', static_url_path='')

if not os.environ.get("MONGO_URI"):
    raise RuntimeError("MONGO_URI env variable not set")

username_re = re.compile("^[A-Za-z][A-Za-z_\-\d]+$")

jwt_secret = "foo_bar" #create_salt()

mongo_client = MongoClient(os.environ.get("MONGO_URI"))
db = mongo_client.mnesis
coll_users = db.users
coll_dicts = db.dictionaries
coll_entries = db.entries


@app.route("/")
def index():
    return "Coming soon..."


@app.route("/signup", methods=["POST"])
def signup():
    username = request.form.get("username")
    password = request.form.get("password")

    if not username:
        return error('no username', 400)
    if not username_re.match(username):
        return error('invalid username', 400)
    if len(username) > 50:
        return error('username too long', 400)
    if not password:
        return error('no password', 400)
    if len(password) < 6:
        return error('password too short', 400)
    if len(password) > 50:
        return error('password too long', 400)
    try:
        doc = coll_users.find_one({'username': username})
        if doc:
            return error('username is already taken', 400)

        salt = create_salt()
        hashed = hash_password(password, salt)
        reuslt = coll_users.insert_one({
            'username': username,
            'password': hashed,
            'salt': salt
        })
    except:
        return error500()
    return jsonify({'status': 'ok'})


@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    if not username:
        return error('no username', 400)
    if not password:
        return error('no password', 400)
    doc = None
    try:
        doc = coll_users.find_one({'username': username})
    except:
        return error500()
    if not doc:
        return error('username does not exist', 400)
    hashed = hash_password(password, doc['salt'])
    if hashed == doc['password']:
        expires = datetime.datetime.now() + datetime.timedelta(days=1)
        token = jwt.encode(
            {
                'id': str(doc['_id']),
                'username': username,
                'exp': expires
            },
            jwt_secret,
            algorithm='HS256'
        )
        return jsonify({'status': 'ok', 'token': token.decode('utf-8')})
    else:
        return error('wrong password', 400)


@app.route('/dictionaries', methods=['GET'])
@token_required
def dictionaries(*args, **kwargs):
    user_id = ObjectId(kwargs['token']['id'])
    dicts = []
    try:
        dicts = list(coll_dicts.find({'user_id': user_id}, {'user_id': 0}))
    except:
        return error500()
    for dict in dicts:
        dict['_id'] = str(dict['_id'])
    return jsonify({
        'status': 'ok',
        'dictionaries': dicts
    })


@app.route('/dictionaries/<param>', methods=['POST', 'PUT', 'DELETE'])
@token_required
def create_dictionary(param, *args, **kwargs):
    user_id = ObjectId(kwargs['token']['id'])

    if request.method != 'DELETE':
        ent_all = request.form.get('ent_all')
        if not ent_all:
            return error('ent_all is required', 400)
        ent_training = request.form.get('ent_training')
        if not ent_training:
            return error('ent_training is required', 400)
        ent_hint = request.form.get('ent_hint')
        if not ent_hint:
            return error('ent_hint is required', 400)
        ent_all = str_to_set(ent_all)
        ent_training = str_to_set(ent_training)
        ent_hint = str_to_set(ent_hint)
        if not ent_training.issubset(ent_all):
            return error('ent_training must be a subset of ent_all', 400)
        if not ent_hint.issubset(ent_all):
            return error('ent_hint must be a subset of ent_all', 400)
        if len(ent_hint & ent_training):
            return error('common elements in ent_training and ent_hint', 400)

    if request.method == 'POST':
        # create dictionary
        name = param
        try:
            doc = coll_dicts.find_one({'user_id': user_id, 'name': name})
            if doc:
                return error('dictionary already exists', 400)
            result = coll_dicts.insert_one({
                'name': name,
                'user_id': user_id,
                'entryKeys': {
                    'all': list(ent_all),
                    'training': list(ent_training),
                    'hint': list(ent_hint)
                }
            })
            return jsonify({'status': 'ok', '_id': str(result.inserted_id)})
        except:
            return error500()

    elif request.method == 'PUT':
        # update dictionary
        name = request.form.get('name')
        if not name:
            return error('dictionary name is required', 400)
        try:
            dict_id = ObjectId(param)
        except:
            return jsonify('invalid dictionary id', 400)
        try:
            result = coll_dicts.update_one(
                {'_id': dict_id, 'user_id': user_id},
                {'$set': {
                    'name': name,
                    'entryKeys': {
                        'all': list(ent_all),
                        'training': list(ent_training),
                        'hint': list(ent_hint)
                    }
                }}
            )
            if result.matched_count:
                return jsonify({'status': 'ok'}), 200
            else:
                return error('dictionary not found', 400)
        except:
            return error500()

    elif request.method == 'DELETE':
        try:
            dict_id = ObjectId(param)
        except:
            return error('invalid dictionary id', 400)
        try:
            result = coll_dicts.delete_one({
                '_id': dict_id,
                'user_id': user_id
            })
            if result.deleted_count:
                return jsonify({'status': 'ok'}), 200
            else:
                return error('dictionary not found', 400)
        except:
            return error500()


@app.route('/dictionaries/<dict_id>/entries', methods=['GET', 'POST'])
@token_required
def add_entry(dict_id, *args, **kwargs):
    user_id = ObjectId(kwargs['token']['id'])
    try:
        dic_obj_id = ObjectId(dict_id)
    except:
        return error('invalid dictionary id', 400)

    if request.method == 'POST':
        # insert entry
        try:
            dic = coll_dicts.find_one({'_id': dic_obj_id, 'user_id': user_id})
        except:
            return error500()
        if not dic:
            return error('dictionary not found', 400)
        if not set(request.form).issubset(dic['entryKeys']['all']):
            return error('entry keys do not match dictionary scheme', 400)
        if not len(set(request.form) & set(dic['entryKeys']['training'])):
            return error(
                'at least one entry key must be listed in entryKeys.training',
                400
            )
        if not len(set(request.form) & set(dic['entryKeys']['hint'])):
            return error(
                'at least one entry key must be listed in entryKeys.hint',
                400
            )
        entry = {'dict_id': dic_obj_id, 'counter': 0}
        for field in request.form:
            entry[field] = request.form[field]
        try:
            result = coll_entries.insert_one(entry)
            return jsonify({'status': 'ok', '_id': str(result.inserted_id)})
        except:
            return error500()

    else:
        # find and return dict entries
        entries = []
        try:
            entries = list(coll_entries.find(
                {'dict_id': dic_obj_id},
                {'dict_id': 0}
            ))
        except:
            return error500()
        for entry in entries:
            entry['_id'] = str(entry['_id'])
        return jsonify({
            'status': 'ok',
            'entries': entries
        })


@app.route(
    '/dictionaries/<dict_id>/entries/<entry_id>',
    methods=['PUT', 'DELETE']
)
@token_required
def update_or_delete_entry(dict_id, entry_id, *args, **kwargs):
    user_id = ObjectId(kwargs['token']['id'])
    try:
        dic_obj_id = ObjectId(dict_id)
    except:
        return error('invalid dictionary id', 400)
    try:
        entry_obj_id = ObjectId(entry_id)
    except:
        return error('invalid entry id', 400)
    try:
        dic = coll_dicts.find_one({'_id': dic_obj_id, 'user_id': user_id})
    except:
        return error500()
    if not dic:
        return error('dictionary not found', 404)

    if request.method == 'DELETE':
        try:
            result = coll_entries.delete_one({
                '_id': entry_obj_id,
                'dict_id': dic_obj_id
            })
            if result.deleted_count:
                return jsonify({'status': 'ok'})
            else:
                return error('entry not found', 404)
        except:
            return error('internal server error', 500)

    elif request.method == 'PUT':
        # update entry, allow adding counter field, even if it's not
        # specified in dictionary scheme
        all_keys = copy.copy(dic['entryKeys']['all']);
        all_keys.append('counter');
        if not set(request.form).issubset(all_keys):
            return error('entry keys do not match dictionary scheme', 400)
        entry = {'dict_id': dic_obj_id}
        for field in request.form:
            entry[field] = request.form[field]
        if entry.get('counter'):
            try:
                entry['counter'] = int(entry['counter'])
            except:
                entry['counter'] = 0
        try:
            result = coll_entries.update_one(
                {'_id': entry_obj_id, 'dict_id': dic_obj_id},
                {'$set': entry}
            )
            if result.matched_count:
                return jsonify({'status': 'ok'})
            else:
                return error('entry not found', 404)
        except:
            return error('internal server error', 500)
