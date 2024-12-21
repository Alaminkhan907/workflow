// Automated Tests for Workflow Management Application

// Mock database for tasks and projects
const mockProjects = [];

// Mock API setup
const api = {
    login: jest.fn(async (username, password) => {
        if (username === 'manager' && password === 'managerPassword') {
            return { status: 200, token: 'manager-token' };
        }
        return { status: 401 };
    }),
    createProject: jest.fn(async (token, project) => {
        if (token === 'manager-token') {
            if (!project.name || !project.dueDate || !project.assignee) {
                return { status: 400, message: 'Missing required fields' };
            }
            mockProjects.push(project);
            return { status: 201 };
        }
        return { status: 403 };
    }),
    getProjects: jest.fn(async (token) => {
        if (token === 'manager-token') {
            return { status: 200, projects: mockProjects };
        }
        return { status: 403 };
    }),
};

// UC2 - Manager: Create Project
// 2 tests
describe('UC2 - Manager: Create Project', () => {
    test('Manager creates a new project and assigns tasks', async () => {
        const loginResponse = await api.login('manager', 'managerPassword');
        expect(loginResponse.status).toBe(200);

        const newProject = {
            name: 'New Project',
            dueDate: '2024-12-31',
            description: 'A test project',
            status: 'pending',
            assignee: 'worker123',
        };

        const createResponse = await api.createProject(loginResponse.token, newProject);
        expect(createResponse.status).toBe(201);

        const projectsResponse = await api.getProjects(loginResponse.token);
        expect(projectsResponse.status).toBe(200);
        expect(projectsResponse.projects).toContainEqual(newProject);
    });

    test('Application handles missing information during project creation', async () => {
        const loginResponse = await api.login('manager', 'managerPassword');
        expect(loginResponse.status).toBe(200);

        const incompleteProject = {
            name: 'Incomplete Project',
            dueDate: '',
            assignee: '',
        };

        const createResponse = await api.createProject(loginResponse.token, incompleteProject);
        expect(createResponse.status).toBe(400);
        expect(createResponse.message).toBe('Missing required fields');

        const projectsResponse = await api.getProjects(loginResponse.token);
        expect(projectsResponse.projects).not.toContainEqual(incompleteProject);
    });
});
