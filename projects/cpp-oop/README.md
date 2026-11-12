# CppOOPTopics — C++ OOP & Compiler Memory Internals Lab

An interactive C++20/23 Object-Oriented Programming and Systems Memory Learning Workspace modeled directly after [`CompilerCppTopics`](https://github.com/yashwant938/CompilerCppTopics).

It combines a **browser-based interactive learning platform** (`Landing`, `Slides`, `Code Demo` Compiler Workbench, `Animation` Memory & Vtable Lab, `Quiz`, and `Result`) with **6 native, self-contained C++20 source labs** (`cpp_labs/`).

---

## Complete Topic Coverage (Zero Details Missed)

| Module | Native C++20 Lab & Workbench Demo | Core Concepts Covered |
| :--- | :--- | :--- |
| **01 · Greedy Alignment & Memory Layout** | [`lab01_alignment_and_memory.cpp`](./cpp_labs/lab01_alignment_and_memory.cpp) | CPU word alignment boundaries, greedy largest-to-smallest struct ordering (`24B -> 16B`), bit-fields, `sizeof(Empty) == 1` identity rule, Empty Base Optimization (EBO), `[[no_unique_address]]` (C++20), `alignas(64)` false-sharing prevention. |
| **02 · Encapsulation, `friend` & `this`** | [`lab02_encapsulation_friends_this.cpp`](./cpp_labs/lab02_encapsulation_friends_this.cpp) | `public`/`protected`/`private`, `struct` vs `class`, non-transitive/non-inherited/non-reciprocal `friend` functions & classes, hidden `this` pointer, `const` & `mutable`, `inline static` members, ref-qualifiers (`const &` vs `&&`). |
| **03 · Value Categories, Move & Rule of 5** | [`lab03_lvalue_rvalue_move_rule_of_5.cpp`](./cpp_labs/lab03_lvalue_rvalue_move_rule_of_5.cpp) | `lvalue`, `prvalue`, `xvalue`, `glvalue`, `rvalue` taxonomy (`decltype((expr))` detector), why string literals are `lvalues`, `std::move` as `static_cast<T&&>`, Rule of 0/3/5, `noexcept` move constructors in `std::vector` reallocation, Copy-and-Swap, reference collapsing & `std::forward`. |
| **04 · Inheritance, Slicing & Diamond Base** | [`lab04_inheritance_diamond_slicing.cpp`](./cpp_labs/lab04_inheritance_diamond_slicing.cpp) | `public` (Is-A), `protected`, and `private` inheritance matrix, constructor/destructor execution order, Name Hiding (`using Base::fn`), Object Slicing (by-value vs by-reference), and **The Diamond Problem** solved with `: virtual public` (`vbptr` & most-derived constructor rule). |
| **05 · Vtable, Vptr, Traps & RTTI** | [`lab05_vtable_virtual_dispatch_rtti.cpp`](./cpp_labs/lab05_vtable_virtual_dispatch_rtti.cpp) | `vptr` (Heap/Stack) and `vtable` (`.rodata`) layout, why base destructors must be `virtual`, pure virtual functions with a shared body, calling virtual functions inside constructors/destructors trap, static binding of default arguments on virtual functions, Multiple Inheritance dual-`vptr` and `this`-pointer thunk adjustments, covariant return types, `override`/`final`, and RTTI (`dynamic_cast` & `typeid`). |
| **06 · Smart Pointers, `<=>` & Idioms** | [`lab06_smart_pointers_operator_overloading_idioms.cpp`](./cpp_labs/lab06_smart_pointers_operator_overloading_idioms.cpp) | Custom `MiniSharedPtr<T>` with atomic Control Block, `std::make_shared` single allocation vs `new`, breaking cyclic leaks with `std::weak_ptr`, `std::unique_ptr` zero-overhead EBO deleters, C++20 Spaceship Operator `<=>`, prefix vs postfix `++`, Functors `operator()`, CRTP static polymorphism, and NVI (Non-Virtual Interface) pattern with private virtual hooks. |

---

## Interactive Web Workspace Views

1. **Landing:** Full 10-module curriculum overview and quick navigation.
2. **Slides:** 10 step-by-step concept slides with memory diagrams and production/interview traps.
3. **Code Demo (`Advanced Code Demo Lab`):** Compiler Workbench with 8 selectable C++20 demos, editable code area, live Wandbox C++20 execution (with deterministic verified C++20 output fallback), and separated compiler diagnostics vs. stdout terminal.
4. **Animation (`Interactive Memory & Vtable Lab`):**
   - **Lab 1:** Interactive Greedy Struct Alignment & Byte-by-Byte Padding Calculator
   - **Lab 2:** Vtable, Vptr, Constructor Trap & Multi-Base `this` Pointer Thunk Simulator
   - **Lab 3:** Lvalue / Prvalue / Xvalue Expression Inspector & Move Lab
   - **Lab 4:** Diamond Virtual Inheritance (`: virtual public`) & Object Slicing Comparator
   - **Lab 5:** Smart Pointer Atomic Control Block (`strong_count` / `weak_count`) Step-Through
5. **Quiz & Result:** 15-question systems & OOP assessment with full compiler explanations.

---

## Quick Start

### 1. Run the Web Application
Open `index.html` directly in any browser, or serve locally:
```bash
npx serve .
```

### 2. Compile & Run the Native C++20 Labs
Using `clang++` or `g++`:
```bash
clang++ -std=c++20 -O2 cpp_labs/lab01_alignment_and_memory.cpp -o build/lab01 && ./build/lab01
clang++ -std=c++20 -O2 cpp_labs/lab02_encapsulation_friends_this.cpp -o build/lab02 && ./build/lab02
clang++ -std=c++20 -O2 cpp_labs/lab03_lvalue_rvalue_move_rule_of_5.cpp -o build/lab03 && ./build/lab03
clang++ -std=c++20 -O2 cpp_labs/lab04_inheritance_diamond_slicing.cpp -o build/lab04 && ./build/lab04
clang++ -std=c++20 -O2 cpp_labs/lab05_vtable_virtual_dispatch_rtti.cpp -o build/lab05 && ./build/lab05
clang++ -std=c++20 -O2 cpp_labs/lab06_smart_pointers_operator_overloading_idioms.cpp -o build/lab06 && ./build/lab06
```

### 3. Run Verification Suite
```bash
node tests/verify.mjs
```
