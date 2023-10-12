import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', grade: '' });
  const [editIndex, setEditIndex] = useState(null);

  const loadStudents = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/students');
      setStudents(res.data.Students);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAddStudent = async () => {
    if (newStudent.name && newStudent.grade) {
      if (editIndex !== null) {
        try {
          await axios.put(`http://127.0.0.1:5000/students/${students[editIndex].id}`, newStudent);
          setEditIndex(null);
        } catch (error) {
          console.error('Error al actualizar estudiante:', error);
        }
      } else {
        try {
          await axios.post('http://127.0.0.1:5000/students', newStudent);
        } catch (error) {
          console.error('Error al agregar estudiante:', error);
        }
      }
      loadStudents();
      setNewStudent({ name: '', grade: '' });
    }
  };

  const handleEditStudent = (index) => {
    setEditIndex(index);
    const studentToEdit = students[index];
    setNewStudent({ name: studentToEdit.name, grade: studentToEdit.grade });
  };

  const handleDeleteStudent = async (index) => {
    const studentToDelete = students[index];
    try {
      await axios.delete(`http://127.0.0.1:5000/students/${studentToDelete.id}`);
      loadStudents();
      setEditIndex(null);
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
    }
  };

  return (
    <div className='bg-gray-800 min-h-screen flex items-center justify-center'>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full md:w-2/3 lg:w-1/2">
        <h1 className="text-4xl text-center text-blue-400 font-bold mb-10">VillaCRUD</h1>
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
          <input
            type="text"
            placeholder="Nombre del alumno"
            className="bg-gray-800 text-white border-[1.5px] focus:outline-none shadow-sm p-2 rounded-lg mb-2 md:mb-0 w-full md:w-1/3"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Calificación"
            className="bg-gray-800 text-white border-[1.5px] focus:outline-none shadow-sm p-2 rounded-lg mb-2 md:mb-0 w-full md:w-1/3"
            value={newStudent.grade}
            min="0"
            max="100"
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue === '' || (parseInt(inputValue) >= 0 && parseInt(inputValue) <= 100)) {
                setNewStudent({ ...newStudent, grade: inputValue });
              }
            }}
          />
          <button
            className="bg-blue-400 text-white w-1/4 py-2 px-4 rounded-lg transition duration-300 hover:bg-blue-500"
            onClick={handleAddStudent}
          >
            {editIndex !== null ? 'Guardar' : 'Agregar'}
          </button>
        </div>
        <ul className='mt-4'>
          {students.map((student, index) => (
            <li key={index} className="bg-gray-800 border p-4 rounded-lg shadow-md mb-2 flex justify-between items-center">
              <div>
                <p className='text-lg font-semibold text-white'>{student.name}</p>
                <p className="text-white">Calificación: {student.grade}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-400 text-white py-2 px-4 rounded-lg transition duration-300 hover:bg-blue-500"
                  onClick={() => handleEditStudent(index)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-400 text-white py-2 px-4 rounded-lg transition duration-300 hover:bg-red-500"
                  onClick={() => handleDeleteStudent(index)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
