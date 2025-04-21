import React, { useState, useEffect } from 'react';
import './App.css';
import Modal from './Modal';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';

function App() {
  // Estado inicial para las tareas, cargadas desde localStorage
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  // Estados para manejar los datos de las tareas y la interfaz
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [filter, setFilter] = useState('');
  const [filterOption, setFilterOption] = useState(''); // Opción específica del filtro
  const [isEditing, setIsEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortOption, setSortOption] = useState(''); // Opción de ordenamiento seleccionada
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false); // Controla si el menú de orden está abierto
  const [isFilterActive, setIsFilterActive] = useState(false); // Indica si un filtro está activo
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null }); // Estado para el rango de fechas
  const [showDateFilter, setShowDateFilter] = useState(false); // Controla la visibilidad del filtro de rango de fechas

  // Guarda las tareas en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Agrega una nueva tarea o actualiza una existente
  const addOrUpdateTask = () => {
    if (!newTask.trim() || !description.trim() || !dueDate.trim() || !status || !category || !priority) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (isEditing) {
      // Actualiza una tarea existente
      setTasks(tasks.map(task =>
        task.id === isEditing ? { ...task, text: newTask, description, dueDate, status, category, priority } : task
      ));
      setIsEditing(null);
    } else {
      // Agrega una nueva tarea
      setTasks([...tasks, { id: Date.now(), text: newTask, description, dueDate, status, category, priority }]);
    }

    // Reinicia los campos del formulario
    setNewTask('');
    setDescription('');
    setDueDate('');
    setStatus('');
    setCategory('');
    setPriority('');
    setShowModal(false);
  };

  // Elimina una tarea por su ID
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  // Carga los datos de una tarea en el formulario para editarla
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

  // Ordena las tareas según la opción seleccionada
  const sortTasks = (tasks) => {
    if (sortOption === 'Fecha límite') {
      return [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    if (sortOption === 'Estatus') {
      const statusOrder = { 'Pendiente': 1, 'En Progreso': 2, 'Completada': 3 };
      return [...tasks].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }
    if (sortOption === 'Categoría') {
      return [...tasks].sort((a, b) => a.category.localeCompare(b.category));
    }
    if (sortOption === 'Prioridad') {
      const priorityOrder = { 'Alta': 1, 'Media': 2, 'Baja': 3 };
      return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    return tasks; // Por defecto, en el orden en que fueron agregadas
  };

  // Filtra y ordena las tareas según el filtro y la búsqueda
  const filteredAndSortedTasks = sortTasks(
    tasks.filter((task) => {
      const matchesFilterOption = filterOption
        ? (sortOption === 'Prioridad' && task.priority === filterOption) ||
          (sortOption === 'Estatus' && task.status === filterOption) ||
          (sortOption === 'Categoría' && task.category === filterOption)
        : true;

      const matchesDateRange = dateRange.startDate && dateRange.endDate
        ? new Date(task.dueDate) >= dateRange.startDate && new Date(task.dueDate) <= dateRange.endDate
        : true;

      const matchesSearch = task.text.toLowerCase().includes(filter.toLowerCase()) ||
        task.dueDate.includes(filter.toLowerCase()) ||
        task.status.toLowerCase().includes(filter.toLowerCase()) ||
        task.category.toLowerCase().includes(filter.toLowerCase()) ||
        task.priority.toLowerCase().includes(filter.toLowerCase()) ||
        task.description.toLowerCase().includes(filter.toLowerCase());

      return matchesFilterOption && matchesDateRange && matchesSearch;
    })
  );

  // Alterna la visibilidad del menú de ordenamiento
  const toggleSortMenu = () => {
    setIsSortMenuOpen(!isSortMenuOpen);
  };

  // Cambia la opción de ordenamiento y activa el filtro
  const handleSortOptionChange = (option) => {
    setSortOption(option); // Actualiza la opción seleccionada
    setFilterOption(''); // Reinicia el filtro específico
    setIsFilterActive(true); // Activa el filtro
    setIsSortMenuOpen(false); // Cierra el menú después de seleccionar una opción
  };

  // Cambia la opción específica del filtro
  const handleFilterOptionChange = (option) => {
    setFilterOption(option); // Actualiza la opción específica seleccionada
  };

  // Cancela el filtro y restablece el estado inicial
  const cancelFilter = () => {
    setSortOption(''); // Reinicia el filtro
    setFilterOption(''); // Reinicia la opción específica
    setDateRange({ startDate: null, endDate: null }); // Reinicia el rango de fechas
    setIsFilterActive(false); // Desactiva el filtro
  };

  // Maneja el cambio de rango de fechas y cierra el filtro de rango de fechas
  const handleDateChange = (ranges) => {
    const { selection } = ranges;
    setDateRange({
      startDate: selection.startDate,
      endDate: selection.endDate,
    });
    setIsFilterActive(true); // Activa el filtro
    setShowDateFilter(false); // Cierra el filtro de rango de fechas automáticamente
  };

  // Renderiza las opciones del filtro según la opción de ordenamiento seleccionada
  const renderFilterOptions = () => {
    if (!sortOption || sortOption === 'Fecha límite') return null; // No mostrar opciones si no hay filtro activo o es "Fecha límite"

    if (sortOption === 'Prioridad') {
      return (
        <div className="filter-options">
          <button onClick={() => handleFilterOptionChange('Alta')}>Alta</button>
          <button onClick={() => handleFilterOptionChange('Media')}>Media</button>
          <button onClick={() => handleFilterOptionChange('Baja')}>Baja</button>
        </div>
      );
    }

    if (sortOption === 'Estatus') {
      return (
        <div className="filter-options">
          <button onClick={() => handleFilterOptionChange('Pendiente')}>Pendiente</button>
          <button onClick={() => handleFilterOptionChange('En Progreso')}>En Progreso</button>
          <button onClick={() => handleFilterOptionChange('Completada')}>Completada</button>
        </div>
      );
    }

    if (sortOption === 'Categoría') {
      return (
        <div className="filter-options">
          <button onClick={() => handleFilterOptionChange('Trabajo')}>Trabajo</button>
          <button onClick={() => handleFilterOptionChange('Personal')}>Personal</button>
          <button onClick={() => handleFilterOptionChange('Estudio')}>Estudio</button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app">

      <div className="container">
        <div className="left-column">
          <h1>Lista de Tareas</h1>
          <button className="full-width-button" onClick={() => setShowModal(true)}>
            ➕ Agregar Tarea
          </button>

          <div className="filter-input">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="🔍 Buscar"
            />
          </div>

          <div className="sort-dropdown">
            <button
              className="full-width-button"
              onClick={isFilterActive ? cancelFilter : toggleSortMenu} // Alternar entre cancelar filtro y abrir menú
            >
              {isFilterActive ? 'Cancelar filtro' : '☰ Ordenar por'}
            </button>
            {isSortMenuOpen && (
              <div className="dropdown-options">
                <button onClick={() => handleSortOptionChange('Fecha límite')}>Fecha límite</button>
                <button onClick={() => handleSortOptionChange('Estatus')}>Estatus</button>
                <button onClick={() => handleSortOptionChange('Categoría')}>Categoría</button>
                <button onClick={() => handleSortOptionChange('Prioridad')}>Prioridad</button>
                <button onClick={() => setShowDateFilter(!showDateFilter)}>Rango de Fechas</button>
              </div>
            )}
          </div>

          {showDateFilter && (
            <div className="date-picker-container">
              <DateRangePicker
                ranges={[{
                  startDate: dateRange.startDate || new Date(),
                  endDate: dateRange.endDate || new Date(),
                  key: 'selection',
                }]}
                onChange={handleDateChange}
                months={1}
                direction="horizontal"
                className="date-picker"
              />
            </div>
          )}

          {/* Renderizar las opciones del filtro dinámicamente */}
          {renderFilterOptions()}
        </div>

        <div className="right-column">
          {tasks.length === 0 && <p>No hay tareas disponibles.</p>}
          <ul>
            {filteredAndSortedTasks.map((task) => (
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
        <Modal>
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
        </Modal>
      )}
    </div>
  );
}

export default App;