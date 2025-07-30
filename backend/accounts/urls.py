from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import register, CustomEmailLoginView, get_all_users, user_detail
urlpatterns = [
    path('register/', register, name='register'),
    path('token/', CustomEmailLoginView.as_view(), name='email_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', get_all_users, name='get_all_users'),
    path('users/<int:user_id>/', user_detail, name='user_detail'), 
]