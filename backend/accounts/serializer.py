from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import User         
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class RegisterSerializer(serializers.ModelSerializer):
    contact_number = serializers.CharField(write_only=True)
    address = serializers.CharField(write_only=True)
    civil_status = serializers.ChoiceField(choices=Profile.CIVIL_STATUS_CHOICES, write_only=True)
    birthdate = serializers.DateField(write_only=True)
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, default='personnel', write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'password',
            'confirm_password',
            'contact_number',
            'address',
            'civil_status',
            'birthdate',
            'role',
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Password fields didn't match."})
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        contact_number = validated_data.pop('contact_number')
        address = validated_data.pop('address')
        civil_status = validated_data.pop('civil_status')
        birthdate = validated_data.pop('birthdate')
        role = validated_data.pop('role')
        validated_data.pop('confirm_password')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        Profile.objects.create(
            user=user,
            contact_number=contact_number,
            address=address,
            civil_status=civil_status,
            birthdate=birthdate,
            role=role,
        )

        return user
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['contact_number', 'address', 'civil_status', 'birthdate', 'role']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']
        
class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "No user found with this email."})

        # Authenticate using username (required by SimpleJWT)
        user = authenticate(username=user.username, password=password)

        if not user:
            raise serializers.ValidationError({"password": "Incorrect password."})

        # Generate JWT token pair
        refresh = TokenObtainPairSerializer.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        }