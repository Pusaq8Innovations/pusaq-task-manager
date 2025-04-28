//schema
const userSchema = {
    name: "string",
    email: "string",
    password: "string",
    role: "string",
    password_confirmation: "string"
}

const projectSchema = {
    name: "string",
    description: "string",
    created_at: "date",
    updated_at: "date"
}

const taskSchema = {
    name: "string",
    description: "string",
    project_id: "string",
    user_id: "string",
    status: "string",
    progress: "number",
    created_at: "date",
    updated_at: "date"
}

const noteSchema = {
    name: "string",
    description: "string",
    task_id: "string",
    user_id: "string",
    created_at: "date",
    updated_at: "date"
}

