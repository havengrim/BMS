from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    contact_number = serializers.CharField(write_only=True)
    address = serializers.CharField(write_only=True)
    civil_status = serializers.CharField(write_only=True)
    birthdate = serializers.DateField(write_only=True)
    role = serializers.CharField(write_only=True, required=False, default='user')
    image = serializers.ImageField(write_only=True, required=False, allow_null=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'name',  
            'username',
            'email',
            'password',
            'confirm_password',
            'contact_number',
            'address',
            'civil_status',
            'birthdate',
            'role',
            'image',
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
        role = validated_data.pop('role', 'user')
        image = validated_data.pop('image', None)
        validated_data.pop('confirm_password')
        name = validated_data.pop('name')  

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        Profile.objects.create(
            user=user,
            name=name,
            contact_number=contact_number,
            address=address,
            civil_status=civil_status,
            birthdate=birthdate,
            role=role,
            image=image
        )

        return user


class ProfileSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = Profile
        fields = ['contact_number', 'address', 'civil_status', 'birthdate', 'role', 'image']


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

        profile = getattr(user, 'profile', None)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "profile": {
                    "name": profile.name if profile else None,
                    "contact_number": profile.contact_number if profile else None,
                    "address": profile.address if profile else None,
                    "civil_status": profile.civil_status if profile else None,
                    "birthdate": profile.birthdate if profile else None,
                    "role": profile.role if profile else None,
                    "image": (
                        profile.image.url if profile and profile.image else None
                    ),
                } if profile else None
            }
        }
