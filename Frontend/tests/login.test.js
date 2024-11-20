// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ role: 'worker' }), // Mock role as 'worker'
    })
  );
  
  import React from 'react';
  import { render, fireEvent, waitFor } from '@testing-library/react-native';
  import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
  import LoginScreen from '../app/screens/authentication/LoginScreen';
  
  describe('LoginScreen', () => {
    it('should log into the application with valid credentials', async () => {
      // Mock navigation and onLogin props
      const mockNavigation = { replace: jest.fn() };
      const mockOnLogin = jest.fn();
  
      // Render the LoginScreen wrapped in a NavigationContainer
      const { getByPlaceholderText, getByText } = render(
        <NavigationContainer>
          <LoginScreen navigation={mockNavigation} onLogin={mockOnLogin} />
        </NavigationContainer>
      );
  
      // user input
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
  
      // Simulate login button press
      fireEvent.press(getByText('Login'));
  
      // Wait for the expected behavior
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalled(); // Ensure onLogin is called
        expect(mockNavigation.replace).toHaveBeenCalledWith('UserTabs', { role: 'worker' }); // Match mocked response
      });
    });
  });
  