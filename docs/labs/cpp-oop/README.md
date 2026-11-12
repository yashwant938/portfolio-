# CppOOPTopics — C++20/23 OOP Memory Internals & CppNuts Multithreading Studio

An interactive C++20/23 systems engineering and compiler memory laboratory modeled after [`CompilerCppTopics`](https://github.com/yashwant938/CompilerCppTopics), featuring a **Dual-Track Studio UI**:
- **Track 1 — Complete C++20 OOP & Low-Level Memory Engineering** (Greedy Struct Alignment, Padding Elimination, EBO, `[[no_unique_address]]`, Friend Mechanics, `this` Pointer, Value Categories `lvalue`/`prvalue`/`xvalue`, Move Semantics, Rule of 0/3/5, Operator Overloading & `<=>`, Diamond Virtual Inheritance, Vptr/Vtable & Multi-Base Thunks, Smart Pointer Control Blocks, CRTP, NVI & Pimpl).
- **Track 2 — Complete CppNuts C++20 Multithreading & Concurrency Series** (5 Ways to Create Threads, `join()` vs `detach()` vs `joinable()`, C++20 `std::jthread` & `stop_token`, Race Conditions, `std::mutex`, `try_lock()`, Variadic `std::try_lock(m1, m2)`, `std::timed_mutex`, `std::recursive_mutex`, `std::lock_guard` vs `std::unique_lock` [`defer_lock`, `try_to_lock`, `adopt_lock`] vs `std::scoped_lock`, AB-BA Deadlock & `std::lock`, `std::condition_variable` Even-Odd & Bounded Producer-Consumer, `std::future` & `std::promise`, `std::async` [`async` vs `deferred`], `std::packaged_task`, `std::call_once`, `std::shared_mutex`, `std::atomic`, C++20 Semaphores, and a Production Thread Pool).

---

## Studio Architecture

1. **Dual-Track Command Header & Filter Bar** — Filter the entire studio by `All Tracks (18)`, `Track 1: OOP & Memory (10)`, or `Track 2: CppNuts Multithreading (8)`, with one-click Dark/Light semantic theme switching.
2. **Split-Pane Concept Encyclopedia (`Slides`)** — 18 deep-dive modules with a track-grouped left navigator, ASCII memory/timeline diagrams, and Professor's Interview & Production Traps.
3. **Split-Pane C++20 Compiler Workbench (`Code Demo`)** — Categorized left file explorer (`Track 1: OOP Labs 01–08` and `Track 2: CppNuts Threading Labs 09–14`), live line-numbered code editor, and compiler diagnostics + stdout terminal.
4. **9 Interactive Visual Simulators (`Animation`)**:
   - **Track 1 (OOP & Memory Simulators 1–5):**
     1. *Greedy Struct Alignment & Padding Visualizer*
     2. *Vtable, Vptr & Multiple-Inheritance Thunk Explorer*
     3. *Value Categories (`lvalue` / `prvalue` / `xvalue`) & Move Semantics Lab*
     4. *Diamond Virtual Inheritance (`vbptr`) & Object Slicing Lab*
     5. *Smart Pointer Atomic Control Block (`strong_count` / `weak_count`) Step-Through*
   - **Track 2 (CppNuts Multithreading Simulators 6–9):**
     6. *5 Ways to Spawn Threads, `join()` / `detach()` / `~thread()` Trap & C++20 `std::jthread` Simulator*
     7. *Mutex Lock Strategies (`unique_lock` `defer_lock` / `try_to_lock` / `adopt_lock`, `recursive_mutex`) & AB-BA Deadlock vs `std::lock` Simulator*
     8. *`std::condition_variable` Bounded Producer-Consumer Ring Buffer & Even-Odd Alternating Thread Animator*
     9. *`std::promise` / `std::future`, `std::async` (`launch::async` vs `launch::deferred`) & 4-Worker Thread Pool Dispatcher*
5. **25-Question Mastery Quiz & Assessment Report (`Quiz` & `Result`)** — 15 OOP & Memory questions + 10 CppNuts Multithreading questions with detailed explanations.

---

## 10 Native C++20 Executable Labs (`cpp_labs/`)

| Target | Source File | Concepts Verified |
| :--- | :--- | :--- |
| `lab01` | `cpp_labs/lab01_alignment_and_memory.cpp` | Greedy alignment (`24B` -> `16B`), `alignof`, `offsetof`, bit-fields, EBO, `[[no_unique_address]]` |
| `lab02` | `cpp_labs/lab02_encapsulation_friends_this.cpp` | `friend` functions/classes, `this` chaining, `mutable`, ref-qualifiers (`&` vs `&&`) |
| `lab03` | `cpp_labs/lab03_lvalue_rvalue_move_rule_of_5.cpp` | `lvalue`/`prvalue`/`xvalue`, `noexcept` move ctor, Rule of 5, Copy-and-Swap, `std::forward` |
| `lab04` | `cpp_labs/lab04_inheritance_diamond_slicing.cpp` | Ctor/dtor order, Name Hiding (`using Base::fn`), Object Slicing, `: virtual public` Diamond |
| `lab05` | `cpp_labs/lab05_vtable_virtual_dispatch_rtti.cpp` | Raw `vptr`/`vtable` inspection, multi-`vptr` thunks, ctor virtual trap, `dynamic_cast` |
| `lab06` | `cpp_labs/lab06_smart_pointers_operator_overloading_idioms.cpp` | Custom `MiniSharedPtr`, `weak_ptr` cycles, `operator<=>`, functors, CRTP, NVI |
| `lab07` | `cpp_labs/lab07_threads_join_detach_5_ways.cpp` | CppNuts: 5 thread creation ways, `join()`, `detach()`, `joinable()`, `std::ref`, C++20 `std::jthread` |
| `lab08` | `cpp_labs/lab08_mutex_lock_types_deadlock.cpp` | CppNuts: Race conditions, `mutex`, `try_lock`, variadic `std::try_lock`, `timed_mutex`, `recursive_mutex`, `unique_lock` tags, AB-BA deadlock fix |
| `lab09` | `cpp_labs/lab09_condition_variable_producer_consumer.cpp` | CppNuts: `std::condition_variable` (`wait`, `notify_one`, `notify_all`), Even-Odd threads, Bounded Producer-Consumer |
| `lab10` | `cpp_labs/lab10_future_promise_async_threadpool.cpp` | CppNuts: `promise`/`future`, `std::async` (`async` vs `deferred`), `packaged_task`, `call_once`, `shared_mutex`, `atomic`, C++20 Thread Pool |

---

## Quick Start

### 1. Run the Interactive Browser Studio
```bash
npx serve .
# Or run verification tests:
node tests/verify.mjs
```

### 2. Build & Run All 10 Native C++20 Labs with CMake
```bash
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
```
