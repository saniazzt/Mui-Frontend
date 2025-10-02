from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['sub'] = str(user.id)
        token['email'] = user.email
        token['username'] = user.username
        token['user_type'] = user.user_type
        return token

class UserSerializer(serializers.ModelSerializer):
    photoURL = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id','username','user_type','name', 'email', 'photoURL', 'phoneNumber', 'country',
            'address', 'state', 'city', 'zipCode', 'about', 'isPublic'
        ]
        # read_only_fields = ['id','username', 'user_type']
        
    def get_photoURL(self, obj):
        return None

class CustomUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = [
            'name', 'email', 'photoURL', 'phoneNumber', 'country',
            'address', 'state', 'city', 'zipCode', 'about', 'isPublic'
        ]

class CustomUserSerializerList(serializers.ModelSerializer):
    role = serializers.CharField(source='user_type')
    status = serializers.SerializerMethodField()
    isVerified = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    avatarURL = serializers.SerializerMethodField()
    # avatarURL = serializers.CharField(source='photoURL', allow_blank=True, default='')

    class Meta:
        model = CustomUser
        fields = [
            'id', 'name', 'email','username', 'phoneNumber', 'role', 'status',
            'avatarURL', 'country', 'address',
            'state', 'city', 'zipCode', 'isVerified','company'
        ]

    def get_status(self, obj):
        return 'active'
    
    def get_isVerified(self, obj):
        return True

    def get_company(self, obj):
        return 'company name'
    
    def get_avatarURL(self, obj):
        return ''