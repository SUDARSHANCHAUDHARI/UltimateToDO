/**
 * Advanced Todo Application Class
 * A comprehensive todo list application with advanced features including:
 * - Task management (add, edit, delete, complete)
 * - Filtering and sorting
 * - Bulk operations
 * - Search functionality
 * - Local storage persistence
 * - Theme switching
 * - Drag and drop reordering
 * - Data export
 */
class AdvancedTodoApp {
    /**
     * Constructor - Initialize the todo application
     * Sets up initial properties, DOM elements, event listeners, and loads data
     */
    constructor() {
        // Core data arrays and state variables
        this.todos = []; // Array to store all todo items
        this.currentFilter = 'all'; // Current active filter (all, active, completed, etc.)
        this.currentCategory = 'all'; // Current active category filter
        this.currentSort = 'created'; // Current sort order
        this.currentView = 'list'; // Current view mode (list or grid)
        this.searchQuery = ''; // Current search query string
        this.editingIndex = -1; // Index of todo currently being edited (-1 = none)
        this.draggedIndex = -1; // Index of todo being dragged (-1 = none)
        this.bulkSelectMode = false; // Whether bulk selection mode is active
        this.selectedTodos = new Set(); // Set of selected todo indices for bulk operations
        this.advancedOptionsVisible = false; // Whether advanced options panel is visible
        
        // Initialize the application components
        this.initializeElements(); // Cache DOM elements
        this.initializeEventListeners(); // Set up event handlers
        this.loadFromStorage(); // Load saved todos from localStorage
        this.updateDateTime(); // Set current date/time display
        this.loadTheme(); // Apply saved theme preference
        
        // Update datetime every second for live clock
        setInterval(() => this.updateDateTime(), 1000);
        
        // Check for overdue tasks every hour (3600000ms)
        setInterval(() => this.checkOverdueTasks(), 3600000);
    }

    /**
     * Initialize DOM Elements
     * Cache references to frequently used DOM elements for better performance
     */
    initializeElements() {
        // Input elements for adding and editing todos
        this.todoInput = document.getElementById('todo-input'); // Main todo input field
        this.addBtn = document.getElementById('add-btn'); // Add todo button
        this.editInput = document.getElementById('edit-input'); // Edit modal input field
        this.searchInput = document.getElementById('search-input'); // Search input field
        this.clearSearchBtn = document.getElementById('clear-search'); // Clear search button
        
        // Advanced options form elements
        this.toggleAdvancedBtn = document.getElementById('toggle-advanced'); // Toggle advanced options button
        this.advancedOptions = document.getElementById('advanced-options'); // Advanced options container
        this.prioritySelect = document.getElementById('priority-select'); // Priority dropdown
        this.categorySelect = document.getElementById('category-select'); // Category dropdown
        this.dueDateInput = document.getElementById('due-date'); // Due date picker
        this.taskNotes = document.getElementById('task-notes'); // Notes textarea
        
        // List and display elements
        this.todoList = document.getElementById('todo-list'); // Main todo list container
        this.emptyState = document.getElementById('empty-state'); // Empty state message
        this.dateTimeDisplay = document.getElementById('current-datetime'); // Current date/time display
        
        // Filter and control elements
        this.filterBtns = document.querySelectorAll('.filter-btn'); // All filter buttons
        this.categoryFilters = document.querySelectorAll('.category-filter'); // All category filter buttons
        this.sortSelect = document.getElementById('sort-select'); // Sort dropdown
        this.clearCompletedBtn = document.getElementById('clear-completed'); // Clear completed button
        this.deleteAllBtn = document.getElementById('delete-all'); // Delete all button
        this.themeToggle = document.getElementById('theme-toggle'); // Theme toggle button
        this.exportBtn = document.getElementById('export-data'); // Export data button
        
        // View control elements
        this.listViewBtn = document.getElementById('list-view'); // List view button
        this.gridViewBtn = document.getElementById('grid-view'); // Grid view button
        
        // Bulk selection elements
        this.bulkSelectBtn = document.getElementById('bulk-select'); // Bulk select toggle button
        this.bulkActions = document.getElementById('bulk-actions'); // Bulk actions container
        this.selectedCountSpan = document.getElementById('selected-count'); // Selected count display
        this.bulkCompleteBtn = document.getElementById('bulk-complete'); // Bulk complete button
        this.bulkDeleteBtn = document.getElementById('bulk-delete'); // Bulk delete button
        this.bulkHighPriorityBtn = document.getElementById('bulk-high-priority'); // Bulk high priority button
        this.cancelBulkBtn = document.getElementById('cancel-bulk'); // Cancel bulk select button
        
        // Counter elements for statistics display
        this.totalCount = document.getElementById('total-count'); // Total todos counter
        this.activeCount = document.getElementById('active-count'); // Active todos counter
        this.completedCount = document.getElementById('completed-count'); // Completed todos counter
        this.overdueCount = document.getElementById('overdue-count'); // Overdue todos counter
        
        // Modal elements for editing todos
        this.editModal = document.getElementById('edit-modal'); // Edit modal container
        this.closeModal = document.getElementById('close-modal'); // Close modal button
        this.cancelEdit = document.getElementById('cancel-edit'); // Cancel edit button
        this.saveEdit = document.getElementById('save-edit'); // Save edit button
        
        // Toast notification container
        this.toastContainer = document.getElementById('toast-container'); // Toast notifications container
    }

    /**
     * Initialize Event Listeners
     * Set up all event handlers for user interactions
     */
    initializeEventListeners() {
        // Add todo functionality
        // Click event for add button
        this.addBtn.addEventListener('click', () => this.addTodo());
        // Enter key press in todo input field
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Advanced options toggle functionality
        this.toggleAdvancedBtn.addEventListener('click', () => this.toggleAdvancedOptions());

        // Search functionality
        // Real-time search as user types
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        // Clear search button click
        this.clearSearchBtn.addEventListener('click', () => this.clearSearch());

        // Filter button event listeners
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Category filter button event listeners
        this.categoryFilters.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setCategoryFilter(e.target.dataset.category);
            });
        });

        // Sort and view control event listeners
        this.sortSelect.addEventListener('change', (e) => this.setSortOrder(e.target.value));
        this.listViewBtn.addEventListener('click', () => this.setView('list'));
        this.gridViewBtn.addEventListener('click', () => this.setView('grid'));

        // Control button event listeners
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.deleteAllBtn.addEventListener('click', () => this.deleteAll());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.exportBtn.addEventListener('click', () => this.exportData());

        // Bulk selection event listeners
        this.bulkSelectBtn.addEventListener('click', () => this.toggleBulkSelect());
        this.bulkCompleteBtn.addEventListener('click', () => this.bulkComplete());
        this.bulkDeleteBtn.addEventListener('click', () => this.bulkDelete());
        this.bulkHighPriorityBtn.addEventListener('click', () => this.bulkSetPriority('high'));
        this.cancelBulkBtn.addEventListener('click', () => this.cancelBulkSelect());

        // Modal event listeners
        this.closeModal.addEventListener('click', () => this.closeEditModal());
        this.cancelEdit.addEventListener('click', () => this.closeEditModal());
        this.saveEdit.addEventListener('click', () => this.saveEditedTodo());
        // Keyboard shortcuts in edit modal
        this.editInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveEditedTodo(); // Save on Enter
            if (e.key === 'Escape') this.closeEditModal(); // Close on Escape
        });

        // Close modal when clicking outside of it
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) this.closeEditModal();
        });

        // Drag and drop event listeners for todo list
        this.todoList.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.todoList.addEventListener('drop', (e) => this.handleDrop(e));
    }

    /**
     * Toggle Advanced Options Panel
     * Shows/hides the advanced options panel for adding todos
     */
    toggleAdvancedOptions() {
        // Toggle the visibility state
        this.advancedOptionsVisible = !this.advancedOptionsVisible;
        // Apply/remove the 'show' class to animate the panel
        this.advancedOptions.classList.toggle('show', this.advancedOptionsVisible);
        // Update button appearance to show active state
        this.toggleAdvancedBtn.classList.toggle('active', this.advancedOptionsVisible);
    }

    /**
     * Add New Todo
     * Creates a new todo item with all the specified properties
     */
    addTodo() {
        // Get and clean the input text
        const text = this.todoInput.value.trim();
        
        // Validation: Check if text is empty
        if (!text) {
            this.showToast('Please enter a task!', 'error');
            return;
        }

        // Validation: Check text length limit
        if (text.length > 200) {
            this.showToast('Task is too long! Maximum 200 characters.', 'error');
            return;
        }

        // Create new todo object with all properties
        const todo = {
            id: Date.now(), // Unique identifier using timestamp
            text: text, // Todo text content
            completed: false, // Completion status (new todos are incomplete)
            priority: this.prioritySelect.value, // Selected priority level
            category: this.categorySelect.value, // Selected category
            dueDate: this.dueDateInput.value || null, // Due date (null if not set)
            notes: this.taskNotes.value.trim() || null, // Additional notes (null if empty)
            createdAt: new Date().toISOString(), // Creation timestamp
            completedAt: null, // Completion timestamp (null for new todos)
            updatedAt: new Date().toISOString() // Last update timestamp
        };

        // Add the new todo to the array
        this.todos.push(todo);
        // Reset the form to default values
        this.clearAddForm();
        // Save updated todos to localStorage
        this.saveToStorage();
        // Re-render the todo list
        this.render();
        // Show success notification
        this.showToast('Task added successfully!', 'success');
    }

    /**
     * Clear Add Todo Form
     * Resets all form fields to their default values and hides advanced options
     */
    clearAddForm() {
        // Clear text inputs
        this.todoInput.value = '';
        this.taskNotes.value = '';
        this.dueDateInput.value = '';
        
        // Reset dropdowns to default values
        this.prioritySelect.value = 'medium';
        this.categorySelect.value = 'general';
        
        // Hide advanced options panel
        this.advancedOptionsVisible = false;
        this.advancedOptions.classList.remove('show');
        this.toggleAdvancedBtn.classList.remove('active');
    }

    /**
     * Edit Todo
     * Opens the edit modal with the selected todo's text for editing
     * @param {number} index - Index of the todo to edit
     */
    editTodo(index) {
        // Store the index of the todo being edited
        this.editingIndex = index;
        // Populate the edit input with current todo text
        this.editInput.value = this.todos[index].text;
        // Show the edit modal dialog
        this.showEditModal();
    }

    /**
     * Save Edited Todo
     * Validates and saves changes made to a todo in the edit modal
     */
    saveEditedTodo() {
        // Get and clean the edited text
        const newText = this.editInput.value.trim();
        
        // Validation: Check if text is empty
        if (!newText) {
            this.showToast('Task cannot be empty!', 'error');
            return;
        }

        // Validation: Check text length limit
        if (newText.length > 200) {
            this.showToast('Task is too long! Maximum 200 characters.', 'error');
            return;
        }

        // Update the todo with new text and timestamp
        this.todos[this.editingIndex].text = newText;
        this.todos[this.editingIndex].updatedAt = new Date().toISOString();
        // Save changes to localStorage
        this.saveToStorage();
        // Re-render the todo list
        this.render();
        // Close the edit modal
        this.closeEditModal();
        // Show success notification
        this.showToast('Task updated successfully!', 'success');
    }

    /**
     * Delete Todo
     * Animates item falling out, then removes after animation completes
     * @param {number} index - Index of the todo to delete
     */
    deleteTodo(index) {
        if (!confirm('Are you sure you want to delete this task?')) return;

        const item = this.todoList.querySelector(`.todo-item[data-index="${index}"]`);
        if (item) {
            item.classList.add('fall-out');
            item.addEventListener('animationend', () => {
                this.todos.splice(index, 1);
                this.saveToStorage();
                this.render();
                this.showToast('Task deleted!', 'success');
            }, { once: true });
        } else {
            this.todos.splice(index, 1);
            this.saveToStorage();
            this.render();
            this.showToast('Task deleted!', 'success');
        }
    }

    /**
     * Toggle Todo Completion Status
     * Marks a todo as completed or active and updates timestamps
     * @param {number} index - Index of the todo to toggle
     */
    toggleComplete(index) {
        // Toggle the completed status
        this.todos[index].completed = !this.todos[index].completed;
        // Set completion timestamp (null if marked active again)
        this.todos[index].completedAt = this.todos[index].completed ? new Date().toISOString() : null;
        // Update the last modified timestamp
        this.todos[index].updatedAt = new Date().toISOString();
        // Save changes to localStorage
        this.saveToStorage();
        // Re-render the todo list
        this.render();
        
        // Show appropriate success message
        const message = this.todos[index].completed ? 'Task completed!' : 'Task marked as active!';
        this.showToast(message, 'success');
    }

    /**
     * Handle Search Input
     * Filters todos based on search query as user types
     * @param {string} query - Search query entered by user
     */
    handleSearch(query) {
        // Store search query in lowercase for case-insensitive matching
        this.searchQuery = query.toLowerCase();
        // Show/hide clear search button based on whether there's a query
        this.clearSearchBtn.style.display = query ? 'block' : 'none';
        // Re-render filtered results
        this.render();
    }

    /**
     * Clear Search
     * Resets search input and shows all todos
     */
    clearSearch() {
        // Clear the search input field
        this.searchInput.value = '';
        // Reset search query
        this.searchQuery = '';
        // Hide the clear search button
        this.clearSearchBtn.style.display = 'none';
        // Re-render with all todos visible
        this.render();
    }

    /**
     * Set Active Filter
     * Updates the current filter for displaying todos
     * @param {string} filter - Filter type (all, active, completed, overdue, high)
     */
    setFilter(filter) {
        // Update current filter state
        this.currentFilter = filter;
        
        // Update filter button states - remove active class from all, add to selected
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Re-render with new filter applied
        this.render();
    }

    /**
     * Set Category Filter
     * Updates the current category filter for displaying todos
     * @param {string} category - Category to filter by (all, work, personal, etc.)
     */
    setCategoryFilter(category) {
        // Update current category filter state
        this.currentCategory = category;
        
        // Update category filter button states - remove active class from all, add to selected
        this.categoryFilters.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        // Re-render with new category filter applied
        this.render();
    }

    /**
     * Set Sort Order
     * Updates how todos are sorted in the list
     * @param {string} sort - Sort method (created, priority, dueDate, alphabetical, category)
     */
    setSortOrder(sort) {
        // Update current sort order
        this.currentSort = sort;
        // Re-render with new sort order applied
        this.render();
    }

    /**
     * Set View Mode
     * Switches between list and grid view modes
     * @param {string} view - View mode (list or grid)
     */
    setView(view) {
        // Update current view mode
        this.currentView = view;
        // Update view button states
        this.listViewBtn.classList.toggle('active', view === 'list');
        this.gridViewBtn.classList.toggle('active', view === 'grid');
        // Apply grid view class to todo list if needed
        this.todoList.classList.toggle('grid-view', view === 'grid');
        // Re-render with new view mode
        this.render();
    }

    /**
     * Toggle Bulk Selection Mode
     * Enables/disables bulk selection mode for multiple todo operations
     */
    toggleBulkSelect() {
        // Toggle bulk selection mode state
        this.bulkSelectMode = !this.bulkSelectMode;
        // Clear any previously selected todos
        this.selectedTodos.clear();
        // Update button appearance
        this.bulkSelectBtn.classList.toggle('active', this.bulkSelectMode);
        // Show/hide checkboxes in todo list
        this.todoList.classList.toggle('bulk-select-mode', this.bulkSelectMode);
        // Show/hide bulk actions toolbar
        this.bulkActions.classList.toggle('show', this.bulkSelectMode);
        // Update selected count display
        this.updateBulkCount();
        // Re-render to show/hide checkboxes
        this.render();
    }

    /**
     * Cancel Bulk Selection Mode
     * Exits bulk selection mode and clears selections
     */
    cancelBulkSelect() {
        // Disable bulk selection mode
        this.bulkSelectMode = false;
        // Clear all selected todos
        this.selectedTodos.clear();
        // Remove active state from bulk select button
        this.bulkSelectBtn.classList.remove('active');
        // Hide checkboxes in todo list
        this.todoList.classList.remove('bulk-select-mode');
        // Hide bulk actions toolbar
        this.bulkActions.classList.remove('show');
        // Re-render without checkboxes
        this.render();
    }

    /**
     * Toggle Todo Selection for Bulk Operations
     * Adds or removes a todo from the bulk selection set
     * @param {number} index - Index of the todo to toggle selection
     */
    toggleTodoSelection(index) {
        // Check if todo is already selected
        if (this.selectedTodos.has(index)) {
            // Remove from selection if already selected
            this.selectedTodos.delete(index);
        } else {
            // Add to selection if not selected
            this.selectedTodos.add(index);
        }
        // Update the selected count display
        this.updateBulkCount();
        // Re-render to update checkbox states
        this.render();
    }

    /**
     * Update Bulk Selection Count Display
     * Updates the text showing how many todos are selected
     */
    updateBulkCount() {
        // Update the span element with current selection count
        this.selectedCountSpan.textContent = this.selectedTodos.size;
    }

    /**
     * Bulk Complete Selected Todos
     * Marks all selected todos as completed
     */
    bulkComplete() {
        // Check if any todos are selected
        if (this.selectedTodos.size === 0) {
            this.showToast('No tasks selected!', 'warning');
            return;
        }

        // Convert selected indices to array and sort in descending order
        // (descending order prevents index shifting issues when modifying array)
        const selectedIndexes = Array.from(this.selectedTodos).sort((a, b) => b - a);
        // Mark each selected todo as completed
        selectedIndexes.forEach(index => {
            this.todos[index].completed = true;
            this.todos[index].completedAt = new Date().toISOString();
            this.todos[index].updatedAt = new Date().toISOString();
        });

        this.saveToStorage();
        this.cancelBulkSelect();
        this.render();
        this.showToast(`${selectedIndexes.length} tasks completed!`, 'success');
    }

    bulkDelete() {
        if (this.selectedTodos.size === 0) {
            this.showToast('No tasks selected!', 'warning');
            return;
        }

        if (confirm(`Are you sure you want to delete ${this.selectedTodos.size} selected task(s)?`)) {
            const selectedIndexes = Array.from(this.selectedTodos).sort((a, b) => b - a);
            selectedIndexes.forEach(index => {
                this.todos.splice(index, 1);
            });

            this.saveToStorage();
            this.cancelBulkSelect();
            this.render();
            this.showToast(`${selectedIndexes.length} tasks deleted!`, 'success');
        }
    }

    bulkSetPriority(priority) {
        if (this.selectedTodos.size === 0) {
            this.showToast('No tasks selected!', 'warning');
            return;
        }

        const selectedIndexes = Array.from(this.selectedTodos);
        selectedIndexes.forEach(index => {
            this.todos[index].priority = priority;
            this.todos[index].updatedAt = new Date().toISOString();
        });

        this.saveToStorage();
        this.cancelBulkSelect();
        this.render();
        this.showToast(`${selectedIndexes.length} tasks set to ${priority} priority!`, 'success');
    }

    clearCompleted() {
        const completedCount = this.todos.filter(todo => todo.completed).length;
        
        if (completedCount === 0) {
            this.showToast('No completed tasks to clear!', 'warning');
            return;
        }

        if (confirm(`Are you sure you want to clear ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveToStorage();
            this.render();
            this.showToast(`${completedCount} completed task(s) cleared!`, 'success');
        }
    }

    deleteAll() {
        if (this.todos.length === 0) {
            this.showToast('No tasks to delete!', 'warning');
            return;
        }

        if (confirm(`Are you sure you want to delete all ${this.todos.length} task(s)?`)) {
            this.todos = [];
            this.saveToStorage();
            this.render();
            this.showToast('All tasks deleted!', 'success');
        }
    }

    checkOverdueTasks() {
        const now = new Date();
        const overdueTasks = this.todos.filter(todo => {
            if (!todo.dueDate || todo.completed) return false;
            return new Date(todo.dueDate) < now;
        });

        if (overdueTasks.length > 0) {
            this.showToast(`You have ${overdueTasks.length} overdue task(s)!`, 'warning');
        }
    }

    handleDragStart(e, index) {
        this.draggedIndex = index;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedIndex = -1;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e) {
        e.preventDefault();
        
        const dropTarget = e.target.closest('.todo-item');
        if (!dropTarget || this.draggedIndex === -1) return;
        
        const dropIndex = parseInt(dropTarget.dataset.index);
        if (dropIndex === this.draggedIndex) return;
        
        // Reorder todos
        const draggedTodo = this.todos.splice(this.draggedIndex, 1)[0];
        this.todos.splice(dropIndex, 0, draggedTodo);
        
        this.saveToStorage();
        this.render();
        this.showToast('Tasks reordered!', 'success');
    }

    showEditModal() {
        this.editModal.classList.add('show');
        this.editInput.focus();
        this.editInput.select();
    }

    closeEditModal() {
        this.editModal.classList.remove('show');
        this.editingIndex = -1;
        this.editInput.value = '';
    }

    toggleTheme() {
        const body = document.body;
        const isLight = body.classList.contains('theme-light');
        
        body.classList.toggle('theme-light', !isLight);
        body.classList.toggle('theme-dark', isLight);
        
        // Update theme toggle icon
        const icon = this.themeToggle.querySelector('i');
        icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
        
        // Save theme preference
        localStorage.setItem('todoTheme', isLight ? 'dark' : 'light');
        
        this.showToast(`Switched to ${isLight ? 'dark' : 'light'} theme!`, 'success');
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('todoTheme') || 'dark';
        const body = document.body;
        
        body.classList.toggle('theme-light', savedTheme === 'light');
        body.classList.toggle('theme-dark', savedTheme === 'dark');
        
        const icon = this.themeToggle.querySelector('i');
        icon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }

    updateDateTime() {
        const now = new Date();
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const date = now.toLocaleDateString('en-US', dateOptions);
        const time = now.toLocaleTimeString('en-US', timeOptions);
        this.dateTimeDisplay.textContent = `${date} — ${time}`;
    }

    getFilteredTodos() {
        let filtered = [...this.todos];
        
        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(todo => 
                todo.text.toLowerCase().includes(this.searchQuery) ||
                (todo.notes && todo.notes.toLowerCase().includes(this.searchQuery)) ||
                todo.category.toLowerCase().includes(this.searchQuery)
            );
        }
        
        // Apply category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(todo => todo.category === this.currentCategory);
        }
        
        // Apply status filter
        const now = new Date();
        switch (this.currentFilter) {
            case 'active':
                filtered = filtered.filter(todo => !todo.completed);
                break;
            case 'completed':
                filtered = filtered.filter(todo => todo.completed);
                break;
            case 'overdue':
                filtered = filtered.filter(todo => {
                    if (!todo.dueDate || todo.completed) return false;
                    return new Date(todo.dueDate) < now;
                });
                break;
            case 'high':
                filtered = filtered.filter(todo => todo.priority === 'high');
                break;
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'alphabetical':
                    return a.text.localeCompare(b.text);
                case 'category':
                    return a.category.localeCompare(b.category);
                default: // 'created'
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
        
        return filtered;
    }

    updateCounters() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const active = total - completed;
        const now = new Date();
        const overdue = this.todos.filter(todo => {
            if (!todo.dueDate || todo.completed) return false;
            return new Date(todo.dueDate) < now;
        }).length;
        
        this.totalCount.textContent = total;
        this.activeCount.textContent = active;
        this.completedCount.textContent = completed;
        this.overdueCount.textContent = overdue;
    }

    render() {
        this.updateCounters();
        
        const filteredTodos = this.getFilteredTodos();
        this.todoList.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            this.emptyState.style.display = 'block';
            return;
        }
        
        this.emptyState.style.display = 'none';
        
        filteredTodos.forEach((todo, displayIndex) => {
            const originalIndex = this.todos.indexOf(todo);
            const li = this.createTodoElement(todo, originalIndex, displayIndex + 1);
            this.todoList.appendChild(li);
        });
    }

    createTodoElement(todo, index, displayNumber = null) {
        const li = document.createElement('li');
        const now = new Date();
        const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < now;
        const isHighPriority = todo.priority === 'high';
        
        li.className = `todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${isHighPriority ? 'high-priority' : ''} ${this.selectedTodos.has(index) ? 'selected' : ''}`;
        li.draggable = true;
        li.dataset.index = index;
        
        const dueDateText = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '';
        const dueDateClass = isOverdue ? 'overdue' : '';
        
        li.innerHTML = `
            <div class="todo-content">
                <div class="todo-main">
                    ${displayNumber ? `<span class="todo-number">${displayNumber}</span>` : ''}
                    ${this.bulkSelectMode ? 
                        `<input type="checkbox" class="bulk-checkbox" ${this.selectedTodos.has(index) ? 'checked' : ''}>` : 
                        ''
                    }
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <div class="todo-details">
                        <div class="todo-header">
                            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                            <span class="priority-badge priority-${todo.priority}">${todo.priority}</span>
                            <span class="category-badge">${todo.category}</span>
                        </div>
                        <div class="todo-meta">
                            ${todo.dueDate ? `<span class="todo-date ${dueDateClass}">
                                <i class="fas fa-calendar"></i>
                                Due: ${dueDateText}
                            </span>` : ''}
                            <span class="todo-date">
                                <i class="fas fa-clock"></i>
                                Created: ${new Date(todo.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        ${todo.notes ? `<div class="todo-notes">${this.escapeHtml(todo.notes)}</div>` : ''}
                    </div>
                </div>
            </div>
            <div class="todo-actions">
                <button class="todo-action edit" title="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="todo-action delete" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Event listeners for this todo item
        const checkbox = li.querySelector('.todo-checkbox');
        const bulkCheckbox = li.querySelector('.bulk-checkbox');
        const editBtn = li.querySelector('.edit');
        const deleteBtn = li.querySelector('.delete');
        const todoTextEl = li.querySelector('.todo-text');

        checkbox.addEventListener('change', () => this.toggleComplete(index));
        if (bulkCheckbox) {
            bulkCheckbox.addEventListener('change', () => this.toggleTodoSelection(index));
        }
        editBtn.addEventListener('click', () => this.editTodo(index));
        deleteBtn.addEventListener('click', () => this.deleteTodo(index));

        // Double-click on text for inline editing
        todoTextEl.addEventListener('dblclick', () => this.startInlineEdit(todoTextEl, index));
        
        // Drag and drop events
        li.addEventListener('dragstart', (e) => this.handleDragStart(e, index));
        li.addEventListener('dragend', (e) => this.handleDragEnd(e));
        
        return li;
    }

    /**
     * Inline Edit — double-click a task's text to edit it in-place.
     * Pressing Enter or blurring the element saves the change.
     * Pressing Escape cancels and restores the original text.
     */
    startInlineEdit(el, index) {
        if (this.todos[index].completed) return; // don't inline-edit completed tasks
        const original = this.todos[index].text;
        el.contentEditable = 'true';
        el.focus();

        // Move caret to end
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        const save = () => {
            el.contentEditable = 'false';
            const newText = el.textContent.trim();
            if (!newText) {
                el.textContent = original;
                this.showToast('Task cannot be empty!', 'error');
                return;
            }
            if (newText !== original) {
                this.todos[index].text = newText;
                this.todos[index].updatedAt = new Date().toISOString();
                this.saveToStorage();
                this.showToast('Task updated!', 'success');
            }
        };

        const cancel = () => {
            el.contentEditable = 'false';
            el.textContent = original;
        };

        el.addEventListener('blur', save, { once: true });
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
            if (e.key === 'Escape') {
                el.removeEventListener('blur', save);
                cancel();
            }
        });
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${this.escapeHtml(message)}</span>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    this.toastContainer.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    getToastIcon(type) {
        switch (type) {
            case 'success':
                return 'fas fa-check-circle';
            case 'error':
                return 'fas fa-exclamation-circle';
            case 'warning':
                return 'fas fa-exclamation-triangle';
            default:
                return 'fas fa-info-circle';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveToStorage() {
        try {
            localStorage.setItem('advancedTodos', JSON.stringify(this.todos));
        } catch (error) {
            this.showToast('Failed to save tasks to storage!', 'error');
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('advancedTodos');
            if (saved) {
                this.todos = JSON.parse(saved);
                
                // Validate and clean up data
                this.todos = this.todos.filter(todo => 
                    todo && typeof todo.text === 'string' && todo.text.trim()
                );
                
                // Add missing properties for backward compatibility
                this.todos = this.todos.map(todo => ({
                    id: todo.id || Date.now(),
                    text: todo.text,
                    completed: todo.completed || false,
                    priority: todo.priority || 'medium',
                    category: todo.category || 'general',
                    dueDate: todo.dueDate || null,
                    notes: todo.notes || null,
                    createdAt: todo.createdAt || new Date().toISOString(),
                    completedAt: todo.completedAt || null,
                    updatedAt: todo.updatedAt || new Date().toISOString()
                }));
                
                this.render();
            } else {
                // Add dummy data for demonstration
                this.loadDummyData();
            }
        } catch (error) {
            this.showToast('Failed to load tasks from storage!', 'error');
            this.todos = [];
            this.loadDummyData();
        }
    }

    loadDummyData() {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        this.todos = [
            {
                id: 1,
                text: "Complete project presentation for client meeting",
                completed: false,
                priority: "high",
                category: "work",
                dueDate: tomorrow.toISOString().split('T')[0],
                notes: "Include market analysis charts and financial projections. Prepare backup slides for Q&A session.",
                createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null,
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                text: "Buy groceries for the week",
                completed: false,
                priority: "medium",
                category: "shopping",
                dueDate: null,
                notes: "Don't forget: milk, bread, eggs, vegetables, and coffee beans",
                createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null,
                updatedAt: new Date().toISOString()
            },
            {
                id: 3,
                text: "Schedule annual health checkup",
                completed: false,
                priority: "high",
                category: "health",
                dueDate: nextWeek.toISOString().split('T')[0],
                notes: "Call Dr. Smith's office. Ask about vaccination updates.",
                createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null,
                updatedAt: new Date().toISOString()
            },
            {
                id: 4,
                text: "Review and update budget spreadsheet",
                completed: true,
                priority: "medium",
                category: "finance",
                dueDate: null,
                notes: "Include Q4 expenses and plan for next quarter investments",
                createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 5,
                text: "Learn React hooks and context API",
                completed: false,
                priority: "low",
                category: "learning",
                dueDate: null,
                notes: "Focus on useState, useEffect, and custom hooks. Build a small project to practice.",
                createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null,
                updatedAt: new Date().toISOString()
            },
            {
                id: 6,
                text: "Plan weekend trip to the mountains",
                completed: false,
                priority: "low",
                category: "personal",
                dueDate: null,
                notes: "Check weather forecast, book accommodation, and prepare hiking gear",
                createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null,
                updatedAt: new Date().toISOString()
            },
            {
                id: 7,
                text: "Submit tax documents to accountant",
                completed: false,
                priority: "high",
                category: "finance",
                dueDate: yesterday.toISOString().split('T')[0], // This will be overdue
                notes: "Gather all receipts, W2 forms, and investment statements",
                createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null,
                updatedAt: new Date().toISOString()
            },
            {
                id: 8,
                text: "Organize desk and file important documents",
                completed: true,
                priority: "low",
                category: "personal",
                dueDate: null,
                notes: "Sort through old papers and create a proper filing system",
                createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 9,
                text: "Attend team building workshop",
                completed: false,
                priority: "medium",
                category: "work",
                dueDate: nextWeek.toISOString().split('T')[0],
                notes: "Mandatory attendance. Location: Conference Room A, 2:00 PM",
                createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null,
                updatedAt: new Date().toISOString()
            },
            {
                id: 10,
                text: "Read 'Atomic Habits' book",
                completed: false,
                priority: "low",
                category: "learning",
                dueDate: null,
                notes: "Focus on chapters about habit stacking and environment design",
                createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null,
                updatedAt: new Date().toISOString()
            },
            {
                id: 11,
                text: "Call mom and check on her health",
                completed: false,
                priority: "high",
                category: "personal",
                dueDate: null,
                notes: "Ask about her doctor's appointment results and see if she needs anything",
                createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null,
                updatedAt: new Date().toISOString()
            },
            {
                id: 12,
                text: "Research and compare health insurance plans",
                completed: false,
                priority: "medium",
                category: "health",
                dueDate: nextWeek.toISOString().split('T')[0],
                notes: "Compare coverage, premiums, and provider networks. Open enrollment ends soon.",
                createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null,
                updatedAt: new Date().toISOString()
            },
            {
                id: 13,
                text: "Clean and organize garage",
                completed: false,
                priority: "low",
                category: "personal",
                dueDate: null,
                notes: "Donate old items, organize tools, and create storage system",
                createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null,
                updatedAt: new Date().toISOString()
            },
            {
                id: 14,
                text: "Update LinkedIn profile and resume",
                completed: false,
                priority: "medium",
                category: "work",
                dueDate: null,
                notes: "Add recent projects, update skills section, and get recommendations",
                createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: null,
                updatedAt: new Date().toISOString()
            },
            {
                id: 15,
                text: "Set up automatic bill payments",
                completed: true,
                priority: "medium",
                category: "finance",
                dueDate: null,
                notes: "Set up for utilities, internet, and insurance payments",
                createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        this.saveToStorage();
        this.render();
        this.showToast('Demo data loaded! Try scrolling through the tasks.', 'success');
    }

    exportData() {
        const data = {
            todos: this.todos,
            exportDate: new Date().toISOString(),
            version: '2.0',
            stats: {
                total: this.todos.length,
                completed: this.todos.filter(t => t.completed).length,
                active: this.todos.filter(t => !t.completed).length,
                overdue: this.todos.filter(t => {
                    if (!t.dueDate || t.completed) return false;
                    return new Date(t.dueDate) < new Date();
                }).length
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `advanced-todo-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Data exported successfully!', 'success');
    }

    // Keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter: Add new todo
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.addTodo();
        }
        
        // Ctrl/Cmd + F: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            this.searchInput.focus();
        }
        
        // Ctrl/Cmd + D: Delete all
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            this.deleteAll();
        }
        
        // Ctrl/Cmd + T: Toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            this.toggleTheme();
        }
        
        // Ctrl/Cmd + B: Toggle bulk select
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            this.toggleBulkSelect();
        }
        
        // Escape: Close modal or cancel bulk select
        if (e.key === 'Escape') {
            if (this.bulkSelectMode) {
                this.cancelBulkSelect();
            } else {
                this.closeEditModal();
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new AdvancedTodoApp();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => app.handleKeyboardShortcuts(e));
    
    // Make app globally accessible for debugging
    window.advancedTodoApp = app;
    
    console.log('Advanced Todo App loaded successfully!');
}); 