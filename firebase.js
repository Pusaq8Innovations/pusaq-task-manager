import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";


// Configuración Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDEMa7phTpEFlHSJZIvUx0jXnybXmJYOnY",
    authDomain: "pusaq-tasks.firebaseapp.com",
    projectId: "pusaq-tasks",
    storageBucket: "pusaq-tasks.firebasestorage.app",
    messagingSenderId: "29934632489",
    appId: "1:29934632489:web:ab61209240de8af47ca638"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// -------------------- AUTH (super básico, solo placeholders) --------------------

// login
async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Login exitoso:', userCredential.user.uid);
        return userCredential.user;
    } catch (error) {
        console.error('Error en login:', error.message);
        throw error;
    }
}

// logout
async function logout() {
    try {
        await signOut(auth);
        console.log('Logout exitoso');
    } catch (error) {
        console.error('Error en logout:', error.message);
        throw error;
    }
}

// register
async function register(userData) {
    const { name, email, password, password_confirmation, role } = userData;

    if (password !== password_confirmation) {
        throw new Error('Las contraseñas no coinciden.');
    }

    try {
        // Crear el usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Crear el documento en Firestore en la colección 'users'
        await setDoc(doc(db, "users", user.uid), {
            name,
            email,
            role,
            created_at: new Date(),
            updated_at: new Date()
        });

        console.log('Registro exitoso:', user.uid);
        return user;
    } catch (error) {
        console.error('Error en registro:', error.message);
        throw error;
    }
}

// -------------------- USERS --------------------

// Obtener todos los usuarios
async function getAllUsers() {
    try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        throw error;
    }
}

// Obtener un usuario por ID
async function getUser(userId) {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() };
        } else {
            console.warn('Usuario no encontrado:', userId);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener usuario:', error.message);
        throw error;
    }
}

// Actualizar usuario
async function updateUser(userId, userData) {
    try {
        const userRef = doc(db, "users", userId);

        // Agregamos actualización de fecha
        await updateDoc(userRef, {
            ...userData,
            updated_at: new Date()
        });

        console.log('Usuario actualizado:', userId);
    } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
        throw error;
    }
}

// Eliminar usuario
async function deleteUser(userId) {
    try {
        await deleteDoc(doc(db, "users", userId));
        console.log('Usuario eliminado:', userId);
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        throw error;
    }
}

// -------------------- PROJECTS --------------------

// Obtener todos los proyectos
async function getAllProjects() {
    try {
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        return projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener proyectos:', error.message);
        throw error;
    }
}

// Obtener un proyecto por ID
async function getProject(projectId) {
    try {
        const projectDoc = await getDoc(doc(db, "projects", projectId));
        if (projectDoc.exists()) {
            return { id: projectDoc.id, ...projectDoc.data() };
        } else {
            console.warn('Proyecto no encontrado:', projectId);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener proyecto:', error.message);
        throw error;
    }
}

// Crear un proyecto
async function createProject(projectData) {
    try {
        const now = new Date();
        const projectWithTimestamps = {
            ...projectData,
            created_at: now,
            updated_at: now
        };
        const docRef = await addDoc(collection(db, "projects"), projectWithTimestamps);
        console.log('Proyecto creado con ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error al crear proyecto:', error.message);
        throw error;
    }
}

// Actualizar un proyecto
async function updateProject(projectId, projectData) {
    try {
        const projectRef = doc(db, "projects", projectId);
        await updateDoc(projectRef, {
            ...projectData,
            updated_at: new Date()
        });
        console.log('Proyecto actualizado:', projectId);
    } catch (error) {
        console.error('Error al actualizar proyecto:', error.message);
        throw error;
    }
}

// Eliminar un proyecto
async function deleteProject(projectId) {
    try {
        await deleteDoc(doc(db, "projects", projectId));
        console.log('Proyecto eliminado:', projectId);
    } catch (error) {
        console.error('Error al eliminar proyecto:', error.message);
        throw error;
    }
}

// -------------------- TASKS (Subcolección en Projects) --------------------

// Obtener todas las tareas de un usuario
async function getAllTasksByUser(userId) {
    try {
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        const tasks = [];

        // Iteramos sobre cada proyecto
        for (const projectDoc of projectsSnapshot.docs) {
            const projectId = projectDoc.id;
            const tasksSnapshot = await getDocs(collection(db, "projects", projectId, "tasks"));

            // Iteramos sobre las tareas de cada proyecto
            tasksSnapshot.forEach(taskDoc => {
                const taskData = { id: taskDoc.id, ...taskDoc.data() };

                // Comprobamos si la tarea está asignada al usuario
                if (taskData.assigned_to === userId) {
                    tasks.push({ ...taskData, projectId });
                }
            });
        }

        // Si no se encuentran tareas, podemos retornar un mensaje o un arreglo vacío
        if (tasks.length === 0) {
            console.log(`No tasks found for user ${userId}`);
        }

        return tasks;
    } catch (error) {
        console.error('Error al obtener tareas por usuario:', error.message);
        throw error;
    }
}

// Obtener todas las tareas de un proyecto
async function getAllTasks(projectId) {
    try {
        const tasksSnapshot = await getDocs(collection(db, "projects", projectId, "tasks"));
        return tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener tareas:', error.message);
        throw error;
    }
}

// Obtener una tarea por ID dentro de un proyecto
async function getTask(projectId, taskId) {
    try {
        const taskDoc = await getDoc(doc(db, "projects", projectId, "tasks", taskId));
        if (taskDoc.exists()) {
            return { id: taskDoc.id, ...taskDoc.data() };
        } else {
            console.warn('Tarea no encontrada:', taskId);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener tarea:', error.message);
        throw error;
    }
}

// Crear una nueva tarea en un proyecto
async function createTask(projectId, taskData) {
    try {
        const now = new Date();
        const taskWithTimestamps = {
            ...taskData,
            created_at: now,
            updated_at: now
        };
        const docRef = await addDoc(collection(db, "projects", projectId, "tasks"), taskWithTimestamps);
        console.log('Tarea creada con ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error al crear tarea:', error.message);
        throw error;
    }
}

// Actualizar una tarea
async function updateTask(projectId, taskId, taskData) {
    try {
        const taskRef = doc(db, "projects", projectId, "tasks", taskId);
        await updateDoc(taskRef, {
            ...taskData,
            updated_at: new Date()
        });
        console.log('Tarea actualizada:', taskId);
    } catch (error) {
        console.error('Error al actualizar tarea:', error.message);
        throw error;
    }
}

// Eliminar una tarea
async function deleteTask(projectId, taskId) {
    try {
        await deleteDoc(doc(db, "projects", projectId, "tasks", taskId));
        console.log('Tarea eliminada:', taskId);
    } catch (error) {
        console.error('Error al eliminar tarea:', error.message);
        throw error;
    }
}

// -------------------- NOTES (Subcolección en Tasks) --------------------

// Obtener todas las notas de una tarea
async function getAllNotes(projectId, taskId) {
    try {
        const notesSnapshot = await getDocs(collection(db, "projects", projectId, "tasks", taskId, "notes"));
        return notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error al obtener notas:', error.message);
        throw error;
    }
}

// Obtener una nota específica
async function getNote(projectId, taskId, noteId) {
    try {
        const noteDoc = await getDoc(doc(db, "projects", projectId, "tasks", taskId, "notes", noteId));
        if (noteDoc.exists()) {
            return { id: noteDoc.id, ...noteDoc.data() };
        } else {
            console.warn('Nota no encontrada:', noteId);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener nota:', error.message);
        throw error;
    }
}

// Crear una nota en una tarea
async function createNote(projectId, taskId, noteData) {
    try {
        const now = new Date();
        const noteWithTimestamps = {
            ...noteData,
            created_at: now,
            updated_at: now
        };
        const docRef = await addDoc(collection(db, "projects", projectId, "tasks", taskId, "notes"), noteWithTimestamps);
        console.log('Nota creada con ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error al crear nota:', error.message);
        throw error;
    }
}

// Actualizar una nota
async function updateNote(projectId, taskId, noteId, noteData) {
    try {
        const noteRef = doc(db, "projects", projectId, "tasks", taskId, "notes", noteId);
        await updateDoc(noteRef, {
            ...noteData,
            updated_at: new Date()
        });
        console.log('Nota actualizada:', noteId);
    } catch (error) {
        console.error('Error al actualizar nota:', error.message);
        throw error;
    }
}

// Eliminar una nota
async function deleteNote(projectId, taskId, noteId) {
    try {
        await deleteDoc(doc(db, "projects", projectId, "tasks", taskId, "notes", noteId));
        console.log('Nota eliminada:', noteId);
    } catch (error) {
        console.error('Error al eliminar nota:', error.message);
        throw error;
    }
}


export {
    // Auth
    auth,
    login,
    logout,
    register,

    // Users
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,

    // Projects
    getAllProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,

    // Tasks
    getAllTasksByUser,
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,

    // Notes
    getAllNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,

    // Opcionalmente exportar también db si lo necesitas
    db
};

