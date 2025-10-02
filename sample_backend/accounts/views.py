from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import CustomUserRegisterForm, CustomUserLoginForm, CustomUserChangeForm
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import JsonResponse
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.response import Response
from .models import CustomUser
from .serializers import CustomUserSerializerList, UserSerializer, CustomUserSerializer, MyTokenObtainPairSerializer


def register_view(request):
    if request.method == "POST":
        form = CustomUserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect_to_dashboards(user)
    else:
        form = CustomUserRegisterForm()
    return render(request, 'accounts/register.html', {'form': form})


def login_view(request):
    if request.method == "POST":
        form = CustomUserLoginForm(request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect_to_dashboards(user)
    else:
        form = CustomUserLoginForm()
    return render(request, 'accounts/login.html', {'form': form})


# Create your views here.
def logout_view(request):
    logout(request)
    return redirect('login')


def redirect_to_dashboards(user):
    if user.user_type == 'superadmin':
        return redirect('superadmin_dashboard')
    elif user.user_type == 'admin':
        return redirect('admin_dashboard')
    else:
        return redirect('user_dashboard')

@login_required
def user_dashboard(request):
    update_profile_form = CustomUserChangeForm(instance=request.user)
    # message_form = SendMessageToAdmin_Form()
    if request.method == "POST":
        if 'update_profile' in request.POST:
            update_profile_form = CustomUserChangeForm(request.POST, instance=request.user)
            if update_profile_form.is_valid():
                update_profile_form.save()
                messages.success(request, 'Profile updated successfully')
                return redirect('user_dashboard')
        # elif 'send_message' in request.POST:
        #     message_form = SendMessageToAdmin_Form(request.POST)
        #     if message_form.is_valid():
        #         mes = message_form.save(commit=False)
        #         mes.sender = request.user
        #         mes.save()
        #         messages.success(request, 'Message sent successfully')
        #         return redirect('user_dashboard')

    return render(request, 'accounts/user_dashboard.html', {'profile_form': update_profile_form})


def superadmin_dashboard(request):
    if request.user.user_type != 'superadmin':
        return redirect('login')

    update_profile_form = CustomUserChangeForm(instance=request.user)
    admins = CustomUser.objects.filter(user_type='admin')
    normal_users = CustomUser.objects.filter(user_type='normal')
    if request.method == "POST":
        if 'update_profile' in request.POST:
            update_profile_form = CustomUserChangeForm(request.POST, instance=request.user)
            if update_profile_form.is_valid():
                update_profile_form.save()
                messages.success(request, 'Profile updated successfully')
                return redirect('superadmin_dashboard')

        if 'change_to_admin' in request.POST:
            user_id = request.POST.get('user_id')
            try:
                user = CustomUser.objects.get(id=user_id, user_type='admin')
                user.user_type = 'admin'
                user.save()
                messages.success(request, 'Admin user updated successfully')
            except CustomUser.DoesNotExist:
                messages.error(request, 'User does not exist')
            return redirect('superadmin_dashboard')

        elif 'delete_admin' in request.POST:
            user_id = request.POST.get('admin_id')
            try:
                admin = CustomUser.objects.get(id=user_id, user_type='admin')
                admin.delete()
                messages.success(request, 'Admin user deleted successfully')
            except CustomUser.DoesNotExist:
                messages.error(request, 'User does not exist')
            return redirect('superadmin_dashboard')

    return render(request, 'accounts/superadmin_dashboard.html',{
        'update_profile_form': update_profile_form,
        'admins': admins,
        'normal_users': normal_users,
    })


def admin_dashboard(request):
    if request.user.user_type != 'admin':
        return redirect('login')
    update_profile_form = CustomUserChangeForm(instance=request.user)
    # message_form = AnswerToMessage_Form(user= request.user)

    normal_users = CustomUser.objects.filter(user_type='normal')
    # normal_users_messages = Message.objects.filter(receiver= request.user)
    if request.method == "POST":
        if 'update_profile' in request.POST:
            update_profile_form = CustomUserChangeForm(request.POST, instance=request.user)
            if update_profile_form.is_valid():
                update_profile_form.save()
                messages.success(request, 'Profile updated successfully')
                return redirect('admin_dashboard')

        # elif 'send_answer' in request.POST:
        #     message_form = AnswerToMessage_Form(request.POST, user=request.user)
        #     if message_form.is_valid():
        #         mes = message_form.save(commit=False)
        #         mes.sender = request.user
        #         mes.save()
        #         messages.success(request, 'Message sent successfully')
        #         return redirect('admin_dashboard')

    return render(request, 'accounts/admin_dashboard.html', {
        'normal_users': normal_users,
        'update_profile_form': update_profile_form,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail(request):
    user = request.user

    serializer = UserSerializer(user)
    return Response(serializer.data)
    

@api_view(['POST'])
@permission_classes([AllowAny])
def api_login_view(request):
    form = CustomUserLoginForm(data=request.data)
    if form.is_valid():
        user = form.get_user()
        login(request, user)
        serializer = MyTokenObtainPairSerializer(data={
            "username": user.username,
            "password": request.data.get('password')
        })
        serializer.is_valid(raise_exception=True)
        tokens = serializer.validated_data
        return JsonResponse({
            "access_token": tokens["access"],
            "refresh_token": tokens["refresh"],
            "user": {
                "sub": user.id,
                "email": user.email,
                "username": user.username,
                "user_type": user.user_type,
            }
        })
    else:
        return JsonResponse({'success': False, 'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def api_register_view(request):
    form = CustomUserRegisterForm(data=request.data)
    if form.is_valid():
        user = form.save()
        login(request, user)
        serializer = MyTokenObtainPairSerializer(data={
            "username": user.username,
            "password": request.data.get('password1')
        })
        serializer.is_valid(raise_exception=True)
        tokens = serializer.validated_data
        return Response({
            "access_token": tokens["access"],
            "refresh_token": tokens["refresh"],
            "user": {
                "sub": user.id,
                "email": user.email,
                "username": user.username,
                "user_type": user.user_type,
            }
        }, status=status.HTTP_201_CREATED)
    else:
        # Convert form.errors to a plain dict of lists
        errors = {field: [str(e) for e in errs] for field, errs in form.errors.items()}
        return Response({'success': False, 'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([AllowAny])
def api_update_profile(request):
    user = request.user
    serializer = CustomUserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        print("Updated fields:", request.data)  # Log the updated fields
        print("Updated user:", serializer.data) # Log the updated user data
        return Response({'success': True, 'user': serializer.data}, status=status.HTTP_200_OK)
    print("Update errors:", serializer.errors)  # Log errors if any
    return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_get_all_users(request):
    if request.user.user_type != 'admin' and request.user.user_type != 'superadmin':
        return Response({'success': False, 'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    user_type = request.query_params.get('user_type')
    if user_type == 'admin':
        users = CustomUser.objects.filter(user_type='admin')
    else:
        users = CustomUser.objects.all()
    serializer = CustomUserSerializerList(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_get_user_by_id(request, id):
    try:
        user = CustomUser.objects.get(pk=id)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CustomUserSerializerList(user)
    return Response(serializer.data)

@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def api_update_user_by_id(request, id):
    try:
        user = CustomUser.objects.get(pk=id)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = CustomUserSerializerList(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'user': serializer.data}, status=status.HTTP_200_OK)
        print("Update errors:", serializer.errors)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response({'success': True, 'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def api_create_user(request):
    """
    Create a new user.
    """
    print(request.data)
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'success': True, 'user': serializer.data}, status=status.HTTP_201_CREATED)
    print("Create errors:", serializer.errors)
    return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)