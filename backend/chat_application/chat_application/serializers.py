from rest_framework import serializers
from django.contrib.auth.models import User
from chat.serializers import *
from .settings import SECRET_KEY
import jwt
from rest_framework.exceptions import AuthenticationFailed, ParseError
from django.core.cache import cache

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


# class UserCacheSerializer(serializers.Serializer):
#     user = UserModelSerializer()
#     payload = serializers.CharField()
#
#     def validate_payload(self, value):
#         try:
#             payload = jwt.decode(value, SECRET_KEY, algorithms=['HS256'])
#         except jwt.ExpiredSignatureError:
#             raise AuthenticationFailed('Unauthenticated')
#         except jwt.InvalidTokenError:
#             raise AuthenticationFailed('Invalid token')
#         return value
#
#     def save(self, **kwargs):
#         validated_data = {**self.validated_data, **kwargs}
#         user_data = validated_data.get('user')
#         if user_data:
#             user_id = user_data.get('id')
#             cache.set(f"user_{user_id}", validated_data)
#         return super().save(**kwargs)