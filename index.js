const fs = require("fs");
const path = require("path");

const tasksFilePath = path.join(__dirname, "tasks.json");

// Color codes
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
};

// Funcion para leer las tareas almacenadas en el archivo JSON y devuelve su valor
function readTasks() {
    if (fs.existsSync(tasksFilePath)) {
        const data = fs.readFileSync(tasksFilePath, "utf8");
        return JSON.parse(data);
    }
    return [];
}

// Funcion para guardar en el JSON para guardar una Tarea
function writeTasks(tasks) {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), "utf8");
}

// Funcion para generar un ID unico al agregar una nueva tarea
function getNextId(tasks) {
    //extrae todos los IDs existentes del JSON
    const ids = tasks.map((task) => task.id);
    //Math.max devuelve el mayr de los IDs existentes y le suma 1
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}

// Funcion para listar las Tareas segun el Status 
function listTasks(status) {
    //Lee toas las tareas del JSON
    const tasks = readTasks();
    let filteredTasks = tasks;

    //Filtra las Tareas segun su Estado (hecho, en-curso, tareas-pendientes)
    if (status) {
        if (status.toLowerCase() === "hecho") {
            filteredTasks = tasks.filter((task) => task.completed);
        } else if (status.toLowerCase() === "tareas-pendientes") {
            filteredTasks = tasks.filter((task) => !task.completed && !task.inProgress);
        } else if (status.toLowerCase() === "en-curso") {
            filteredTasks = tasks.filter((task) => task.inProgress);
        } else {
            //Imprime este mensaje si no hay tareas filtradas
            console.log(`${colors.red}Estado inválido. Utilice "hecho", "tareas-pendientes" o "en-curso".${colors.reset}`);
            return;
        }
    }

    if (filteredTasks.length === 0) {
        console.log(`${colors.yellow}No hay Tareas ${status}.${colors.reset}`);
    } else {
        console.log(`${colors.cyan}Listado de tareas (${status ? status : "todas"}):${colors.reset}`);
        filteredTasks.forEach((task) => {
            console.log(
                `${task.id}. ${task.description} (${task.completed ? colors.green + "hecho" : task.inProgress ? colors.yellow + "en-curso" : colors.red + "tareas-pendientes"}${colors.reset})`
            );
        });
    }
}

// Funcion para agregar una nueva tarea al JSON
function addTask(description) {
    const tasks = readTasks();
    const newTask = {
        id: getNextId(tasks),
        description: description,
        completed: false,
        inProgress: false,
    };
    //Agrega nueva tarea
    tasks.push(newTask);
    writeTasks(tasks);
    console.log(`${colors.green}Tarea guardada Exitosamente! (ID: ${newTask.id})${colors.reset}`);
}

// Funcion para actualizar la descripcion de una tarea exstente segun su ID
function updateTask(id, newDescription) {
    //lee todas las tareas del JSON
    const tasks = readTasks();
    //filtra las tareas segun el ID pasado por parametros
    const task = tasks.find((task) => task.id === parseInt(id));

    // Si existe Actualiza su descripcion
    if (task) {
        task.description = newDescription;
        writeTasks(tasks);
        console.log(`${colors.green}Tarea de ID${id} actualizda correctamente!${colors.reset}`);
    } else {
        console.log(`${colors.red}Tarea de ID ${id} no existe.${colors.reset}`);
    }
}

// Funcion para eliminar una tarea
function deleteTask(id) {
    const tasks = readTasks();
    const newTasks = tasks.filter((task) => task.id !== parseInt(id));

    if (newTasks.length < tasks.length) {
        writeTasks(newTasks);
        console.log(`${colors.green}Tarea de ID${id} eliminado correctamente!${colors.reset}`);
    } else {
        console.log(`${colors.red}tarea de ID ${id} no existe.${colors.reset}`);
    }
}

// Funcion para poner una Tarea "en-curso"
function markInProgress(id) {
    const tasks = readTasks();
    const task = tasks.find((task) => task.id === parseInt(id));

    if (task) {
        //si Hay una tarea segun su id, actualizamos sus campos 
        task.inProgress = true;
        task.completed = false;
        writeTasks(tasks);
        console.log(`${colors.yellow}Tarea de ID${id} marcada como en curso.${colors.reset}`);
    } else {
        console.log(`${colors.red}Tarea de ID ${id} no existe.${colors.reset}`);
    }
}

// Funcion para pner una tarea en  "hecho"
function markhecho(id) {
    const tasks = readTasks();
    const task = tasks.find((task) => task.id === parseInt(id));

    if (task) {
        task.completed = true;
        task.inProgress = false;
        writeTasks(tasks);
        console.log(`${colors.green}Tarea de ID${id} marcada como hecho.${colors.reset}`);
    } else {
        console.log(`${colors.red}Tarea de ID ${id} no existe.${colors.reset}`);
    }
}

// Command-line interface logic
const args = process.argv.slice(2);
if (args.includes("add")) {
    const taskDescription = args.slice(1).join(" ");
    if (!taskDescription) {
        console.log(`${colors.red}Proporcione una descripción de la tarea.${colors.reset}`);
        console.log(`${colors.yellow}Ejemplo: node index.js add "Beber agua".${colors.reset}`);
    } else {
        addTask(taskDescription);
    }
} else if (args.includes("list")) {
    const status = args[1]; // "hecho", "tareas-pendientes", "en-curso" (optional)
    listTasks(status);
} else if (args.includes("update")) {
    const id = args[1];
    const newDescription = args.slice(2).join(" ");
    if (!id || !newDescription) {
        console.log(`${colors.red}Proporcione un ID de tarea y una nueva descripción.${colors.reset}`);
        console.log(`${colors.yellow}Ejemplo: node index.js update 1 "Descripción de tarea actualizada"${colors.reset}`);
    } else {
        updateTask(id, newDescription);
    }
} else if (args.includes("delete")) {
    const id = args[1];
    if (!id) {
        console.log(`${colors.red}Proporcione un ID de tarea.${colors.reset}`);
        console.log(`${colors.yellow}Ejemplo: node index.js delete 1${colors.reset}`);
    } else {
        deleteTask(id);
    }
} else if (args.includes("mark-en-curso")) {
    const id = args[1];
    if (!id) {
        console.log(`${colors.red}Proporcione un ID de tarea.${colors.reset}`);
        console.log(`${colors.yellow}Ejemplo: node index.js mark-en-curso 1${colors.reset}`);
    } else {
        markInProgress(id);
    }
} else if (args.includes("mark-hecho")) {
    const id = args[1];
    if (!id) {
        console.log(`${colors.red}Proporcione un ID de tarea.${colors.reset}`);
        console.log(`${colors.yellow}Ejemplo: node index.js mark-hecho 1${colors.reset}`);
    } else {
        markhecho(id);
    }
} else {
    console.log(`${colors.cyan}Use: node index.js <commando> [argumentos]${colors.reset}`);
    console.log(`${colors.cyan}Comandos:${colors.reset}`);
    console.log(`${colors.yellow}  add <task description>            - Agregar una nueva tarea${colors.reset}`);
    console.log(`${colors.yellow}  list [status]                     - Listar tareas (status: hecho, tareas-pendientes, en-curso)${colors.reset}`);
    console.log(`${colors.yellow}  update <id> <new description>     - Actualizar una tarea por ID${colors.reset}`);
    console.log(`${colors.yellow}  delete <id>                       - Eliminar una tarea por ID${colors.reset}`);
    console.log(`${colors.yellow}  mark-en-curso <id>                - Marcar una tarea como en curso por ID${colors.reset}`);
    console.log(`${colors.yellow}  mark-hecho <id>                   - Marcar una tarea como hecha por ID${colors.reset}`);
}

