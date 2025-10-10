from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .serializer import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer  # Fixed typo: serializer -> serializer (assuming it's serializers.py)
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import timedelta
from django.conf import settings  # For SIMPLE_JWT lifetimes

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
    serializer = UserSerializer(users, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    profile = getattr(user, 'profile', None)
    if profile is None:
        profile_data = {
            "name": "",
            "contact_number": "",
            "address": "",
            "civil_status": "",
            "birthdate": None,
            "role": "",
            "image": None,
        }
    else:
        profile_data = {
            "name": profile.name,
            "contact_number": profile.contact_number,
            "address": profile.address,
            "civil_status": profile.civil_status,
            "birthdate": profile.birthdate,
            "role": profile.role,
            "image": profile.image.url if profile.image else None,
        }
    data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "profile": profile_data,
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
        serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            if not hasattr(user, 'profile'):
                from accounts.models import Profile
                Profile.objects.create(
                    user=user,
                    name=user.username,
                    contact_number='',
                    address='',
                    civil_status='',
                    birthdate='1900-01-01',
                    role='user',
                )
                user.refresh_from_db()
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
            secure_cookie = settings.DEBUG  # False in prod; True for dev (no HTTPS needed)
            
            # Return access in body for frontend
            response = Response({
                "message": "Login successful",
                "access": data["access"],  # Key fix: Include for JS store/header
                "user": data["user"]
            }, status=status.HTTP_200_OK)

            # Set HttpOnly cookies (fallback for middleware)
            access_lifetime = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
            refresh_lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()
            
            response.set_cookie(
                key='access_token',
                value=data["access"],
                httponly=True,
                secure=secure_cookie,
                samesite='Lax',
                max_age=access_lifetime,  # Align to settings (60 min)
                path='/',
            )
            response.set_cookie(
                key='refresh_token',
                value=data["refresh"],
                httponly=True,
                secure=secure_cookie,
                samesite='Lax',
                max_age=refresh_lifetime,  # Align to settings (1 day)
                path='/',
            )
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({"refresh": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)  # Match your 400 error format

        try:
            refresh = RefreshToken(refresh_token)
            new_access_token = str(refresh.access_token)
            
            # Handle rotation if enabled (your settings: True)
            if settings.SIMPLE_JWT['ROTATE_REFRESH_TOKENS']:
                new_refresh = str(refresh)
                # Blacklist old if needed (your BLACKLIST_AFTER_ROTATION: True)
                refresh.blacklist()
            else:
                new_refresh = refresh_token  # Reuse

            secure_cookie = settings.DEBUG  # False in prod
            
            # Return new access in body
            response = Response({
                "access": new_access_token,  # Key fix: Include for frontend update
                "message": "Token refreshed"
            }, status=status.HTTP_200_OK)

            # Update cookies
            access_lifetime = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
            refresh_lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()
            
            response.set_cookie(
                key='access_token',
                value=new_access_token,
                httponly=True,
                secure=secure_cookie,
                samesite='Lax',  # Fixed: 'Lax' for consistency/CORS
                max_age=access_lifetime,
                path='/',
            )
            response.set_cookie(
                key='refresh_token',
                value=new_refresh,
                httponly=True,
                secure=secure_cookie,
                samesite='Lax',
                max_age=refresh_lifetime,
                path='/',
            )
            return response

        except TokenError as e:
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