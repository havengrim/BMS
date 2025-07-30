from django.urls import path
from .views import (
    CertificateRequestCreateView,
    CertificateRequestListView,
    CertificateRequestDetailView,
    CertificateRequestUpdateView,
    CertificateRequestDeleteView,
    BusinessPermitListCreateView,
    BusinessPermitRetrieveUpdateDestroyView
)

urlpatterns = [
    path('', CertificateRequestListView.as_view(), name='list_certificates'),
    path('create/', CertificateRequestCreateView.as_view(), name='create_certificate'),
    path('view/<int:id>/', CertificateRequestDetailView.as_view(), name='view_certificate'),
    path('edit/<int:id>/', CertificateRequestUpdateView.as_view(), name='update_certificate'),
    path('delete/<int:id>/', CertificateRequestDeleteView.as_view(), name='delete_certificate'),
     path('business-permits/', BusinessPermitListCreateView.as_view(), name='business-permit-list-create'),
    path('business-permits/<int:pk>/', BusinessPermitRetrieveUpdateDestroyView.as_view(), name='business-permit-detail'),
]
