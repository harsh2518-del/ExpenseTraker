from flask import Flask
from flask_cors import CORS

from .api.routes import api
from .config import Config
from .extensions import db, migrate
from . import models


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["FRONTEND_ORIGIN"]}},
        supports_credentials=True,
    )

    app.register_blueprint(api, url_prefix="/api")

    return app
