import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge.jsx';

describe('Badge', () => {
  describe('rendering', () => {
    it('renders with default text content based on variant', () => {
      render(<Badge variant="active" />);

      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Active');
    });

    it('renders children text content when provided', () => {
      render(<Badge variant="active">Online</Badge>);

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('Online');
    });

    it('renders with role="status"', () => {
      render(<Badge variant="inactive" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders JSX children', () => {
      render(
        <Badge variant="active">
          <span data-testid="custom-child">Custom</span>
        </Badge>
      );

      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    });
  });

  describe('active variant', () => {
    it('applies emerald classes for active variant', () => {
      render(<Badge variant="active" />);

      const badge = screen.getByRole('status');
      expect(badge.className).toContain('bg-emerald-500/10');
      expect(badge.className).toContain('text-emerald-500');
      expect(badge.className).toContain('border-emerald-500/20');
    });

    it('renders pulsing dot for active variant', () => {
      const { container } = render(<Badge variant="active" />);

      const pulsingDot = container.querySelector('.animate-ping');
      expect(pulsingDot).toBeInTheDocument();
    });

    it('renders pulsing dot core with emerald background', () => {
      const { container } = render(<Badge variant="active" />);

      const dotCore = container.querySelector('.bg-emerald-500');
      expect(dotCore).toBeInTheDocument();
    });

    it('renders pulsing dot inner with emerald background', () => {
      const { container } = render(<Badge variant="active" />);

      const dotInner = container.querySelector('.bg-emerald-400');
      expect(dotInner).toBeInTheDocument();
    });

    it('marks pulsing dot as aria-hidden', () => {
      const { container } = render(<Badge variant="active" />);

      const dotWrapper = container.querySelector('[aria-hidden="true"]');
      expect(dotWrapper).toBeInTheDocument();
    });
  });

  describe('inactive variant', () => {
    it('applies neutral/stone classes for inactive variant', () => {
      render(<Badge variant="inactive" />);

      const badge = screen.getByRole('status');
      expect(badge.className).toContain('bg-stone-500/10');
      expect(badge.className).toContain('text-stone-400');
      expect(badge.className).toContain('border-stone-500/20');
    });

    it('does not render pulsing dot for inactive variant', () => {
      const { container } = render(<Badge variant="inactive" />);

      const pulsingDot = container.querySelector('.animate-ping');
      expect(pulsingDot).not.toBeInTheDocument();
    });

    it('renders default text as "Inactive"', () => {
      render(<Badge variant="inactive" />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('Inactive');
    });
  });

  describe('accessibility', () => {
    it('includes default aria-label with variant name for active', () => {
      render(<Badge variant="active" />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Status: active');
    });

    it('includes default aria-label with variant name for inactive', () => {
      render(<Badge variant="inactive" />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Status: inactive');
    });

    it('uses custom ariaLabel when provided', () => {
      render(<Badge variant="active" ariaLabel="Well is currently active" />);

      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Well is currently active');
    });

    it('is accessible by role="status"', () => {
      render(<Badge variant="active" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('base classes', () => {
    it('includes base styling classes', () => {
      render(<Badge variant="active" />);

      const badge = screen.getByRole('status');
      expect(badge.className).toContain('inline-flex');
      expect(badge.className).toContain('items-center');
      expect(badge.className).toContain('text-xs');
      expect(badge.className).toContain('font-medium');
      expect(badge.className).toContain('rounded-md');
    });

    it('includes padding classes', () => {
      render(<Badge variant="inactive" />);

      const badge = screen.getByRole('status');
      expect(badge.className).toContain('px-2.5');
      expect(badge.className).toContain('py-0.5');
    });
  });

  describe('custom className', () => {
    it('applies additional custom className', () => {
      render(<Badge variant="active" className="mt-2 custom-badge" />);

      const badge = screen.getByRole('status');
      expect(badge.className).toContain('mt-2');
      expect(badge.className).toContain('custom-badge');
    });

    it('preserves variant classes alongside custom className', () => {
      render(<Badge variant="active" className="extra-class" />);

      const badge = screen.getByRole('status');
      expect(badge.className).toContain('bg-emerald-500/10');
      expect(badge.className).toContain('extra-class');
    });
  });

  describe('edge cases', () => {
    it('renders with empty string children', () => {
      render(<Badge variant="active">{''}</Badge>);

      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });

    it('renders with numeric children', () => {
      render(<Badge variant="inactive">{0}</Badge>);

      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });
  });
});