// Mock database for tasks
const mockTasks = [
    { id: 'task123', title: 'Urgent Task', assignee: 'worker123', deadline: '2024-12-21' },
];

// mock API setup
const api = {
    login: jest.fn(async (username, password) => {
        if (username === 'worker' && password === 'password') {
            return { status: 200, token: 'worker-token' };
        } else if (username === 'manager' && password === 'managerPassword') {
            return { status: 200, token: 'manager-token' };
        } else if (username === 'worker123' && password === 'workerPassword') {
            return { status: 200, token: 'worker123-token' };
        }
        return { status: 401 };
    }),
    getTimetable: jest.fn(async (token, period, assignee) => {
        if (token === 'worker-token' || (token === 'manager-token' && assignee === 'worker123')) {
            return {
                tasks: mockTasks.filter(task => !assignee || task.assignee === assignee),
            };
        }
        return { tasks: [] };
    }),
    addTask: jest.fn(async (token, task) => {
        if (token === 'manager-token') {
            mockTasks.push(task);
            return { status: 201 };
        }
        return { status: 403 };
    }),
    editTask: jest.fn(async (token, task) => {
        if (token === 'manager-token') {
            const taskToEdit = mockTasks.find(t => t.id === task.id);
            if (taskToEdit) {
                taskToEdit.title = task.title;
                return { status: 200 };
            }
        }
        return { status: 403 };
    }),
};

// UC1 - Manage Workflow Tables
// 4 tests
describe('UC1 - Manage Workflow Tables', () => {
    test('Worker logs in and views daily and weekly workflow timetables', async () => {
        const response = await api.login('worker', 'password');
        expect(response.status).toBe(200);
        const timetable = await api.getTimetable(response.token, 'daily');
        expect(timetable).toHaveProperty('tasks');
        expect(timetable.tasks).toBeInstanceOf(Array);
    });

    test('Manager adds a new task and updates the workflow table', async () => {
        const loginResponse = await api.login('manager', 'managerPassword');
        expect(loginResponse.status).toBe(200);

        const task = {
            title: 'Urgent Task',
            assignee: 'worker123',
            deadline: '2024-12-21',
        };
        const addTaskResponse = await api.addTask(loginResponse.token, task);
        expect(addTaskResponse.status).toBe(201);

        const workerTimetable = await api.getTimetable(loginResponse.token, 'daily', 'worker123');
        expect(workerTimetable.tasks.some(t => t.title === 'Urgent Task')).toBe(true);
    });

    test('Manager edits the title of an urgent task', async () => {
        const loginResponse = await api.login('manager', 'managerPassword');
        expect(loginResponse.status).toBe(200);

        const updatedTask = {
            id: 'task123',
            title: 'Updated Urgent Task',
        };
        const editTaskResponse = await api.editTask(loginResponse.token, updatedTask);
        expect(editTaskResponse.status).toBe(200);

        const workerTimetable = await api.getTimetable(loginResponse.token, 'daily', 'worker123');
        expect(workerTimetable.tasks.some(t => t.title === 'Updated Urgent Task')).toBe(true);
    });

    test('Tasks visible only to assigned workers', async () => {
        const managerLogin = await api.login('manager', 'managerPassword');
        expect(managerLogin.status).toBe(200);

        const workerLogin = await api.login('worker123', 'workerPassword');
        expect(workerLogin.status).toBe(200);

        const timetable = await api.getTimetable(workerLogin.token, 'daily');
        timetable.tasks.forEach(task => {
            expect(task.assignee).toBe('worker123');
        });
    });
});