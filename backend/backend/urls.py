from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/announcements/', include('announcements.urls')),
    path('api/certificates/', include('certificates.urls')),
    path('api/complaints/', include('complaints.urls')),
    path('api/chatbot/', include('chatbot.urls')),
    path('api/emergency/', include('emergency.urls')),
    path('api/blotter/', include('blotter.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
