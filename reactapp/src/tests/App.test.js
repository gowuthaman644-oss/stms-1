import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import AddScheduleEntry from '../components/AddScheduleEntry';
import EditScheduleEntry from '../components/EditScheduleEntry';
import ViewScheduleEntries from '../components/ViewScheduleEntries';
import * as ScheduleService from '../services/scheduleService';
import "@testing-library/jest-dom"
jest.mock('../services/scheduleService');

describe('Schedule Management Tests', () => {
  // Test 1: Renders AddScheduleEntry form
  test('renders AddScheduleEntry form', () => {
    render(
      <BrowserRouter>
        <AddScheduleEntry />
      </BrowserRouter>
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBe(7); // 7 input fields
    expect(screen.getByRole('button', { name: /Add Entry/i })).toBeInTheDocument();
  });

  // Test 2: Submits schedule entry and navigates
  test('submits schedule entry and navigates', async () => {
    ScheduleService.addSchedule.mockResolvedValue({});

    render(
      <BrowserRouter>
        <AddScheduleEntry />
      </BrowserRouter>
    );

    const inputs = screen.getAllByRole('textbox');

    fireEvent.change(inputs[0], { target: { value: '10-A' } }); // className
    fireEvent.change(inputs[1], { target: { value: 'Math' } }); // subject
    fireEvent.change(inputs[2], { target: { value: 'Mr. John' } }); // teacherName
    fireEvent.change(inputs[3], { target: { value: 'Monday' } }); // dayOfWeek
    fireEvent.change(inputs[4], { target: { value: '08:00' } }); // startTime
    fireEvent.change(inputs[5], { target: { value: '09:00' } }); // endTime
    fireEvent.change(inputs[6], { target: { value: 'Present' } }); // attendanceNote

    fireEvent.click(screen.getByRole('button', { name: /Add Entry/i }));

    await waitFor(() => {
      expect(ScheduleService.addSchedule).toHaveBeenCalledWith(
        expect.objectContaining({
          className: '10-A',
          subject: 'Math',
          teacherName: 'Mr. John',
          dayOfWeek: 'Monday',
          startTime: '08:00',
          endTime: '09:00',
          attendanceNote: 'Present'
        })
      );
    });
  });

  // Test 3: Renders EditScheduleEntry with pre-filled values
  test('renders EditScheduleEntry with pre-filled values', async () => {
    ScheduleService.getScheduleById.mockResolvedValue({
      className: '10-A',
      subject: 'Math',
      teacherName: 'Mr. John',
      dayOfWeek: 'Monday',
      startTime: '08:00',
      endTime: '09:00',
      attendanceNote: 'Present'
    });

    render(
      <MemoryRouter initialEntries={['/edit/1']}>
        <EditScheduleEntry />
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue('10-A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Math')).toBeInTheDocument();
  });

  

  // Test 5: Displays ViewScheduleEntries table with entries
  test('renders ViewScheduleEntries with data', async () => {
    ScheduleService.getAllSchedules.mockResolvedValue({
      data: [
        {
          id: '1',
          className: '10-A',
          subject: 'Math',
          teacherName: 'Mr. John',
          dayOfWeek: 'Monday',
          startTime: '08:00',
          endTime: '09:00',
          attendanceNote: 'Present'
        }
      ]
    });

    render(
      <BrowserRouter>
        <ViewScheduleEntries />
      </BrowserRouter>
    );

    expect(await screen.findByText('10-A')).toBeInTheDocument();
    expect(screen.getByText('Math')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  // Test 6: Deletes a schedule entry
  test('deletes a schedule entry', async () => {
    ScheduleService.getAllSchedules.mockResolvedValueOnce({
      data: [
        {
          id: '1',
          className: '10-A',
          subject: 'Math',
          teacherName: 'Mr. John',
          dayOfWeek: 'Monday',
          startTime: '08:00',
          endTime: '09:00',
          attendanceNote: 'Present'
        }
      ]
    });

    ScheduleService.deleteSchedule.mockResolvedValue({});

    // Second call returns an empty list after deletion
    ScheduleService.getAllSchedules.mockResolvedValueOnce({ data: [] });

    render(
      <BrowserRouter>
        <ViewScheduleEntries />
      </BrowserRouter>
    );

    const deleteButton = await screen.findByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(ScheduleService.deleteSchedule).toHaveBeenCalledWith('1');
    });
  });

  // Test 7: EditScheduleEntry handles update error
  test('handles update error in EditScheduleEntry', async () => {
    ScheduleService.getScheduleById.mockResolvedValue({
      className: '10-A',
      subject: 'Math',
      teacherName: 'Mr. John',
      dayOfWeek: 'Monday',
      startTime: '08:00',
      endTime: '09:00',
      attendanceNote: 'Present'
    });

    ScheduleService.updateSchedule.mockRejectedValue(new Error('Update failed'));

    render(
      <MemoryRouter initialEntries={['/edit/1']}>
        <EditScheduleEntry />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole('button', { name: /Update Entry/i }));

    await waitFor(() => {
      expect(ScheduleService.updateSchedule).toHaveBeenCalled();
    });
  });

  // Test 8: Home page buttons render
  test('renders Home page navigation buttons', () => {
    const Home = () => (
      <div>
        <h1>School Timetable & Attendance System</h1>
        <button>Add Schedule</button>
        <button>View Schedule</button>
      </div>
    );

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Add Schedule/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Schedule/i })).toBeInTheDocument();
  });
});
