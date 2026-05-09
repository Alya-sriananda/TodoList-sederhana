// ═══════════════════════════════════
    // FASE 1 & 2: Variabel & Struktur Data
    // ═══════════════════════════════════
    const STORAGE_KEY = "galatcode_todos";   // const
    let todos = [];                           // let — akan berubah
    let currentFilter = "all";                // let — akan berubah

    // ═══════════════════════════════════
    // FASE 6: DOM Selection
    // ═══════════════════════════════════
    const todoInput = document.getElementById("todoInput");
    const addBtn    = document.getElementById("addBtn");
    const todoList  = document.getElementById("todoList");
    const countInfo = document.getElementById("countInfo");
    const filterBtns = document.querySelectorAll(".filters button");

    // ═══════════════════════════════════
    // FASE 8: localStorage & JSON
    // ═══════════════════════════════════
    function saveTodos() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error("Gagal simpan:", error.message);
      }
    }

    function loadTodos() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        todos = data ? JSON.parse(data) : [];
      } catch (error) {
        console.error("Gagal muat:", error.message);
        todos = [];
      }
    }

    // ═══════════════════════════════════
    // FASE 3, 4 & 5: CRUD dengan Array Method + Function
    // ═══════════════════════════════════
    function addTodo() {
      const text = todoInput.value.trim();
      
      // FASE 4: Conditional — validasi
      if (!text) return;

      // FASE 5: Arrow function di object
      todos.push({
        id: Date.now(),
        text,
        completed: false
      });

      todoInput.value = "";
      todoInput.focus();
      saveTodos();
      render();
    }

    function toggleTodo(id) {
      const todo = todos.find(t => t.id === id);   // find
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        render();
      }
    }

    function deleteTodo(id) {
      const index = todos.findIndex(t => t.id === id);  // findIndex
      if (index !== -1) {
        todos.splice(index, 1);   // splice
        saveTodos();
        render();
      }
    }

    function getFilteredTodos() {
      // FASE 4: Ternary + FASE 3: filter
      return currentFilter === "all"
        ? todos
        : currentFilter === "active"
          ? todos.filter(t => !t.completed)
          : todos.filter(t => t.completed);
    }

    // ═══════════════════════════════════
    // FASE 6, 9: Render dengan Template Literal + map + join
    // ═══════════════════════════════════
    function render() {
      const filtered = getFilteredTodos();

      // FASE 9: Template literal + map + join
      if (filtered.length === 0) {
        todoList.innerHTML = `<li class="empty">Tidak ada tugas</li>`;
      } else {
        todoList.innerHTML = filtered.map(({ id, text, completed }) => `
          <li class="${completed ? 'completed' : ''}">
            <input type="checkbox" ${completed ? 'checked' : ''} data-id="${id}">
            <span>${text}</span>
            <button class="delete-btn" data-id="${id}">❌</button>
          </li>
        `).join("");
      }

      // FASE 9: Destructuring + Template Literal
      const { length: total } = todos;
      const activeCount = todos.filter(t => !t.completed).length;
      countInfo.textContent = `${activeCount} tugas tersisa dari ${total}`;
    }

    // ═══════════════════════════════════
    // FASE 7: Event Handling
    // ═══════════════════════════════════
    
    // Click — tambah todo
    addBtn.addEventListener("click", addTodo);

    // Keypress — Enter untuk tambah
    todoInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addTodo();
    });

    // Event Delegation — toggle & hapus
    todoList.addEventListener("click", (e) => {
      const target = e.target;
      const id = Number(target.dataset.id);

      if (target.type === "checkbox") toggleTodo(id);
      if (target.classList.contains("delete-btn")) deleteTodo(id);
    });

    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        render();
      });
    });

    // ═══════════════════════════════════
    // INIT — Load data & render pertama kali
    // ═══════════════════════════════════
    loadTodos();
    render();