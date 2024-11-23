import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './components/Column';
import AddTaskModal from './components/AddTaskModal';
import { initialData } from './data';
import useLocalStorage from './hooks/useLocalStorage';

const App = () => {
  const [boardData, setBoardData] = useLocalStorage('kanban-board-data', initialData);
  const [showModal, setShowModal] = useState(false);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = boardData[source.droppableId];
    const destColumn = boardData[destination.droppableId];
    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);

    destColumn.tasks.splice(destination.index, 0, movedTask);

    setBoardData({
      ...boardData,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    });
  };

  const addTask = (task) => {
    setBoardData((prev) => ({
      ...prev,
      todo: {
        ...prev.todo,
        tasks: [...prev.todo.tasks, task],
      },
    }));
  };

  const deleteTask = (columnId, taskId) => {
    setBoardData((prev) => {
      const updatedColumn = prev[columnId].tasks.filter(task => task.id !== taskId);
      return {
        ...prev,
        [columnId]: {
          ...prev[columnId],
          tasks: updatedColumn,
        },
      };
    });
  };

  const downloadBoardData = () => {
    const boardDataJson = JSON.stringify(boardData, null, 2);
    const blob = new Blob([boardDataJson], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'kanban-board-data.json';
    link.click();
  };

  return (
    <div className="App">
      <h1>Kanban Board</h1>
      <button onClick={() => setShowModal(true)}>Add Task</button>
      <button onClick={downloadBoardData}>Export JSON</button>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {Object.entries(boardData).map(([columnId, column]) => (
            <Column
              key={columnId}
              columnId={columnId}
              column={column}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      </DragDropContext>
      {showModal && <AddTaskModal onClose={() => setShowModal(false)} onAdd={addTask} />}
    </div>
  );
};

export default App;
