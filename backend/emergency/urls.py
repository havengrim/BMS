# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmergencyReportViewSet

router = DefaultRouter()
router.register(r'', EmergencyReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
