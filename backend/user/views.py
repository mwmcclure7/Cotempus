from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)

class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        # Validate input
        if not current_password or not new_password:
            return Response(
                {'detail': 'Both current and new password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check current password
        if not user.check_password(current_password):
            return Response(
                {'detail': 'Current password is incorrect'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate new password
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response(
                {'detail': ' '.join(e.messages)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update password
        user.set_password(new_password)
        user.save()
        
        return Response({
            'detail': 'Password updated successfully',
            'message': 'Please log in again with your new password'
        })

class ChangeEmailView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        new_email = request.data.get('new_email')

        # Validate input
        if not new_email:
            return Response(
                {'detail': 'New email is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate email format
        try:
            validate_email(new_email)
        except ValidationError:
            return Response(
                {'detail': 'Invalid email format'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if email is already in use
        if User.objects.filter(email=new_email).exclude(id=user.id).exists():
            return Response(
                {'detail': 'This email is already in use'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update email
        old_email = user.email
        user.email = new_email
        user.save()

        return Response({
            'detail': 'Email updated successfully',
            'old_email': old_email,
            'new_email': new_email
        })

class DeleteAccountView(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request):
        user = request.user
        
        try:
            # Store email for confirmation message
            email = user.email
            
            # Delete the user
            user.delete()
            
            return Response({
                'detail': 'Account deleted successfully',
                'email': email
            })
        except Exception as e:
            return Response({
                'detail': 'Failed to delete account. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
