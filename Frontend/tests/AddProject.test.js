import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddProjectScreen from '../app/screens/project/AddProjectScreen';
import { cleanup } from '@testing-library/react-native';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ name: 'New Project', status: 'pending' }),
  })
);

describe('AddProjectScreen', () => {
  it('should create a project and navigate back', async () => {
    jest.setTimeout(10000); // Extend timeout for the test
    const mockNavigation = { replace: jest.fn() };

    // Render the screen with the navigation prop
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <AddProjectScreen navigation={mockNavigation} />
    );

    console.log('Rendering AddProjectScreen');

    // Fill out the form fields
    fireEvent.changeText(getByPlaceholderText('Project Name'), 'New Project');
    fireEvent.changeText(getByPlaceholderText('Description'), 'Project Description');
    fireEvent.changeText(getByPlaceholderText('Assignee'), 'Manager');
    console.log('filling out form fields');

    // simulate date picker (mocked)
    fireEvent.press(getByText('Select Due Date'));
    console.log('Simulating Date Picker');

    // simulate onValueChange
    fireEvent(getByTestId('status-picker'), 'valueChange', 'pending');
    console.log('Simulating Picker value change');

    // simulate submission
    fireEvent.press(getByText('Create Project'));
    console.log('Submitting..');

    // Wait for the fetch call
    console.log('Waiting for fetch call');
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/addProject'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('"name":"New Project"'),
        })
      );
      expect(mockNavigation.replace).toHaveBeenCalledWith('ProjectScreen');
    });
  });
});
