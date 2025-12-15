from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import TokenUsuario

class TokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Token '):
            return None  # No intenta autenticar

        token = auth_header.split(' ')[1]

        try:
            token_obj = TokenUsuario.objects.get(token=token)
        except TokenUsuario.DoesNotExist:
            raise AuthenticationFailed('Token inválido')

        return (token_obj.usuario, None)  
