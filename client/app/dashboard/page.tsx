"use client";
import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import DropArea from "../components/DropArea";

interface Task {
  _id: string;
  title: string | null | undefined;
  description: string | null | undefined;
  priority: string;
  deadline: string;
  status: string;
}

const Dashboard = () => {
  const [allTasks, setAllTasks] = useState([] as Task[]);
  const [taskInput, setTaskInput] = useState({
    title: "",
    description: "",
    priority: "",
    deadline: "",
  });

  const [activeCard, setActiveCard] = useState(null);

  const taskInputHandler = (e: any) => {
    const { name, value } = e.target;
    setTaskInput({ ...taskInput, [name]: value });
  };

  const fetchAllTasks = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tasks/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setAllTasks(data);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // "To-Do", "In Progress", "Under Review", "Completed"

  // Categorize tasks by status
  const categorizedTasks = {
    todo: allTasks.filter((task) => task.status === "To-Do"),
    inProgress: allTasks.filter((task) => task.status === "In Progress"),
    underReview: allTasks.filter((task) => task.status === "Under Review"),
    finished: allTasks.filter((task) => task.status === "Completed"),
  };

  const taskCreateHandler = (e: any) => {
    e.preventDefault();

    const taskData = {
      title: taskInput.title,
      description: taskInput.description,
      priority: taskInput.priority,
      deadline: taskInput.deadline,
      status: "Completed",
    };
    fetch("http://localhost:8080/api/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(taskData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetchAllTasks();
        setTaskInput({
          title: "",
          description: "",
          priority: "",
          deadline: "",
        });
      })
      .catch((error) => console.log(error));
  };

  const onDrop = async (status: any, position: any, taskId: any) => {
    console.log(status, position, taskId);
    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status, position }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchAllTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  return (
    <div>
      <div className="flex bg-red-300">
        <div className="w-1/5 bg-white border-r border-gray-300">
          <div>
            <p>Create Task</p>
            <form onSubmit={taskCreateHandler}>
              <input
                type="text"
                placeholder="Title"
                className="w-full border p-2 rounded-md"
                value={taskInput.title}
                name="title"
                onChange={taskInputHandler}
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full border p-2 rounded-md"
                value={taskInput.description}
                name="description"
                onChange={taskInputHandler}
              />
              <input
                type="text"
                placeholder="Priority"
                className="w-full border p-2 rounded-md"
                value={taskInput.priority}
                name="priority"
                onChange={taskInputHandler}
              />
              <input
                type="date"
                placeholder="Deadline"
                className="w-full border p-2 rounded-md"
                value={taskInput.deadline}
                name="deadline"
                onChange={taskInputHandler}
              />
              <button
                type="submit"
                className="bg-red-400 text-white p-2 rounded-md w-full"
              >
                Create
              </button>
            </form>
          </div>
        </div>
        <div className="w-4/5 bg-gray-50">
          {activeCard}
          <div className="bg-white m-4 p-4">
            <div className="grid grid-cols-12 grid-rows-1 gap-4">
              <div className="col-span-3">
                To Do
                <div>
                  {categorizedTasks.todo.map((task, index) => (
                    <>
                      <div
                        draggable="true"
                        onDragStart={() => setActiveCard(task._id)}
                        onDragEnd={() => setActiveCard(null)}
                        className="bg-gray-50 p-2 rounded-md border shadow-sm"
                        key={task._id}
                      >
                        <p className="text-sm">{task.title}</p>
                        <p className="text-xs">{task.description}</p>
                        <span className="text-sm bg-red-400 text-white px-2 py-1 rounded-md">
                          {task.priority}
                        </span>
                        <p className="text-xs">
                          {new Date(task.deadline).toDateString()}
                        </p>
                      </div>
                      <DropArea
                        onDrop={() =>
                          onDrop(task.status, index + 1, activeCard)
                        }
                      />
                    </>
                  ))}
                </div>
              </div>
              <div className="col-span-3 col-start-4">
                In Progress
                <div>
                  {categorizedTasks.inProgress.map((task) => (
                    <div
                      className="bg-gray-50 p-2 rounded-md border shadow-sm"
                      key={task._id}
                    >
                      <p className="text-sm">{task.title}</p>
                      <p className="text-xs">{task.description}</p>
                      <span className="text-sm bg-red-400 text-white px-2 py-1 rounded-md">
                        {task.priority}
                      </span>
                      <p className="text-xs">
                        {new Date(task.deadline).toDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-3 col-start-7">
                Under Review
                <div>
                  {categorizedTasks.underReview.map((task) => (
                    <div
                      className="bg-gray-50 p-2 rounded-md border shadow-sm"
                      key={task._id}
                    >
                      <p className="text-sm">{task.title}</p>
                      <p className="text-xs">{task.description}</p>
                      <span className="text-sm bg-red-400 text-white px-2 py-1 rounded-md">
                        {task.priority}
                      </span>
                      <p className="text-xs">
                        {new Date(task.deadline).toDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-3 col-start-10">
                Finished
                <div>
                  <DropArea onDrop={() => onDrop("Completed", 0, activeCard)} />
                  {categorizedTasks.finished.map((task, index) => (
                    <>
                      <div
                        draggable="true"
                        onDragStart={() => setActiveCard(task._id)}
                        onDragEnd={() => setActiveCard(null)}
                        className="bg-gray-50 p-2 rounded-md border shadow-sm"
                        key={task._id}
                      >
                        <p className="text-sm">{task.title}</p>
                        <p className="text-xs">{task.description}</p>
                        <span className="text-sm bg-red-400 text-white px-2 py-1 rounded-md">
                          {task.priority}
                        </span>
                        <p className="text-xs">
                          {new Date(task.deadline).toDateString()}
                        </p>
                      </div>
                      <DropArea
                        onDrop={() =>
                          onDrop(task.status, index + 1, activeCard)
                        }
                      />
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
