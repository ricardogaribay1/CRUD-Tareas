import React, { useState, useEffect } from 'react';
import './App.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';

function App() {
  const [tasks, setTasks] = useState(() => {
    // Cargar tareas desde localStorage al iniciar
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [filter, setFilter] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [showModal, setShowModal] = useState(false);

  // Guardar tareas en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addOrUpdateTask = () => {
    if (!newTask.trim() || !description.trim() || !dueDate.trim() || !status || !category || !priority) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (isEditing) {
      setTasks(tasks.map(task =>
        task.id === isEditing ? { ...task, text: newTask, description, dueDate, status, category, priority } : task
      ));
      setIsEditing(null);
    } else {
      setTasks([...tasks, { id: Date.now(), text: newTask, description, dueDate, status, category, priority }]);
    }
    setNewTask('');
    setDescription('');
    setDueDate('');
    setStatus('');
    setCategory('');
    setPriority('');
    setShowModal(false);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  const editTaskHandler = (task) => {
    setNewTask(task.text);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setStatus(task.status);
    setCategory(task.category);
    setPriority(task.priority);
    setIsEditing(task.id);
    setShowModal(true);
  };

  const handleDateChange = (ranges) => {
    const { selection } = ranges;
    setDateRange({
      startDate: selection.startDate,
      endDate: selection.endDate,
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesText = task.text.toLowerCase().includes(filter.toLowerCase()) ||
                        task.dueDate.includes(filter.toLowerCase()) ||
                        task.status.toLowerCase().includes(filter.toLowerCase()) ||
                        task.category.toLowerCase().includes(filter.toLowerCase()) ||
                        task.priority.toLowerCase().includes(filter.toLowerCase());

    const matchesDate = dateRange.startDate && dateRange.endDate
      ? new Date(task.dueDate) >= dateRange.startDate && new Date(task.dueDate) <= dateRange.endDate
      : true;

    return matchesText && matchesDate;
  });

  return (
    <div className="app">
      <h1>Lista de Tareas</h1>

      <div className="container">
        <div className="left-column">
          <button className="full-width-button" onClick={() => setShowModal(true)}>
            Agregar Tarea
          </button>

          <div className="filter-input">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrar tareas"
            />
          </div>

          <button className="full-width-button" onClick={() => setShowDateFilter(!showDateFilter)}>
            {showDateFilter ? 'Cerrar Filtro de Fechas' : 'Filtrar por Fechas'}
          </button>

          {showDateFilter && (
            <div className="date-picker-container">
              <div className="date-picker-wrapper">
                <DateRangePicker
                  ranges={[{
                    startDate: dateRange.startDate || new Date(),
                    endDate: dateRange.endDate || new Date(),
                    key: 'selection',
                  }]}
                  onChange={handleDateChange}
                  months={1}
                  direction="horizontal"
                />
              </div>
            </div>
          )}
        </div>

        <div className="right-column">
          {tasks.length === 0 && <p>No hay tareas disponibles.</p>}
          <ul>
            {filteredTasks.map((task) => (
              <li key={task.id} className="task-item">
                <h3>{task.text}</h3>
                <p><strong>Fecha Limite:</strong> {task.dueDate}</p>
                <p><strong>Descripción:</strong> {task.description}</p>
                <p><strong>Estatus:</strong> {task.status}</p>
                <p><strong>Categoría:</strong> {task.category}</p>
                <p><strong>Prioridad:</strong> {task.priority}</p>
                <div className="task-buttons">
                  <button id='update' onClick={() => editTaskHandler(task)}>Actualizar Tarea</button>
                  <button onClick={() => deleteTask(task.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{isEditing ? 'Editar Tarea' : 'Agregar Tarea'}</h2>
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
            <div className="select-input">
              <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="">Selecciona Estatus</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completada">Completada</option>
              </select>
            </div>
            <div className="select-input">
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Selecciona Categoría</option>
                <option value="Trabajo">Trabajo</option>
                <option value="Personal">Personal</option>
                <option value="Estudio">Estudio</option>
              </select>
            </div>
            <div className="select-input">
              <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
                <option value="">Selecciona Prioridad</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <button onClick={addOrUpdateTask}>
              {isEditing ? 'Actualizar Tarea' : 'Agregar Tarea'}
            </button>
            <button className="close-button" onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;







