import React, { useEffect, useState } from "react";
import AddTaskForm from "../../components/AddTaskForm/AddTaskForm";
import TodoTitle from "../../components/TodoTitle/TodoTitle";
import TaskList from "../../components/TaskList/TaskList";
import TaskFilterControls from "../../components/TaskFilterControls/TaskFilterControls";
import styles from "./HomePage.module.scss";
import { Task, TaskFilter } from "../../types";
import { v4 as uuidv4 } from "uuid";

export const LOCAL_STORAGE_KEY = "tasks";

const getInitialTasks = (): Task[] => {
  const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!storedTasks) return [];

  try {
    const parsedTasks: Task[] = JSON.parse(storedTasks);
    if (Array.isArray(parsedTasks)) return parsedTasks;
  } catch (error) {
    console.error("Failed to parse tasks from localStorage:", error);
  }
  return [];
};

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);
  const [filter, setFilter] = useState<TaskFilter>(TaskFilter.All);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage:", error);
    }
  }, [tasks]);

  const addTask = (taskContent: string) => {
    const newTask: Task = {
      id: uuidv4(),
      content: taskContent,
      isCompleted: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task)));
  };

  const handleFilterChange = (newFilter: TaskFilter) => {
    setFilter(newFilter);
  };

  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.isCompleted));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === TaskFilter.Completed) return task.isCompleted;
    if (filter === TaskFilter.Active) return !task.isCompleted;
    return true;
  });

  return (
    <div className={styles["box"]}>
      <div className={styles["content"]}>
        <TodoTitle />
        <AddTaskForm onAddTask={addTask} />
        <TaskFilterControls currentFilter={filter} onFilterChange={handleFilterChange} onClearCompleted={handleClearCompleted} />
        <TaskList tasks={filteredTasks} deleteTask={deleteTask} toggleTask={toggleTask} />
      </div>
    </div>
  );
};

export default HomePage;
