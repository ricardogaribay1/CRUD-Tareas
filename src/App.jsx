import React, { useState, useEffect } from 'react';  // Importa React y los hooks useState y useEffect
import './App.css';  // Importa los estilos CSS (archivo 'App.css')

function App() {
  const [tasks, setTasks] = useState([]);  // Estado para almacenar las tareas (inicialmente vacío)
  const [newTask, setNewTask] = useState('');  // Estado para manejar el texto de la nueva tarea
  const [description, setDescription] = useState('');  // Estado para manejar la descripción de la tarea
  const [dueDate, setDueDate] = useState('');  // Estado para manejar la fecha de la tarea
  const [filter, setFilter] = useState('');  // Estado para manejar el filtro de búsqueda de tareas
  const [isEditing, setIsEditing] = useState(null);  // Estado para verificar si estamos editando una tarea

  // useEffect para cargar las tareas desde el almacenamiento local cuando el componente se monta
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));  // Recupera las tareas guardadas del localStorage
    if (storedTasks) {
      setTasks(storedTasks);  // Si hay tareas almacenadas, las asignamos al estado 'tasks'
    }
  }, []);  // Este efecto solo se ejecuta una vez, cuando el componente se monta

  // useEffect para guardar las tareas en el localStorage cada vez que el estado 'tasks' cambia
  useEffect(() => {
    // Solo actualizamos el localStorage si hay tareas que guardar
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));  // Guarda las tareas en el localStorage como una cadena JSON
    }
  }, [tasks]);  // Este efecto se ejecuta cada vez que el estado "task" se cambia

  // Función para agregar o actualizar una tarea
  const addOrUpdateTask = () => {
    if (!newTask.trim() || !description.trim() || !dueDate.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (isEditing) {
      // Si estamos editando una tarea, actualizamos su contenido
      setTasks(tasks.map(task =>
        task.id === isEditing ? { ...task, text: newTask, description, dueDate } : task
      ));
      setIsEditing(null);  // Restablece el estado de edición
    } else {
      // Si no estamos editando, agregamos una nueva tarea
      setTasks([...tasks, { id: Date.now(), text: newTask, description, dueDate }]);
    }
    setNewTask('');  // Limpia el campo de la tarea
    setDescription('');  // Limpia el campo de la descripción
    setDueDate('');  // Limpia el campo de la fecha
  };

  // Función para eliminar una tarea
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);  // Filtra las tareas eliminando la que tenga el id pasado
    setTasks(updatedTasks);  // Actualiza el estado con las tareas filtradas
  };

  // Función para editar una tarea
  const editTaskHandler = (task) => {
    setNewTask(task.text);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setIsEditing(task.id);  // Establece el id de la tarea que estamos editando
  };

  // Filtrar las tareas por el texto ingresado en el filtro
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(filter.toLowerCase())  // Convierte tanto el texto de la tarea como el filtro a minúsculas para hacer la comparación
  );

  return (
    <div className="app">
      <h1>Lista de Tareas</h1>

      <div className="container">
        {/* Parte izquierda: agregar tarea */}
        <div className="left-column">
          <div className="task-input">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Nombre Tarea"
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
            <button onClick={addOrUpdateTask} id={isEditing ? 'editing' : ''}>
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
                <p><strong>Fecha Limite:</strong> {task.dueDate}</p>
                <p><strong>Descripción:</strong> {task.description}</p>
                <div className="task-buttons">
                  <button id='update' onClick={() => editTaskHandler(task)}>Actualizar Tarea</button>
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





