from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializer import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer

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
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_detail(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
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

            # Set access and refresh tokens in HttpOnly cookies
            response.set_cookie(
                key='access_token',
                value=data["access"],
                httponly=True,
                secure=True,  # Set to False if testing on HTTP
                samesite='Lax',
                max_age=60 * 15,
            )
            response.set_cookie(
                key='refresh_token',
                value=data["refresh"],
                httponly=True,
                secure=True,
                samesite='Lax',
                max_age=60 * 60 * 24 * 7,
            )
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
