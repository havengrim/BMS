from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .serializer import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import MultiPartParser, FormParser

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True, context={'request': request})  # pass request here
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    profile = {
        "name": user.profile.name,
        "contact_number": user.profile.contact_number,
        "address": user.profile.address,
        "civil_status": user.profile.civil_status,
        "birthdate": user.profile.birthdate,
        "role": user.profile.role,
        "image": user.profile.image.url if user.profile.image else None,
    }
    data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "profile": profile,
    }
    return Response(data)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def user_detail(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})  # add context here
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated successfully", "user": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
class CustomEmailLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            response = Response({
                "message": "Login successful",
                "user": data["user"]
            }, status=status.HTTP_200_OK)

            secure_cookie = False  # Change to True on production with HTTPS

            response.set_cookie(
                key='access_token',
                value=data["access"],
                httponly=True,
                secure=False,
                samesite='Lax',  # Lax or Strict for localhost testing
                max_age=60 * 15,
                path='/',
            )
            response.set_cookie(
                key='refresh_token',
                value=data["refresh"],
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=60 * 60 * 24 * 7,
                path='/',
            )
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({"detail": "Refresh token missing"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            new_access_token = str(refresh.access_token)

            response = Response({"message": "Token refreshed"}, status=status.HTTP_200_OK)

            secure_cookie = False  # Change to True on production with HTTPS

            response.set_cookie(
                key='access_token',
                value=new_access_token,
                httponly=True,
                secure=secure_cookie,
                samesite='None',
                max_age=60 * 15,  # 15 minutes
                path='/',
            )
            return response

        except TokenError:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass

    response = Response({"message": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
    response.delete_cookie('access_token', path='/')
    response.delete_cookie('refresh_token', path='/')
    return response
