from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Announcement
from .serializers import AnnouncementSerializer

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_announcement(request):
    serializer = AnnouncementSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_announcements(request):
    announcements = Announcement.objects.all().order_by('-created_at')
    serializer = AnnouncementSerializer(announcements, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_announcement(request, pk):
    try:
        announcement = Announcement.objects.get(pk=pk)
    except Announcement.DoesNotExist:
        return Response({'detail': 'Announcement not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = AnnouncementSerializer(announcement)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
def edit_announcement(request, pk):
    try:
        announcement = Announcement.objects.get(pk=pk)
    except Announcement.DoesNotExist:
        return Response({'detail': 'Announcement not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = AnnouncementSerializer(announcement, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_announcement(request, pk):
    try:
        announcement = Announcement.objects.get(pk=pk)
    except Announcement.DoesNotExist:
        return Response({'detail': 'Announcement not found'}, status=status.HTTP_404_NOT_FOUND)

    announcement.delete()
    return Response({'detail': 'Announcement deleted'}, status=status.HTTP_204_NO_CONTENT)
