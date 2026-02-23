import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskItem from './TaskItem';
import { ClipboardList } from 'lucide-react';

export default function TaskList({ tasks, onToggle, onDelete, onEdit }) {
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <ClipboardList size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">No tasks yet</p>
                <p className="text-sm">Add a task above to get started!</p>
            </div>
        );
    }

    return (
        <Droppable droppableId="task-list">
            {(provided, snapshot) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[150px] transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
                >
                    {tasks.map((task, index) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            index={index}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}
