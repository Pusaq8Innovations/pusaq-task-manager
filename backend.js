const baseurl = "https://tasks.pusaq8.com/public/api";

//public api

function login() {
    const route = baseurl + "/login";
    const headers = {
        "Content-Type": "application/json",
    };

    const body = {
        "email": document.getElementById("email").value,
        "password": document.getElementById("password").value
    }

    fetch(route, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("Login failed");
            }
        })
        .then(data => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user_id", data.user.id);
            localStorage.setItem("user_name", data.user.name);
            localStorage.setItem("user_email", data.user.email);
            window.location.href = "index.html";
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Login failed. Please check your credentials.");
        });
}

function register() {
    const route = baseurl + "/register";
    const headers = {
        "Content-Type": "application/json",
    };

    const body = {
        "name": document.getElementById("name").value,
        "role": 'user',
        "email": document.getElementById("email").value,
        "password": document.getElementById("password").value,
        "password_confirmation": document.getElementById("password_confirmation").value
    }

    fetch(route, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("Registration failed");
            }
        })
        .then(data => {
            login();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Registration failed. Please check your input.");
        });

}

//authenticated api

function logout() {
    const route = baseurl + "/logout";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
    

}

function getuserinfo() {
    const route = baseurl + "/user";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }

}

function getprojects() {
    const route = baseurl + "/projects";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }

}

function gettasks() {
    const route = baseurl + "/tasks";

    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
}

function getnotes() {
    const route = baseurl + "/notes";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
}

function getnote(id) {
    const route = baseurl + "/note?id=" + id;
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }

}

function createnote() {
    const route = baseurl + "/createnote";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }

    const body = {
        "content": document.getElementById("content").value,
        "user_id": localStorage.getItem("user_id"),
        "project_id": document.getElementById("project_id").value,
    }

}

function updatenote() {
    const route = baseurl + "/note";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }


}

function deletenote() {
    const route = baseurl + "/note?id=" + id;
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    }

}

// admin api

function getproject(id) {

}

function createproject() {

}

function updateproject() {

}

function deleteproject() {

}

function gettask(id) {

}

function createtask() {

}

function updatetask() {

}

function deletetask() {

}