import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Check, Edit2, GripVertical, Trash2, Calendar, Clock } from 'lucide-react';
import { format, isPast, isToday, formatDistanceToNow, addHours } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function TaskItem({ task, index, onToggle, onDelete, onEdit }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editObj, setEditObj] = useState({ text: task.text, deadline: task.deadline || '' });

    const handleSave = () => {
        if (!editObj.text.trim()) return;
        onEdit(task.id, editObj);
        setIsEditing(false);
    };

    const isNearingDeadline = task.deadline && !task.completed && (() => {
        const deadlineDate = new Date(task.deadline);
        const now = new Date();
        const oneHourFromNow = Date.now() + 60 * 60 * 1000;
        return deadlineDate.getTime() > now.getTime() && deadlineDate.getTime() <= oneHourFromNow;
    })();

    const deadlinePassed = task.deadline && !task.completed && new Date(task.deadline) < new Date();

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                        "mb-3 flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 group bg-white dark:bg-gray-800",
                        snapshot.isDragging ? "shadow-lg scale-[1.02] border-blue-400 dark:border-blue-500 z-10" : "shadow-sm border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                        task.completed ? "opacity-75" : "opacity-100"
                    )}
                >
                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-1 cursor-grab active:cursor-grabbing">
                        <GripVertical size={20} />
                    </div>

                    <button
                        onClick={() => onToggle(task.id)}
                        className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center border transition-colors flex-shrink-0",
                            task.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 dark:border-gray-500 text-transparent hover:border-green-500"
                        )}
                    >
                        <Check size={14} strokeWidth={3} />
                    </button>

                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <div className="flex flex-col gap-2">
                                <input
                                    autoFocus
                                    type="text"
                                    value={editObj.text}
                                    onChange={(e) => setEditObj({ ...editObj, text: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-700 border border-blue-500 px-2 py-1 rounded focus:outline-none dark:text-white"
                                />
                                <input
                                    type="datetime-local"
                                    value={editObj.deadline}
                                    onChange={(e) => setEditObj({ ...editObj, deadline: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-700 border border-blue-500 px-2 py-1 rounded focus:outline-none text-sm dark:text-white dark:color-scheme-dark"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <span className={cn(
                                    "block truncate text-gray-800 dark:text-gray-100 font-medium transition-all",
                                    task.completed && "line-through text-gray-500 dark:text-gray-400 font-normal"
                                )}>
                                    {task.text}
                                </span>
                                {task.deadline && (
                                    <div className={cn(
                                        "flex items-center gap-1.5 text-xs mt-1",
                                        task.completed ? "text-gray-400" :
                                            deadlinePassed ? "text-red-500 font-medium" :
                                                isNearingDeadline ? "text-orange-500 font-medium" : "text-gray-500 dark:text-gray-400"
                                    )}>
                                        {deadlinePassed || isNearingDeadline ? <Clock size={12} /> : <Calendar size={12} />}
                                        <span>
                                            {isToday(new Date(task.deadline))
                                                ? `Today at ${format(new Date(task.deadline), 'h:mm a')}`
                                                : format(new Date(task.deadline), 'MMM d, yyyy h:mm a')}
                                            {!task.completed && (deadlinePassed ? ' (Overdue)' : ` (${formatDistanceToNow(new Date(task.deadline), { addSuffix: true })})`)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        {isEditing ? (
                            <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                                Save
                            </button>
                        ) : (
                            <button onClick={() => setIsEditing(true)} aria-label="Edit task" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                <Edit2 size={18} />
                            </button>
                        )}
                        <button onClick={() => onDelete(task.id)} aria-label="Delete task" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
