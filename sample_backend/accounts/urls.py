from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/user/', views.user_dashboard, name='user_dashboard'),
    path('dashboard/admin/', views.admin_dashboard, name='admin_dashboard'),
    path('dashboard/superadmin/', views.superadmin_dashboard, name='superadmin_dashboard'),
    path('api/me/', views.user_detail, name='user_detail'),
    path('api/login/', views.api_login_view, name='api_login'),
    path('api/register/', views.api_register_view, name='api_register'),
    path('api/update-profile/', views.api_update_profile, name='api_update_profile'),
    path('api/users/', views.api_get_all_users, name='api_get_all_users'),
    path('api/users/get/<int:id>/', views.api_get_user_by_id, name='api_get_user_by_id'),
    path('api/users/update/<int:id>/', views.api_update_user_by_id, name='api_update_user_by_id'),
    path('api/users/create/', views.api_create_user, name='api_create_user'),
]