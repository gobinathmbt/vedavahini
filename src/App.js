import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TaskTable from './Components/TaskTable.jsx';


const MasterTaskTable = () => {
  return (
    <>
      <TaskTable />
    </>
  );
};



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MasterTaskTable />} />
      </Routes>
    </Router>
  );
};

export default App;
