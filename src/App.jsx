import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Moon, Sun, CheckCircle2 } from 'lucide-react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import { isPast } from 'date-fns';

function App() {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('todo-tasks');
        return saved ? JSON.parse(saved) : [];
    });

    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('todo-dark-mode');
        return saved ? JSON.parse(saved) : false;
    });

    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('todo-dark-mode', JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('todo-tasks', JSON.stringify(tasks));
    }, [tasks]);
    useEffect(() => {
        const checkDeadlines = () => {
            const now = new Date();
            const oneHourFromNow = Date.now() + 60 * 60 * 1000;

            let upcomingTasks = 0;

            tasks.forEach(task => {
                if (!task.completed && task.deadline) {
                    const deadlineTime = new Date(task.deadline).getTime();
                    if (deadlineTime > now.getTime() && deadlineTime <= oneHourFromNow) {
                        upcomingTasks++;
                    }
                }
            });

            if (upcomingTasks > 0) {
                setNotification(`You have ${upcomingTasks} task(s) nearing deadline!`);
                setTimeout(() => setNotification(null), 5000);
            }
        };

        checkDeadlines(); // Check immediately on mount/update
        const interval = setInterval(checkDeadlines, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [tasks]);

    const handleAddTask = ({ text, deadline }) => {
        setTasks([
            { id: crypto.randomUUID(), text, deadline, completed: false },
            ...tasks
        ]);
    };

    const handleToggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const handleEditTask = (id, newProps) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, ...newProps } : t));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setTasks(items);
    };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
            {notification && (
                <div className="fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce transition-all flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-medium">{notification}</span>
                </div>
            )}

            <div className="max-w-3xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 flex items-center gap-2">
                            <CheckCircle2 size={32} className="text-blue-500" strokeWidth={2.5} />
                            Enhanced To-Do
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                            {completedTasks} of {totalTasks} completed
                        </p>
                    </div>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        title="Toggle Dark Mode"
                    >
                        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                </header>

                <TaskInput onAddTask={handleAddTask} />

                <main className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-2 sm:p-4 overflow-hidden min-h-[400px]">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <TaskList
                            tasks={tasks}
                            onToggle={handleToggleTask}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                        />
                    </DragDropContext>
                </main>
            </div>
        </div>
    );
}

export default App;
