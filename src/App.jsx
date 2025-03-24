import React, { useState } from 'react';  // Importa React y el hooks useState para manejar el estado  
                                          // Estos te permiten usar el estado y otras características de React sin escribir una clase.
import './App.css';                       // Importa los estilos CSS (archivo 'App.css')

function App() {  // Definición del componente funcional 'App'
  const [tasks, setTasks] = useState([]);  // Estado para almacenar las tareas (inicialmente vacío)
  const [newTask, setNewTask] = useState('');  // Estado para manejar el texto de la nueva tarea
  const [filter, setFilter] = useState('');  // Estado para manejar el filtro de búsqueda de tareas

  // Función para agregar una nueva tarea
  const addTask = () => {
    if (newTask.trim()) {  // Si el campo de tarea no está vacío (elimina espacios al principio y final)
      setTasks([...tasks, { id: Date.now(), text: newTask }]);  // Agrega la nueva tarea con un id único (usando la fecha actual)
      setNewTask('');  // Limpia el campo de entrada después de agregar la tarea
    }
  };

  // Función para eliminar una tarea
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));  // Filtra las tareas eliminando la que tenga el id igual al pasado
  };

  // Filtrar las tareas por el texto ingresado en el filtro
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(filter.toLowerCase())  // Convierte tanto el texto de la tarea como el filtro a minúsculas para hacer la comparación
  );

  return (  // JSX que renderiza el componente
    <div>
      <h1>CRUD de Tareas</h1>  {/* Título de la aplicación */}
      
      {/* Campo de entrada para agregar una nueva tarea */}
      <input
        type="text"
        value={newTask}  // Valor del campo de texto (vinculado al estado 'newTask')
        onChange={(e) => setNewTask(e.target.value)}  // Actualiza el estado 'newTask' con lo que se escribe en el campo
        placeholder="Nueva tarea"  // Texto en el campo de entrada cuando está vacío
      />
      <button onClick={addTask}>Agregar Tarea</button>  {/* Botón para agregar la tarea, dispara la función 'addTask' */}

      {/* Campo de entrada para filtrar las tareas */}
      <input
        type="text"
        value={filter}  // Valor del campo de filtro (vinculado al estado 'filter')
        onChange={(e) => setFilter(e.target.value)}  // Actualiza el estado 'filter' con lo que se escribe en el campo
        placeholder="Filtrar tareas"  // Texto en el campo de entrada cuando está vacío
      />

      <ul>  {/* Lista para mostrar las tareas */}
        {/* Muestra las tareas filtradas */}
        {filteredTasks.map((task) => (
          <li key={task.id}>  {/* Cada tarea es un item de lista con un key único (id) */}
            {task.text}  {/* Muestra el texto de la tarea */}
            <button onClick={() => deleteTask(task.id)}>Eliminar</button>  {/* Botón para eliminar la tarea, dispara 'deleteTask' */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;  // Exporta el componente para ser utilizado en otros lugares de la aplicación
