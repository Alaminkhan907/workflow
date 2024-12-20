// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ role: 'worker' }), // Mock role as 'worker'
    })
  );
  
  // Mock AsyncStorage
  jest.mock('@react-native-async-storage/async-storage', () => {
    let storageCache = {};
    return {
      setItem: jest.fn((key, value) => {
        return new Promise((resolve) => {
          storageCache[key] = value;
          resolve(value);
        });
      }),
      getItem: jest.fn((key) => {
        return new Promise((resolve) => {
          resolve(storageCache[key] || null);
        });
      }),
      removeItem: jest.fn((key) => {
        return new Promise((resolve) => {
          delete storageCache[key];
          resolve();
        });
      }),
      clear: jest.fn(() => {
        return new Promise((resolve) => {
          storageCache = {};
          resolve();
        });
      }),
    };
  });
  
  import React from 'react';
  import { render, fireEvent, waitFor } from '@testing-library/react-native';
  import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
  import LoginScreen from '../app/screens/authentication/LoginScreen';
  
  describe('LoginScreen', () => {
    it('should log into the application with valid credentials', async () => {
      // Mock navigation and onLogin props
      const mockNavigation = { replace: jest.fn() };
      const mockOnLogin = jest.fn();
  
      // Render the LoginScreen
      const { getByPlaceholderText, getByText } = render(
        <NavigationContainer>
          <LoginScreen navigation={mockNavigation} onLogin={mockOnLogin} />
        </NavigationContainer>
      );
  
      // User input
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
      fireEvent.press(getByText('Login'));
  
      // Expected behavior check
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalled(); // Ensure onLogin is called
        expect(mockNavigation.replace).toHaveBeenCalledWith('UserTabs', { role: 'worker' }); // Match mocked response
      });
    });
  });
  
