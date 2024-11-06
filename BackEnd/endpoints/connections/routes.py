from flask import Blueprint, request, jsonify
from database.database_access import *

connetions = Blueprint('connections',__name__)

@connetions.route('connections', methods=['GET','POST','DELETE'])
def handle_connections():
    if request.method == 'GET': # Fetch all connections from the database
        result = get_connections_db(get_db())
        return jsonify(result)
    
    elif request.method == 'POST': # Add a new connection to the database
        connection = request.json
        action_connection_to_db(get_db(),'POST', connection)
        return "Connection added!"

    elif request.method == 'DELETE': # Delete a connection from the database
        connection = request.json
        action_connection_to_db(get_db(),'DELETE', connection)
        return "Connection deleted!"