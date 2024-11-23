import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskCard = ({ task, index, columnId, onDeleteTask }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p>{task.content}</p>
          <button
            className="delete-task"
            onClick={() => onDeleteTask(columnId, task.id)}
          >
            Delete
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
