// Mock database for tasks and projects
const mockProjects = [];
const mockNotifications = [];
const mockComments = [];

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
    notifyTask: jest.fn(async (token, notification) => {
        if (token === 'manager-token' || token === 'worker-token') {
            mockNotifications.push(notification);
            return { status: 200 };
        }
        return { status: 403 };
    }),
    getNotifications: jest.fn(async (token) => {
        if (token === 'worker-token') {
            return { status: 200, notifications: mockNotifications };
        }
        return { status: 403 };
    }),
    addComment: jest.fn(async (token, comment) => {
        if (token === 'worker-token' || token === 'manager-token') {
            mockComments.push(comment);
            return { status: 200 };
        }
        return { status: 403 };
    }),
    getComments: jest.fn(async (token, taskId) => {
        if (token === 'worker-token' || token === 'manager-token') {
            return { status: 200, comments: mockComments.filter(comment => comment.taskId === taskId) };
        }
        return { status: 403 };
    }),
};

// UC3 - Task Notification and Communication
// 2 tests
describe('UC3 - Task Notification and Communication', () => {
    test('Employee receives notifications for new tasks and approaching deadlines', async () => {
        const loginResponse = await api.login('worker', 'workerPassword');
        expect(loginResponse.status).toBe(200);

        const notification = {
            message: 'New task assigned',
            taskId: 'task123',
            deadline: '2024-12-21',
        };
        const notifyResponse = await api.notifyTask(loginResponse.token, notification);
        expect(notifyResponse.status).toBe(200);

        const notificationsResponse = await api.getNotifications(loginResponse.token);
        expect(notificationsResponse.status).toBe(200);
        expect(notificationsResponse.notifications).toContainEqual(notification);
    });

    test('Manager and employee communicate about a task', async () => {
        const managerLogin = await api.login('manager', 'managerPassword');
        expect(managerLogin.status).toBe(200);

        const comment = {
            taskId: 'task123',
            message: 'Please clarify deadline',
            author: 'worker',
        };
        const addCommentResponse = await api.addComment(managerLogin.token, comment);
        expect(addCommentResponse.status).toBe(200);

        const commentsResponse = await api.getComments(managerLogin.token, 'task123');
        expect(commentsResponse.status).toBe(200);
        expect(commentsResponse.comments).toContainEqual(comment);
    });
});
