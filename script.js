// Wait for the DOM content to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get references to input field, add button, and task list container
    const inputTask = document.getElementById('inputTask');
    const addTaskButton = document.getElementById('addTaskButton');
    const toDoList = document.getElementById('toDoList');

    // Load tasks from localStorage or initialize with an empty array if none exist
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Event listener for the "Add Task" button
    addTaskButton.addEventListener('click', () => {
        // Trim whitespace from input value
        const taskText = inputTask.value.trim();
        if (taskText === '') return; // Do not add empty tasks

        // Create a new task object
        const newTask = {
            id: Date.now(),         // Unique ID based on current time
            text: taskText,         // Task text entered by user
            isCompleted: false      // Task starts as not completed
        };

        // Add new task to the tasks array
        tasks.push(newTask);

        // Save the updated tasks array to localStorage
        savedTasks();

        // Render the new task on the UI
        renderTask(newTask);

        // Clear the input field
        inputTask.value = '';
    });

    // Function to create and display a task in the list
    function renderTask(task) {
        // Create a new list item element
        const li = document.createElement('li');

        // Assign a custom data attribute for task ID
        li.setAttribute('data-id', task.id);

        // Add 'completed' class if the task is marked completed
        li.className = task.isCompleted ? 'completed' : '';

        // Set the inner HTML of the list item
        li.innerHTML = `
            <span>${task.text.toUpperCase()}</span>  <!-- Display task text in uppercase -->
            <button>Delete</button>                  <!-- Delete button -->
        `;

        // Toggle task completion status when the list item is clicked (but not the button)
        li.addEventListener("click", (e) => {
            if (e.target.tagName === "BUTTON") return; // Ignore if Delete button is clicked
            task.isCompleted = !task.isCompleted;      // Toggle completion
            li.classList.toggle('completed');          // Toggle class for styling
            savedTasks();                              // Save updated tasks
        });

        // Handle delete button click
        li.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();                       // Prevent toggling when deleting
            tasks = tasks.filter(t => t.id !== task.id); // Remove task from array
            li.remove();                                 // Remove from UI
            savedTasks();                                // Save updated tasks
        });

        // Append the task to the task list
        toDoList.appendChild(li);
    }

    // Function to save the tasks array to localStorage
    function savedTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Render all previously saved tasks when the page loads
    tasks.forEach(task => renderTask(task));
});
