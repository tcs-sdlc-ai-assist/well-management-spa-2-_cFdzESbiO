import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WellProvider } from './context/WellContext.jsx';
import { WellListPage } from './pages/WellListPage.jsx';
import { CreateWellPage } from './pages/CreateWellPage.jsx';
import { CreateSidetrackPage } from './pages/CreateSidetrackPage.jsx';
import { EditWellPage } from './pages/EditWellPage.jsx';
import { WellDetailPage } from './pages/WellDetailPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

/**
 * Root application component.
 * Wraps the app in WellProvider for global well state management.
 * Sets up BrowserRouter with all application routes.
 * @returns {React.ReactElement}
 */
function App() {
  return (
    <WellProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WellListPage />} />
          <Route path="/wells/new" element={<CreateWellPage />} />
          <Route path="/wells/sidetrack/new" element={<CreateSidetrackPage />} />
          <Route path="/wells/:id/edit" element={<EditWellPage />} />
          <Route path="/wells/:id" element={<WellDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </WellProvider>
  );
}

export default App;