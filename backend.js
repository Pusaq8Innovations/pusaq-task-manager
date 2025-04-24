// ========== Configuración base ==========

const API_BASE_URL = "https://tasks.pusaq8.com/public/api";

const getToken = () => localStorage.getItem("token");

const buildHeaders = (token) => ({
    "Content-Type": "application/json",
    ...(token && { "authorization": "Bearer " + token })
});

const apiCall = async (route, method = "GET", body = null, auth = true) => {
    const token = auth ? getToken() : null;
    const options = {
        method,
        headers: buildHeaders(token),
        ...(method !== "GET" && body ? { body: JSON.stringify(body) } : {})
    };

    try {
        const response = await fetch(API_BASE_URL + route, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
};

// ========== Autenticación ==========

const AuthAPI = {
    login: async (email, password) => {
        const data = await apiCall("/login", "POST", { email, password }, false);
        localStorage.setItem("token", data.token);
    
        try {
            const user = await AuthAPI.me();
    
            localStorage.setItem("user_id", user.id);
            localStorage.setItem("user_name", user.name);
            localStorage.setItem("user_email", user.email);
            localStorage.setItem("user_role", user.role);
    
            return { token: data.token, user };
        } catch (error) {
            throw new Error("No se pudo obtener la información del usuario.");
        }
    },    

    register: async (name, email, password, confirm) => {
        await apiCall("/register", "POST", {
            name,
            role: "user",
            email,
            password,
            password_confirmation: confirm
        }, false);
        return AuthAPI.login(email, password);
    },

    logout: async () => {
        await apiCall("/logout", "POST");
        localStorage.clear();
    },

    me: () => apiCall("/me")
};

// ========== Usuarios ==========

const UserAPI = {
    getAll: () => apiCall("/users")
};

// ========== Proyectos ==========

const ProjectAPI = {
    getAll: () => apiCall("/projects"),

    get: (id) => apiCall(`/project?id=${id}`),

    create: (name, description) =>
        apiCall("/addproject", "POST", { name, description }),

    update: (id, name, description) =>
        apiCall("/project", "PATCH", { id, name, description }),

    delete: (id) => apiCall(`/project?id=${id}`, "DELETE")
};

// ========== Tareas ==========

const TaskAPI = {
    getAll: () => apiCall("/tasks"),

    create: (taskData) => apiCall("/createtask", "POST", taskData),

    update: (taskData) => apiCall("/task", "PATCH", taskData),

    delete: (id) => apiCall(`/task?id=${id}`, "DELETE")
};

// ========== Notas ==========

const NoteAPI = {
    getAll: () => apiCall("/notes"),

    get: (id) => apiCall(`/note?id=${id}`),

    create: (content, projectId) => {
        const userId = localStorage.getItem("user_id");
        return apiCall("/createnote", "POST", {
            content,
            user_id: userId,
            project_id: projectId
        });
    },

    update: (id, content) =>
        apiCall("/note", "PATCH", { id, content }),

    delete: (id) =>
        apiCall(`/note?id=${id}`, "DELETE")
};
