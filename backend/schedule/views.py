from rest_framework import viewsets, status, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import action
from rest_framework.response import Response as DRF_Response
from .models import Schedule, Response
from .serializers import (
    ScheduleSerializer, ResponseSerializer, 
    CreateResponseSerializer
)
from django.shortcuts import get_object_or_404

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user

class ScheduleViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        if self.action in ['retrieve', 'respond']:
            return Schedule.objects.all()
        return Schedule.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        schedule = self.get_object()
        serializer = CreateResponseSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(schedule=schedule)
            return DRF_Response(serializer.data, status=status.HTTP_201_CREATED)
        return DRF_Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        schedule = self.get_object()
        responses = schedule.responses.all()
        
        availability = {}
        try:
            for response in responses:
                response_data = {
                    'name': response.name,
                    'slots': [
                        {
                            'start_time': time_slot.start_time.isoformat(),
                            'end_time': time_slot.end_time.isoformat()
                        }
                        for time_slot in response.time_slots.all()
                    ]
                }
                availability[str(response.id)] = response_data

            return DRF_Response(availability)
        except Exception as e:
            return DRF_Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_permissions(self):
        """
        Customize permissions based on action
        """
        if self.action in ['list', 'create']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['retrieve', 'respond']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
        return [permission() for permission in permission_classes]
