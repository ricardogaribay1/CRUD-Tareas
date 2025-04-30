import React, { useState, useEffect } from 'react';
import './App.css';
import Modal from './Modal';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import { Calendar } from 'react-date-range';

function App() {
  const [tasks, setTasks] = useState(() => {
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
  const [filterOption, setFilterOption] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      const priorityOrder = { '🔴 p1': 1, '🟡 p2': 2, '🟢 p3': 3 };
      return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    return tasks;
  };

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

  const toggleSortMenu = () => {
    setIsSortMenuOpen(!isSortMenuOpen);
  };

  const handleSortOptionChange = (option) => {
    setSortOption(option);
    setFilterOption('');
    setIsFilterActive(true);
    setIsSortMenuOpen(false);
  };

  const handleFilterOptionChange = (option) => {
    setFilterOption(option);
  };

  const cancelFilter = () => {
    setSortOption('');
    setFilterOption('');
    setDateRange({ startDate: null, endDate: null });
    setIsFilterActive(false);
  };

  const handleDateChange = (ranges) => {
    const { selection } = ranges;
    setDateRange({
      startDate: selection.startDate,
      endDate: selection.endDate,
    });
    setIsFilterActive(true);
    setShowDateFilter(false);
  };

  const renderFilterOptions = () => {
    if (!sortOption || sortOption === 'Fecha límite') return null;

    if (sortOption === 'Prioridad') {
      return (
        <div className="filter-options">
          <button onClick={() => handleFilterOptionChange('🔴 p1')}>🔴 p1</button>
          <button onClick={() => handleFilterOptionChange('🟡 p2')}>🟡 p2</button>
          <button onClick={() => handleFilterOptionChange('🟢 p3')}>🟢 p3</button>
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
          <button onClick={() => handleFilterOptionChange(' 🧍‍♂️  Personal')}>🧍‍♂️ Personal</button>
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
          <h3>Tareas</h3>
          <button className="full-width-button" onClick={() => setShowModal(true)}>➕ Añadir Tarea</button>

          <div className="filter-input">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="🔍 Buscar"
            />
          </div>

          <div className="sort-dropdown">
            <button className="full-width-button" onClick={isFilterActive ? cancelFilter : toggleSortMenu}>
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

          {renderFilterOptions()}
        </div>

        <div className="right-column">
          {tasks.length === 0 && <p>No hubo actividad en la última semana.</p>}
          <ul>
            {filteredAndSortedTasks.map((task) => (
              <li key={task.id} className="task-item">
                <div className="task-header">
                  <h3>
                    {task.priority}&nbsp;
                    {task.text} &nbsp;
                    {task.dueDate} &nbsp;
                  </h3>
                </div>
                <p>{task.description}</p>
                <div className="task-buttons">
                  <button id="update" onClick={() => editTaskHandler(task)}>✏️</button>
                  <button onClick={() => deleteTask(task.id)}>🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showModal && (
        <Modal>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nombre Tarea"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
            required
          />
          <div className="inline-selects">
            <button className="date-button" onClick={() => setShowDatePicker(!showDatePicker)}>📆</button>
            {showDatePicker && (
              <div className="date-picker-overlay">
                <Calendar
                  date={dueDate ? new Date(dueDate) : new Date()}
                  onChange={(date) => {
                    setDueDate(date.toISOString().split('T')[0]);
                    setShowDatePicker(false);
                  }}
                  months={1}
                  direction="horizontal"
                  className="date-picker"
                />
              </div>
            )}
            <div className="select-input">
              <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="">Estatus</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completada">Completada</option>
              </select>
            </div>
            <div className="select-input">
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">📚 Categoría</option>
                <option value="Trabajo">💼 Trabajo</option>
                <option value=" 🧍‍♂️  Personal">🧍‍♂️ Personal</option>
                <option value="Estudio">📖 Estudio</option>
              </select>
            </div>
            <div className="select-input">
              <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
                <option value="">◯ Prioridad</option>
                <option value="🔴 p1">🔴 p1</option>
                <option value="🟡 p2">🟡 p2</option>
                <option value="🟢 p3">🟢 p3</option>
              </select>
            </div>
          </div>
          <button onClick={addOrUpdateTask}>{isEditing ? 'Guardar' : 'Añadir Tarea'}</button>
          <button
            className="close-button"
            onClick={() => {
              setNewTask('');
              setDescription('');
              setDueDate('');
              setStatus('');
              setCategory('');
              setPriority('');
              setIsEditing(null);
              setShowModal(false);
            }}
          >
            Cancelar
          </button>
        </Modal>
      )}
    </div>
  );
}

export default App;
