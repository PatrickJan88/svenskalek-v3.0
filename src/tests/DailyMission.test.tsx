import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DailyMission from '../components/DailyMission';

describe('DailyMission', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should clear input when clicking the X button', async () => {
    render(<DailyMission />);
    
    // Get the input element
    const input = screen.getByPlaceholderText('Type your answer...');
    
    // Type some text
    await user.type(input, 'test text');
    expect(input).toHaveValue('test text');
    
    // Find and click the clear button
    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);
    
    // Check if input is cleared
    expect(input).toHaveValue('');
  });

  it('should show correct feedback when answer is right', async () => {
    render(<DailyMission />);
    
    const input = screen.getByPlaceholderText('Type your answer...');
    await user.type(input, 'kaffe');
    
    const submitButton = screen.getByRole('button', { name: /check answer/i });
    await user.click(submitButton);
    
    expect(await screen.findByText(/correct/i)).toBeInTheDocument();
  });

  it('should show hint when answer is wrong', async () => {
    render(<DailyMission />);
    
    const input = screen.getByPlaceholderText('Type your answer...');
    await user.type(input, 'wrong answer');
    
    const submitButton = screen.getByRole('button', { name: /check answer/i });
    await user.click(submitButton);
    
    expect(await screen.findByText(/hint/i)).toBeInTheDocument();
  });
});