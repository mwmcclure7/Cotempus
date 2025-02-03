import { useState } from 'react';
import { format } from 'date-fns';
import AvailabilityCalendar from './AvailabilityCalendar';
import api from '../api';
import '../styles/ScheduleCard.css';
import { Schedule } from '../types/schedule';
import toast from 'react-hot-toast';
interface ScheduleCardProps {
    schedule: Schedule;
    onUpdate: () => void;
    onClick: () => void;
    isSelected: boolean;
    onDelete: (scheduleId: string) => void;
}

function ScheduleCard({ schedule, onUpdate, onDelete }: ScheduleCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(schedule.title);
    const [editedDescription, setEditedDescription] = useState(schedule.description);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const shareableLink = `${window.location.origin}/#/event/${schedule.id}`;

    const handleSaveEdit = async () => {
        try {
            await api.patch(`/api/schedules/${schedule.id}/`, {
                title: editedTitle,
                description: editedDescription
            });
            setIsEditing(false);
            onUpdate();
        } catch (err) {
            console.error('Failed to update schedule:', err);
        }
    };

    const getBestMeetingTimes = () => {
        // Calculate the times with highest availability
        const availabilityMap = new Map<string, number>();
        let maxAvailability = 0;
        
        schedule.responses.forEach(response => {
            response.time_slots.forEach((slot: { start_time: string }) => {
                const key = `${slot.start_time}`;
                const current = (availabilityMap.get(key) || 0) + 1;
                availabilityMap.set(key, current);
                maxAvailability = Math.max(maxAvailability, current);
            });
        });

        // Get top 3 times
        return Array.from(availabilityMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([time, count]) => ({
                time: new Date(time),
                percentage: (count / schedule.responses.length) * 100
            }));
    };

    return (
        <div className={`schedule-card ${isExpanded ? 'expanded' : ''}`}>
            <div className="schedule-header" onClick={() => setIsExpanded(!isExpanded)}>
                {isEditing ? (
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <h3>{schedule.title}</h3>
                )}
                <div className="schedule-meta">
                    <span>{format(new Date(schedule.created_at), 'MMM d, yyyy')}</span>
                    <span>{schedule.responses.length} responses</span>
                </div>
            </div>

            {isExpanded && (
                <div className="schedule-details">
                    {isEditing ? (
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                    ) : (
                        <p className="description">{schedule.description}</p>
                    )}

                    <div className="share-section">
                        <input 
                            type="text" 
                            value={shareableLink} 
                            readOnly 
                            onClick={(e) => e.currentTarget.select()}
                        />
                        <button onClick={() => {
                            navigator.clipboard.writeText(shareableLink);
                            toast.success('Link copied to clipboard!');
                        }}>
                            Copy Link
                        </button>
                    </div>

                    <AvailabilityCalendar 
                        scheduleId={schedule.id}
                        startDate={schedule.start_date}
                        endDate={schedule.end_date}
                        startTime={schedule.start_time}
                        endTime={schedule.end_time}
                        timeSlotInterval={schedule.time_slot_interval}
                        availability={Object.fromEntries(
                            schedule.responses.map(response => [
                                response.id,
                                { slots: response.time_slots }
                            ])
                        )}
                        totalResponses={schedule.responses.length}
                    />

                    <div className="recommendations">
                        <h4>Recommended Meeting Times</h4>
                        <div className="recommendation-list">
                            {getBestMeetingTimes().map((slot, index) => (
                                <div key={index} className="recommendation-item">
                                    <span>{format(slot.time, 'MMM d, yyyy h:mm a')}</span>
                                    <div className="availability-bar">
                                        <div 
                                            className="availability-fill" 
                                            style={{ width: `${slot.percentage}%` }}
                                        />
                                    </div>
                                    <span>{Math.round(slot.percentage)}% available</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="action-buttons">
                        {isEditing ? (
                            <>
                                <button onClick={handleSaveEdit}>Save</button>
                                <button onClick={() => setIsEditing(false)}>Cancel</button>
                            </>
                        ) : showDeleteConfirm ? (
                            <>
                                <button 
                                    className="delete-button"
                                    onClick={() => onDelete(schedule.id)}
                                >
                                    Confirm Delete
                                </button>
                                <button onClick={() => setShowDeleteConfirm(false)}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setIsEditing(true)}>Edit</button>
                                <button 
                                    className="delete-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDeleteConfirm(true);
                                    }}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScheduleCard; 