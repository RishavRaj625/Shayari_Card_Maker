import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CardsProvider } from './context/CardsContext';
import HomePage from './pages/HomePage';
import CreateShayariPage from './pages/CreateShayariPage';
import CardDetailPage from './pages/CardDetailPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <CardsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateShayariPage />} />
          <Route path="/card/:id" element={<CardDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
    </CardsProvider>
  );
}

export default App;