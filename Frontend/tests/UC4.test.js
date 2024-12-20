// Mock database for tasks and projects
const mockProjects = [];
const mockNotifications = [];
const mockComments = [];
const mockTasks = [];

// Mock API setup
const api = {
    login: jest.fn(async (username, password) => {
        if (username === 'manager' && password === 'managerPassword') {
            return { status: 200, token: 'manager-token' };
        } else if (username === 'worker' && password === 'workerPassword') {
            return { status: 200, token: 'worker-token' };
        }
        return { status: 401 };
    }),
    assignPriority: jest.fn(async (token, taskId, priority) => {
        if (token === 'manager-token') {
            const task = mockTasks.find(t => t.id === taskId);
            if (task) {
                task.priority = priority;
                return { status: 200 };
            }
        }
        return { status: 403 };
    }),
    addTag: jest.fn(async (token, taskId, tag) => {
        if (token === 'manager-token') {
            const task = mockTasks.find(t => t.id === taskId);
            if (task) {
                task.tags = task.tags || [];
                task.tags.push(tag);
                return { status: 200 };
            }
        }
        return { status: 403 };
    }),
    getTaskDetails: jest.fn(async (token, taskId) => {
        if (token === 'worker-token' || token === 'manager-token') {
            const task = mockTasks.find(t => t.id === taskId);
            if (task) {
                return { status: 200, task };
            }
        }
        return { status: 403 };
    }),
};

// UC4 - Task Prioritization and Tracking
// 3 tests
describe('UC4 - Task Prioritization and Tracking', () => {
    beforeAll(() => {
        mockTasks.push({ id: 'task123', title: 'Test Task', assignee: 'worker', priority: 'low', tags: [] });
    });

    test('Manager assigns priority to a task', async () => {
        const loginResponse = await api.login('manager', 'managerPassword');
        expect(loginResponse.status).toBe(200);

        const assignPriorityResponse = await api.assignPriority(loginResponse.token, 'task123', 'high');
        expect(assignPriorityResponse.status).toBe(200);

        const taskDetailsResponse = await api.getTaskDetails(loginResponse.token, 'task123');
        expect(taskDetailsResponse.status).toBe(200);
        expect(taskDetailsResponse.task.priority).toBe('high');
    });

    test('Manager adds a tag to a task', async () => {
        const loginResponse = await api.login('manager', 'managerPassword');
        expect(loginResponse.status).toBe(200);

        const addTagResponse = await api.addTag(loginResponse.token, 'task123', 'urgent');
        expect(addTagResponse.status).toBe(200);

        const taskDetailsResponse = await api.getTaskDetails(loginResponse.token, 'task123');
        expect(taskDetailsResponse.status).toBe(200);
        expect(taskDetailsResponse.task.tags).toContain('urgent');
    });

    test('Employee views task priority and tags', async () => {
        const loginResponse = await api.login('worker', 'workerPassword');
        expect(loginResponse.status).toBe(200);

        const taskDetailsResponse = await api.getTaskDetails(loginResponse.token, 'task123');
        expect(taskDetailsResponse.status).toBe(200);
        expect(taskDetailsResponse.task.priority).toBe('high');
        expect(taskDetailsResponse.task.tags).toContain('urgent');
    });
});
