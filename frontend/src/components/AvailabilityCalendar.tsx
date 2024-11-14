import { useState, useEffect } from 'react';
import '../styles/AvailabilityCalendar.css';

interface TimeSlot {
    start_time: string;
    end_time: string;
}

interface ResponseData {
    name: string;
    slots: TimeSlot[];
}

interface AvailabilityCalendarProps {
    scheduleId: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    availability: Record<string, ResponseData>;
    totalResponses: number;
    timeSlotInterval: number;
}

interface ProcessedSlot {
    date: string;
    time: string;
    count: number;
    attendees?: string[];
}

const groupSlotsByDate = (availability: Record<string, ResponseData>) => {
    const slotsByDate: Record<string, Array<{ time: string, count: number, attendees: string[] }>> = {};
    
    Object.entries(availability).forEach(([_responseId, response]) => {
        const name = response.name;
        response.slots.forEach(slot => {
            const [date, time] = slot.start_time.split('T');
            if (!slotsByDate[date]) {
                slotsByDate[date] = [];
            }
            const existingSlot = slotsByDate[date].find(s => s.time === time);
            if (existingSlot) {
                existingSlot.count++;
                existingSlot.attendees.push(name);
            } else {
                slotsByDate[date].push({ time, count: 1, attendees: [name] });
            }
        });
    });

    return slotsByDate;
};

function AvailabilityCalendar({ 
    availability,
    totalResponses,
}: AvailabilityCalendarProps) {
    const [recommendations, setRecommendations] = useState<ProcessedSlot[]>([]);

    useEffect(() => {
        generateRecommendations();
    }, [availability]);

    const generateRecommendations = () => {
        const slotCounts: Record<string, number> = {};
        
        Object.values(availability).forEach(response => {
            response.slots.forEach(slot => {
                const key = slot.start_time;
                slotCounts[key] = (slotCounts[key] || 0) + 1;
            });
        });

        const sortedSlots = Object.entries(slotCounts)
            .map(([time, count]) => ({
                date: time.split('T')[0],
                time: time.split('T')[1],
                count
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        setRecommendations(sortedSlots);
    };

    const getColorIntensity = (count: number) => {
        const percentage = (count / totalResponses) * 100;
        return `rgba(255, 96, 0, ${percentage / 100})`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeStr: string) => {
        return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    return (
        <div className="availability-calendar-container">
            <div className="recommendations-section">
                <h3>Top Recommended Times</h3>
                <div className="recommendations-grid">
                    {recommendations.map((slot, index) => (
                        <div 
                            key={index} 
                            className="recommendation-card"
                            style={{
                                background: `linear-gradient(135deg, ${getColorIntensity(slot.count)}, var(--accent2))`
                            }}
                        >
                            <div className="recommendation-info">
                                <span className="date">{formatDate(slot.date)}</span>
                                <span className="time">{formatTime(slot.time)}</span>
                                <span className="attendance">
                                    {slot.count} of {totalResponses} available
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="calendar-grid">
                {Object.entries(groupSlotsByDate(availability)).map(([date, slots]) => (
                    <div key={date} className="calendar-day">
                        <div className="day-header">{formatDate(date)}</div>
                        <div className="time-slots">
                            {slots.map((slot, index) => (
                                <div 
                                    key={index}
                                    className="time-slot"
                                    style={{
                                        backgroundColor: getColorIntensity(slot.count)
                                    }}
                                    title={`Available: ${slot.attendees?.join(', ')}`}
                                >
                                    <span className="time-label">
                                        {formatTime(slot.time)}
                                    </span>
                                    <span className="attendee-count">
                                        {slot.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AvailabilityCalendar; 