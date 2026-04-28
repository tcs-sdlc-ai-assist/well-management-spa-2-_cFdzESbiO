import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button.jsx';

describe('Button', () => {
  describe('rendering', () => {
    it('renders children text content', () => {
      render(<Button ariaLabel="Test button">Click Me</Button>);

      expect(screen.getByRole('button', { name: 'Test button' })).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders with default type="button"', () => {
      render(<Button ariaLabel="Test button">Submit</Button>);

      const button = screen.getByRole('button', { name: 'Test button' });
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders with type="submit" when specified', () => {
      render(<Button type="submit" ariaLabel="Submit form">Submit</Button>);

      const button = screen.getByRole('button', { name: 'Submit form' });
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('renders JSX children', () => {
      render(
        <Button ariaLabel="Icon button">
          <span data-testid="icon">★</span>
          <span>Star</span>
        </Button>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Star')).toBeInTheDocument();
    });
  });

  describe('variant classes', () => {
    it('applies primary variant classes by default', () => {
      render(<Button ariaLabel="Primary">Primary</Button>);

      const button = screen.getByRole('button', { name: 'Primary' });
      expect(button.className).toContain('bg-blue-600');
      expect(button.className).toContain('text-white');
    });

    it('applies primary variant classes when variant="primary"', () => {
      render(<Button variant="primary" ariaLabel="Primary">Primary</Button>);

      const button = screen.getByRole('button', { name: 'Primary' });
      expect(button.className).toContain('bg-blue-600');
      expect(button.className).toContain('text-white');
      expect(button.className).toContain('hover:bg-blue-700');
    });

    it('applies success variant classes', () => {
      render(<Button variant="success" ariaLabel="Success">Success</Button>);

      const button = screen.getByRole('button', { name: 'Success' });
      expect(button.className).toContain('bg-emerald-500');
      expect(button.className).toContain('text-white');
      expect(button.className).toContain('hover:bg-emerald-600');
    });

    it('applies secondary variant classes', () => {
      render(<Button variant="secondary" ariaLabel="Secondary">Secondary</Button>);

      const button = screen.getByRole('button', { name: 'Secondary' });
      expect(button.className).toContain('bg-stone-800');
      expect(button.className).toContain('text-stone-100');
      expect(button.className).toContain('border-stone-700');
    });

    it('applies outline variant classes', () => {
      render(<Button variant="outline" ariaLabel="Outline">Outline</Button>);

      const button = screen.getByRole('button', { name: 'Outline' });
      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('text-stone-100');
      expect(button.className).toContain('border-stone-700');
    });

    it('applies danger variant classes', () => {
      render(<Button variant="danger" ariaLabel="Danger">Danger</Button>);

      const button = screen.getByRole('button', { name: 'Danger' });
      expect(button.className).toContain('bg-red-600');
      expect(button.className).toContain('text-white');
      expect(button.className).toContain('hover:bg-red-700');
    });
  });

  describe('size classes', () => {
    it('applies md size classes by default', () => {
      render(<Button ariaLabel="Medium">Medium</Button>);

      const button = screen.getByRole('button', { name: 'Medium' });
      expect(button.className).toContain('px-4');
      expect(button.className).toContain('py-2');
      expect(button.className).toContain('text-sm');
    });

    it('applies lg size classes when size="lg"', () => {
      render(<Button size="lg" ariaLabel="Large">Large</Button>);

      const button = screen.getByRole('button', { name: 'Large' });
      expect(button.className).toContain('px-6');
      expect(button.className).toContain('py-3');
      expect(button.className).toContain('text-base');
    });
  });

  describe('base classes', () => {
    it('includes base styling classes', () => {
      render(<Button ariaLabel="Base">Base</Button>);

      const button = screen.getByRole('button', { name: 'Base' });
      expect(button.className).toContain('inline-flex');
      expect(button.className).toContain('items-center');
      expect(button.className).toContain('justify-center');
      expect(button.className).toContain('font-medium');
      expect(button.className).toContain('rounded-lg');
      expect(button.className).toContain('transition-colors');
    });
  });

  describe('onClick handler', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick} ariaLabel="Clickable">Click</Button>);

      const button = screen.getByRole('button', { name: 'Clickable' });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick multiple times on multiple clicks', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick} ariaLabel="Multi click">Click</Button>);

      const button = screen.getByRole('button', { name: 'Multi click' });
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('disabled state', () => {
    it('sets the disabled attribute when disabled is true', () => {
      render(<Button disabled ariaLabel="Disabled">Disabled</Button>);

      const button = screen.getByRole('button', { name: 'Disabled' });
      expect(button).toBeDisabled();
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Button onClick={handleClick} disabled ariaLabel="Disabled click">
          Disabled
        </Button>
      );

      const button = screen.getByRole('button', { name: 'Disabled click' });
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies disabled styling classes', () => {
      render(<Button disabled ariaLabel="Disabled style">Disabled</Button>);

      const button = screen.getByRole('button', { name: 'Disabled style' });
      expect(button.className).toContain('disabled:opacity-50');
      expect(button.className).toContain('disabled:cursor-not-allowed');
    });

    it('is not disabled by default', () => {
      render(<Button ariaLabel="Enabled">Enabled</Button>);

      const button = screen.getByRole('button', { name: 'Enabled' });
      expect(button).not.toBeDisabled();
    });
  });

  describe('custom className', () => {
    it('applies additional custom className', () => {
      render(
        <Button className="mt-4 custom-class" ariaLabel="Custom">
          Custom
        </Button>
      );

      const button = screen.getByRole('button', { name: 'Custom' });
      expect(button.className).toContain('mt-4');
      expect(button.className).toContain('custom-class');
    });

    it('preserves variant classes alongside custom className', () => {
      render(
        <Button variant="success" className="extra-class" ariaLabel="Combined">
          Combined
        </Button>
      );

      const button = screen.getByRole('button', { name: 'Combined' });
      expect(button.className).toContain('bg-emerald-500');
      expect(button.className).toContain('extra-class');
    });
  });

  describe('aria attributes', () => {
    it('applies aria-label when provided', () => {
      render(<Button ariaLabel="Accessible button">Click</Button>);

      const button = screen.getByRole('button', { name: 'Accessible button' });
      expect(button).toHaveAttribute('aria-label', 'Accessible button');
    });

    it('renders without aria-label when not provided', () => {
      render(<Button>No Aria</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-label');
    });

    it('is accessible by role', () => {
      render(<Button ariaLabel="Role test">Role</Button>);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});