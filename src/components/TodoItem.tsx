import { useApp } from "../context/AppContext";
import EditButton from "./EditButton";
import iconDelete from "../assets/icons/icon-delete.png";
import { useEffect, useState } from "react";
import "../styles/todoItem.css";
import { launchConfetti } from "../utils/confetti";

function TodoItem() {
  type InputChange = React.ChangeEvent<HTMLInputElement>;

  const {
    tasksList,
    setTasksList,
    editableTaskId,
    setEditableTaskId,
    hasShownConfetti,
    setHasShownConfetti,
  } = useApp();

  const [valueEdit, setValueEdit] = useState<string>("");

  const toggleCompleted = (id: string) => {
    const updatedTasks = tasksList.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasksList(updatedTasks);
  };

  const handleEdit = (e: InputChange): void => {
    setValueEdit(e.target.value);
  };

  useEffect(() => {
    // Cuando se cambia la tarea editable, cargar su texto en valueEdit
    const editableTask = tasksList.find((task) => task.id === editableTaskId);
    if (editableTask) {
      setValueEdit(editableTask.text);
    }
  }, [editableTaskId, tasksList]);

  const confirmEdit = (id: string) => {
    const updatedTasks = tasksList.map((task) =>
      task.id === id ? { ...task, text: valueEdit } : task
    );
    setTasksList(updatedTasks);
    setEditableTaskId("");
    setValueEdit("");
  };

  useEffect(() => {
    const allCompleted =
      tasksList.length > 0 && tasksList.every((task) => task.completed);

    if (allCompleted && !hasShownConfetti) {
      launchConfetti();
      setHasShownConfetti(true);
    }

    if (!allCompleted && hasShownConfetti) {
      setHasShownConfetti(false);
    }
  }, [tasksList]);

  return (
    <div>
      <ul className="todo-list">
        {tasksList.map((task) => (
          <li className="todo-item" key={task.id}>
            {editableTaskId === task.id ? (
              <input
                className="input-edit"
                type="text"
                value={editableTaskId === task.id ? valueEdit : task.text}
                onChange={handleEdit}
                maxLength={50}
              />
            ) : (
              <>
                <input
                  className="todo-checkbox"
                  name="checkbox"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task.id)}
                  style={{
                    visibility:
                      editableTaskId === task.id ? "hidden" : "visible",
                  }}
                />
                <span
                  className={`todo-task ${task.completed ? "completed" : ""}`}
                >
                  {editableTaskId === task.id ? valueEdit : task.text}
                </span>
              </>
            )}

            {!task.completed && (
              <EditButton
                currentTask={task}
                onConfirmEdit={() => confirmEdit(task.id)}
              />
            )}
            <button
              className="todo-delete"
              onClick={() =>
                setTasksList(tasksList.filter((t) => t.id !== task.id))
              }
            >
              <img
                src={iconDelete}
                alt="Eliminar tarea"
                className="img-icon-delete"
              ></img>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoItem;
