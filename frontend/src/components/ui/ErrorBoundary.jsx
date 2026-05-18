import React from 'react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Erreur React:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Une erreur est survenue</h1>
          <p className="mb-6 text-gray-600">Réessayez dans un instant.</p>
          <Button onClick={() => window.location.reload()}>Recharger</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
