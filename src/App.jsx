import React, { useState } from 'react';  // Importa React y el hook useState
import './App.css';  // Importa los estilos CSS (archivo 'App.css')

function App() {
  const [tasks, setTasks] = useState([]);  // Estado para almacenar las tareas (inicialmente vacío)
  const [newTask, setNewTask] = useState('');  // Estado para manejar el texto de la nueva tarea
  const [description, setDescription] = useState('');  // Estado para manejar la descripción de la tarea
  const [dueDate, setDueDate] = useState('');  // Estado para manejar la fecha de la tarea
  const [filter, setFilter] = useState('');  // Estado para manejar el filtro de búsqueda de tareas
  const [isEditing, setIsEditing] = useState(null);  // Estado para verificar si estamos editando una tarea

  // Función para agregar o actualizar una tarea
  const addOrUpdateTask = () => {
    if (!newTask.trim() || !description.trim() || !dueDate.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (isEditing) {
      setTasks(tasks.map(task =>
        task.id === isEditing ? { ...task, text: newTask, description, dueDate } : task
      ));
      setIsEditing(null);
    } else {
      setTasks([...tasks, { id: Date.now(), text: newTask, description, dueDate }]);
    }
    setNewTask('');
    setDescription('');
    setDueDate('');
  };

  // Función para eliminar una tarea
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));  // Filtra las tareas eliminando la que tenga el id igual al pasado
  };

  // Función para editar una tarea
  const editTaskHandler = (task) => {
    setNewTask(task.text);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setIsEditing(task.id);
  };

  // Filtrar las tareas por el texto ingresado en el filtro
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(filter.toLowerCase())  // Convierte tanto el texto de la tarea como el filtro a minúsculas para hacer la comparación
  );

  return (
    <div className="app">
      <h1>CRUD de Tareas</h1>

      <div className="container">
        {/* Parte izquierda: agregar tarea */}
        <div className="left-column">
          <div className="task-input">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Nombre de la tarea"
              required
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción de la tarea"
              required
            />
            <button onClick={addOrUpdateTask}>
              {isEditing ? 'Actualizar Tarea' : 'Agregar Tarea'}
            </button>
          </div>

          <div className="filter-input">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrar tareas"
            />
          </div>
        </div>

        {/* Parte derecha: mostrar tareas */}
        <div className="right-column">
          <ul>
            {filteredTasks.map((task) => (
              <li key={task.id} className="task-item">
                <h3>{task.text}</h3>
                <p><strong>Fecha:</strong> {task.dueDate}</p>
                <p><strong>Descripción:</strong> {task.description}</p>
                <div className="task-buttons">
                  <button onClick={() => editTaskHandler(task)}>Actualizar Tarea</button>
                  <button onClick={() => deleteTask(task.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;


