from flask import Flask
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS
from flask_mysqldb import MySQL

from utils.config_loader import load_config

from database.database_access import *

from endpoints.login.routes import login
from endpoints.user.routes import user
from endpoints.connections.routes import connetions
from endpoints.devices.routes import devices
from endpoints.interfaces.routes import interfaces
 
# Load configuration file
config = load_config()

# Load App Flask
app = Flask(__name__)
CORS(app)

# JWT configuration
app.config["JWT_SECRET_KEY"] = config["JWT_SECRET_KEY"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

# Database configuration
app.config['MYSQL_HOST'] = config["MYSQL_HOST"]
app.config['MYSQL_PORT'] = config["MYSQL_PORT"]
app.config['MYSQL_USER'] = config["MYSQL_USER"]
app.config['MYSQL_PASSWORD'] = config["MYSQL_PASSWORD"]
app.config['MYSQL_DB'] = config["MYSQL_DB"]
mysql = MySQL(app)

# Make MySQL accessible via `current_app`
app.mysql = mysql

# Register Blueprints
app.register_blueprint(login, url_prefix="/api")
app.register_blueprint(user,url_prefix="/api")
app.register_blueprint(connetions,url_prefix="/api")
app.register_blueprint(devices,url_prefix="/api")
app.register_blueprint(interfaces,url_prefix="/api")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)