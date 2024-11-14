from rest_framework import serializers
from .models import Schedule, Response, TimeSlot

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['start_time', 'end_time']

class CreateResponseSerializer(serializers.ModelSerializer):
    time_slots = TimeSlotSerializer(many=True)

    class Meta:
        model = Response
        fields = ['name', 'time_slots']

    def create(self, validated_data):
        time_slots_data = validated_data.pop('time_slots')
        response = Response.objects.create(**validated_data)
        
        for time_slot_data in time_slots_data:
            TimeSlot.objects.create(response=response, **time_slot_data)
        
        return response

class ResponseSerializer(serializers.ModelSerializer):
    time_slots = TimeSlotSerializer(many=True, read_only=True)

    class Meta:
        model = Response
        fields = ['id', 'name', 'time_slots', 'created_at']

class ScheduleSerializer(serializers.ModelSerializer):
    responses = ResponseSerializer(many=True, read_only=True)

    class Meta:
        model = Schedule
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date',
            'start_time', 'end_time', 'time_slot_duration', 'timezone',
            'responses', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']