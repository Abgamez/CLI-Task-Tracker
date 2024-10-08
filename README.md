# CLI-Task-Tracker

Solución de ejemplo para el desafío [gestor de tareas](https://roadmap.sh/projects/task-tracker) de [roadmap.sh](https://roadmap.sh/).

Esta es una aplicación de interfaz de línea de comandos (CLI) sencilla para administrar tareas.

## Características

- Agregar nuevas tareas con un ID único y almacenarlas en formato `JSON`.
- Listar tareas según su estado: `pendientes`, `en progreso` o `completadas`.  
- Actualizar la descripción de una tarea existente.
- Eliminar tareas por su ID.
- Marcar tareas como `en progreso` o `completadas`.

## Prerrequisitos

- Node.js instalado en el sistema.

## Instalación

**Clonar el repositorio**

   ```bash
   git clone --depth=1 https://github.com/Abgamez/CLI-Task-Tracker.git

   # Navegar al directorio del proyecto
   cd CLI-Task-Tracker
   ```

## Uso

- **Agregar una tarea**
```bash
node index.js add "Estudiar con Roadmaps"
```

- **Listar todas las tareas**
```bash 
node index.js list
```

- **Actualizar una tarea**
```bash
node index.js update 1 "Tomar un café y hacer codificación"
```

- **Eliminar una tarea** 
```bash
node index.js delete 1
```

- **Marcar estado de tarea**
```bash
node index.js mark-en-curso 1

node index.js mark-hecho 1
```

