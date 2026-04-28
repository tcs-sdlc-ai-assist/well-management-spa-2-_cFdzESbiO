/**
 * NotFoundPage component - 404 page for invalid routes.
 * Displays a user-friendly message with a button to navigate back to the well list (/).
 * Styled consistently with the dark theme.
 * @module NotFoundPage
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';

/**
 * NotFoundPage renders a 404 error page with navigation back to the well list.
 * @returns {React.ReactElement}
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-6xl font-bold text-stone-100 mb-4">
          404
        </h1>
        <h2 className="text-xl font-semibold text-stone-300 mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-stone-400 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/')}
          ariaLabel="Go back to well list"
        >
          Back to Well List
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;