import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Table from '../src/Table';
import TableDetails from '../src/TableDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Table />} />
        <Route path="/table/:id" element={<TableDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
