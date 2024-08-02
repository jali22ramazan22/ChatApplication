import os
from pathlib import Path
from dotenv import load_dotenv
from typing import NamedTuple

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')

if os.getenv('DJANGO_DEVELOPMENT'):
    from .settings_dev import *
else:
    CORS_ALLOW_ALL_ORIGINS = True
    ALLOWED_HOSTS = ['*']
    DEBUG = False

    INSTALLED_APPS = [
        "daphne",
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        "rest_framework",
        "corsheaders",
        "chat",
    ]

    MIDDLEWARE = [
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',

        "corsheaders.middleware.CorsMiddleware",
        "django.middleware.common.CommonMiddleware",
    ]

    ROOT_URLCONF = 'chat_application.urls'

    TEMPLATES = [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': [],
            'APP_DIRS': True,
            'OPTIONS': {
                'context_processors': [
                    'django.template.context_processors.debug',
                    'django.template.context_processors.request',
                    'django.contrib.auth.context_processors.auth',
                    'django.contrib.messages.context_processors.messages',
                ],
            },
        },
    ]

    WSGI_APPLICATION = 'chat_application.wsgi.application'
    ASGI_APPLICATION = "chat_application.asgi.application"


    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.environ.get('DATABASE_NAME', 'mysql'),
            'USER': os.environ.get('DATABASE_USER', 'root'),
            'PASSWORD': os.environ.get('DATABASE_PASSWORD', 'root_password'),
            'HOST': os.environ.get('DATABASE_HOST', 'db'),
            'PORT': os.environ.get('DATABASE_PORT', '3306'),
        }
    }

    # TODO: split the local redis into independent piece into docker
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [("localhost", 6379)],
            },
        },
    }

    AUTH_PASSWORD_VALIDATORS = [
        {
            'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
        },
    ]

    LANGUAGE_CODE = 'en-us'

    TIME_ZONE = 'UTC'

    USE_I18N = True

    USE_TZ = True

    STATIC_URL = 'static/'

    DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
