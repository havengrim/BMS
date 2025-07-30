from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmergencyReportViewSet, EmergencyFeedbackViewSet

router = DefaultRouter()
router.register(r'reports', EmergencyReportViewSet, basename='emergency-report')
router.register(r'feedbacks', EmergencyFeedbackViewSet, basename='emergency-feedback')

urlpatterns = [
    path('', include(router.urls)),
]
