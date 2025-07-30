from django.urls import path
from .views import ComplaintListCreateView, ComplaintDetailView

urlpatterns = [
    path('', ComplaintListCreateView.as_view(), name='list_create_complaints'),
    path('view/<int:id>/', ComplaintDetailView.as_view(), name='view_complaint'),
    path('edit/<int:id>/', ComplaintDetailView.as_view(), name='edit_complaint'),
    path('delete/<int:id>/', ComplaintDetailView.as_view(), name='delete_complaint'),
]
