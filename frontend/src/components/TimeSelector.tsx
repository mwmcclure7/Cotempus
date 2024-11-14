import { useState } from 'react';
import '../styles/TimeSelector.css';

interface AvailabilityBlock {
    start: Date;
    end: Date;
}

interface TimeSelectorProps {
    dateRange: {
        start: Date;
        end: Date;
    };
    timeRange: {
        start: string;
        end: string;
    };
    interval: number;
    name: string;
    onAvailabilityChange: (blocks: AvailabilityBlock[], name: string) => void;
}

interface CellPosition {
    dayIndex: number;
    timeIndex: number;
}

function TimeSelector({ dateRange, timeRange, onAvailabilityChange, name }: TimeSelectorProps) {
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
    const [isSelecting, setIsSelecting] = useState<boolean>(true); //   true = selecting, false = deselecting
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<CellPosition | null>(null);

    const days = getDaysBetween(dateRange.start, dateRange.end);
    const timeSlots = getTimeSlots(timeRange.start, timeRange.end);

    function getDaysBetween(start: Date, end: Date): Date[] {
        const days: Date[] = [];
        let current = new Date(start);
        while (current <= end) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    }

    function getTimeSlots(start: string, end: string): string[] {
        const slots: string[] = [];
        const [startHour] = start.split(':').map(Number);
        const [endHour] = end.split(':').map(Number);
        
        for (let hour = startHour; hour <= endHour; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            if (hour !== endHour) {
                slots.push(`${hour.toString().padStart(2, '0')}:30`);
            }
        }
        return slots;
    }

    const getCellKey = (dayIndex: number, timeIndex: number) => `${dayIndex}-${timeIndex}`;

    const handleMouseDown = (dayIndex: number, timeIndex: number) => {
        setIsDragging(true);
        setDragStart({ dayIndex, timeIndex });
        
        // Toggle selection mode based on current cell state
        const cellKey = getCellKey(dayIndex, timeIndex);
        setIsSelecting(!selectedCells.has(cellKey));
        
        // Update the cell
        updateCellSelection(dayIndex, timeIndex);
    };

    const handleMouseEnter = (dayIndex: number, timeIndex: number) => {
        if (!isDragging || !dragStart) return;

        // Calculate the rectangle of cells to select
        const minDay = Math.min(dragStart.dayIndex, dayIndex);
        const maxDay = Math.max(dragStart.dayIndex, dayIndex);
        const minTime = Math.min(dragStart.timeIndex, timeIndex);
        const maxTime = Math.max(dragStart.timeIndex, timeIndex);

        // Create a new set of selected cells
        const newSelection = new Set(selectedCells);
        
        // Update all cells in the rectangle
        for (let d = minDay; d <= maxDay; d++) {
            for (let t = minTime; t <= maxTime; t++) {
                const key = getCellKey(d, t);
                if (isSelecting) {
                    newSelection.add(key);
                } else {
                    newSelection.delete(key);
                }
            }
        }

        setSelectedCells(newSelection);
        updateAvailabilityBlocks(newSelection);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragStart(null);
    };

    const updateCellSelection = (dayIndex: number, timeIndex: number) => {
        const cellKey = getCellKey(dayIndex, timeIndex);
        const newSelection = new Set(selectedCells);

        if (isSelecting) {
            newSelection.add(cellKey);
        } else {
            newSelection.delete(cellKey);
        }

        setSelectedCells(newSelection);
        updateAvailabilityBlocks(newSelection);
    };

    const updateAvailabilityBlocks = (selection: Set<string>) => {
        const blocks: { start: Date; end: Date; }[] = [];
        
        // Convert selected cells to actual time blocks
        selection.forEach(key => {
            const [dayIndex, timeIndex] = key.split('-').map(Number);
            const date = new Date(days[dayIndex]);
            const [hours, minutes] = timeSlots[timeIndex].split(':').map(Number);
            
            const start = new Date(date);
            start.setHours(hours, minutes, 0, 0);
            
            const end = new Date(start);
            end.setMinutes(end.getMinutes() + 30); // Assuming 30-minute slots
            
            blocks.push({ start, end });
        });

        onAvailabilityChange(blocks, name);
    };

    return (
        <div 
            className="time-selector"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <table className="time-table">
                <thead>
                    <tr>
                        <th className="time-slot-label"></th>
                        {days.map((day, i) => (
                            <th key={i} className="day-label">
                                {day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {timeSlots.map((time, timeIndex) => (
                        <tr key={timeIndex}>
                            <td className="time-slot-label">{time}</td>
                            {days.map((_, dayIndex) => (
                                <td
                                    key={dayIndex}
                                    className={`time-cell ${
                                        selectedCells.has(getCellKey(dayIndex, timeIndex)) ? 'selected' : ''
                                    }`}
                                    onMouseDown={() => handleMouseDown(dayIndex, timeIndex)}
                                    onMouseEnter={() => handleMouseEnter(dayIndex, timeIndex)}
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TimeSelector;