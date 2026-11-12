// ============================================================================
// CppOOPTopics — Complete Dataset: 18 Concept Slides, 14 Live C++20 Demos, 25 Quiz Items
// Track 1: Complete C++20 OOP & Low-Level Memory Engineering
// Track 2: Complete CppNuts C++20 Multithreading & Concurrency Series
// ============================================================================

window.CPP_OOP_DATA = {
  topicsOverview: [
    {
      id: "alignment",
      badge: "01 · MEMORY LAYOUT",
      title: "Greedy Alignment, Padding & EBO",
      summary: "Natural CPU alignment boundaries, greedy largest-to-smallest struct packing, bit-fields, Empty Class (1B rule), Empty Base Optimization (EBO), and C++20 [[no_unique_address]].",
      metrics: ["sizeof / alignof", "Greedy Packing", "EBO & Bit-fields"]
    },
    {
      id: "encapsulation",
      badge: "02 · ACCESS & FRIENDS",
      title: "Encapsulation, Friend & `this` Pointer",
      summary: "Access specifiers (public/protected/private), non-transitive/non-inherited friend functions & classes, hidden `this` pointer, `const` & `mutable`, and ref-qualifiers (& vs &&).",
      metrics: ["friend Class/Fn", "mutable & const", "Ref-Qualifiers"]
    },
    {
      id: "lifecycle",
      badge: "03 · OBJECT LIFECYCLE",
      title: "Constructors, Initializer Lists & RAII",
      summary: "Default, explicit, delegating, and copy constructors; declaration-order initialization trap; deterministic stack unwinding (RAII); deep vs shallow copy.",
      metrics: ["explicit Ctor", "Init-Order Trap", "RAII Guarantees"]
    },
    {
      id: "value_categories",
      badge: "04 · VALUE CATEGORIES",
      title: "lvalue, prvalue, xvalue & Move Semantics",
      summary: "Complete C++11/17 value taxonomy (glvalue/rvalue), std::move as static_cast<T&&>, noexcept move constructors in std::vector resize, reference collapsing, and std::forward.",
      metrics: ["lvalue / xvalue / prvalue", "noexcept Move", "std::forward"]
    },
    {
      id: "rule_of_5",
      badge: "05 · OWNERSHIP RULES",
      title: "Rule of 0 / 3 / 5 & Copy-and-Swap",
      summary: "When to write zero custom special members vs all five (Dtor, Copy Ctor, Move Ctor, Copy Assign, Move Assign) and exception-safe Copy-and-Swap unification.",
      metrics: ["Rule of 0 / 3 / 5", "Copy-and-Swap", "RVO / Copy Elision"]
    },
    {
      id: "operators",
      badge: "06 · OPERATOR OVERLOADING",
      title: "Operator Overloading & Spaceship (<=>)",
      summary: "Member vs friend operators, C++20 three-way comparison (<=>), prefix vs postfix ++, subscript [], functors operator(), and explicit conversion operators.",
      metrics: ["operator<=>", "Functors ()", "Friend << / >>"]
    },
    {
      id: "inheritance",
      badge: "07 · INHERITANCE & SLICING",
      title: "Inheritance Modes, Slicing & Diamond Base",
      summary: "Public/protected/private inheritance matrix, Base->Derived ctor & reverse dtor order, Name Hiding (using Base::fn), Object Slicing, and `: virtual public` Diamond resolution.",
      metrics: ["Virtual Base vbptr", "Object Slicing", "Name Hiding"]
    },
    {
      id: "vtable",
      badge: "08 · VTABLE & DISPATCH",
      title: "Virtual Functions, Vptr, Vtable & RTTI",
      summary: "How vptr & vtable work in .rodata and Heap, multiple inheritance multi-vptr `this` thunks, virtual destructors, pure virtual with body, ctor virtual trap, and dynamic_cast.",
      metrics: ["vptr & vtable", "Virtual Dtor", "Multi-vptr Thunks"]
    },
    {
      id: "smart_pointers",
      badge: "09 · SMART POINTERS",
      title: "unique_ptr, shared_ptr & weak_ptr Internals",
      summary: "Zero-overhead unique_ptr with EBO deleters, shared_ptr 16-byte layout + atomic Control Block, make_shared single allocation, weak_ptr cycle breaking, enable_shared_from_this.",
      metrics: ["Control Block", "std::weak_ptr", "Custom Deleters"]
    },
    {
      id: "idioms",
      badge: "10 · ADVANCED OOP IDIOMS",
      title: "CRTP, Deducing `this`, NVI & Pimpl",
      summary: "Static polymorphism via CRTP and C++23 explicit object parameters, Non-Virtual Interface (private virtual hooks), Pimpl ABI firewall, and Type Erasure.",
      metrics: ["CRTP / C++23 this", "NVI Pattern", "Pimpl Firewall"]
    },
    {
      id: "threads_5_ways",
      track: "threading",
      badge: "11 · CPPNUTS THREADS & JTHREAD",
      title: "5 Ways to Create Threads, join/detach & jthread",
      summary: "Function pointers, lambdas, functors, non-static & static member functions, join() vs detach() vs joinable(), std::ref(), and C++20 std::jthread with stop_token.",
      metrics: ["5 Callable Types", "join() / detach()", "C++20 std::jthread"]
    },
    {
      id: "mutex_try_lock",
      track: "threading",
      badge: "12 · MUTEX & VARIADIC TRY_LOCK",
      title: "Race Conditions, std::mutex & std::try_lock",
      summary: "Why ++counter is a 3-instruction Read-Modify-Write data race, blocking lock() vs non-blocking try_lock(), and variadic std::try_lock(m1, m2, ..., mn) rollback.",
      metrics: ["Critical Section", "mtx.try_lock()", "std::try_lock(m1,m2)"]
    },
    {
      id: "timed_recursive_mutex",
      track: "threading",
      badge: "13 · TIMED & RECURSIVE MUTEX",
      title: "std::timed_mutex & std::recursive_mutex",
      summary: "Timeout-bounded locking via try_lock_for() and try_lock_until(), self-deadlock on standard mutexes, and re-entrant recursion depth counting with recursive_mutex.",
      metrics: ["try_lock_for()", "try_lock_until()", "recursive_mutex"]
    },
    {
      id: "lock_guard_unique_lock",
      track: "threading",
      badge: "14 · LOCK_GUARD VS UNIQUE_LOCK",
      title: "lock_guard, unique_lock Tags & scoped_lock",
      summary: "RAII lock wrappers compared: zero-overhead lock_guard vs movable unique_lock with defer_lock, try_to_lock, and adopt_lock strategies, plus C++17 scoped_lock.",
      metrics: ["defer_lock", "try_to_lock / adopt", "std::scoped_lock"]
    },
    {
      id: "deadlock_std_lock",
      track: "threading",
      badge: "15 · DEADLOCK & STD::LOCK",
      title: "AB-BA Deadlock & Atomic Multi-Locking",
      summary: "Coffman deadlock conditions, circular wait between two threads locking (A,B) vs (B,A), and try-and-back-off deadlock avoidance via std::lock(m1, m2).",
      metrics: ["AB-BA Deadlock", "std::lock(l1, l2)", "Lock Hierarchy"]
    },
    {
      id: "condition_variable_cv",
      track: "threading",
      badge: "16 · CONDITION VARIABLES",
      title: "condition_variable, Even-Odd & Producer-Consumer",
      summary: "Sleep/notify synchronization via wait(ul, predicate), OS spurious wakeup protection, CppNuts Even-Odd alternating threads, and Bounded Producer-Consumer rings.",
      metrics: ["wait(ul, pred)", "Even-Odd Handoff", "Producer-Consumer"]
    },
    {
      id: "future_promise_async",
      track: "threading",
      badge: "17 · FUTURE, PROMISE & ASYNC",
      title: "std::future, std::promise & std::async",
      summary: "Single-use shared-state channels between producer and consumer threads, std::shared_future, std::launch::async vs std::launch::deferred, and std::packaged_task.",
      metrics: ["promise / future", "async vs deferred", "packaged_task"]
    },
    {
      id: "atomics_thread_pool",
      track: "threading",
      badge: "18 · ATOMICS & THREAD POOL",
      title: "std::atomic, shared_mutex, call_once & Thread Pool",
      summary: "Hardware lock-free atomics and CAS loops, reader-writer std::shared_mutex, thread-safe lazy init with std::call_once, C++20 semaphores, and a production Thread Pool.",
      metrics: ["std::atomic CAS", "shared_mutex / call_once", "C++20 Thread Pool"]
    },
    {
      id: "stl_vector_memory",
      track: "stl",
      badge: "19 · STL VECTOR & CAPACITY",
      title: "std::vector Contiguous Buffer, 2x Growth & Invalidation",
      summary: "3-pointer header (begin, end, capacity_end), geometric 2x reallocation, noexcept move vs copy fallback, reserve() vs resize(), and iterator/pointer invalidation rules.",
      metrics: ["24-Byte Header", "2x Reallocation", "Iterator Invalidation"]
    },
    {
      id: "stl_unordered_map_buckets",
      track: "stl",
      badge: "20 · STL UNORDERED_MAP & HASH",
      title: "std::unordered_map Hash Buckets, Load Factor & Rehash",
      summary: "Bucket array of singly-linked nodes, hash(key) % bucket_count, max_load_factor() = 1.0 threshold, O(1) average vs O(N) collision chains, and custom struct hash functors.",
      metrics: ["Hash Bucket Chains", "Load Factor & Rehash", "Custom std::hash"]
    },
    {
      id: "stl_map_priority_queue",
      track: "stl",
      badge: "21 · STL MAP (RB-TREE) & HEAP",
      title: "std::map Red-Black Tree vs std::priority_queue Binary Heap",
      summary: "Balanced O(log N) Red-Black Tree nodes with parent/left/right pointers and lower_bound() range queries vs cache-friendly array-backed Binary Max/Min Heaps.",
      metrics: ["Red-Black Tree O(log N)", "lower_bound()", "Binary Max/Min Heap"]
    },
    {
      id: "stl_deque_span_ranges",
      track: "stl",
      badge: "22 · STL DEQUE, SPAN & RANGES",
      title: "std::deque Segmented Blocks, C++20 std::span & Ranges",
      summary: "How std::deque achieves O(1) push_front and push_back via a central map of fixed-size chunks without invalidating element references, plus C++20 non-owning std::span.",
      metrics: ["Segmented Chunk Map", "C++20 std::span<T>", "std::views Pipelines"]
    }
  ],

  slides: [
    {
      id: 1,
      tag: "MODULE 01 · MEMORY & ALIGNMENT",
      title: "Greedy Alignment, Struct Padding, Bit-Fields & EBO",
      subtitle: "Why member declaration order changes sizeof(T), and how empty classes achieve 0-byte overhead.",
      bullets: [
        "Empty Class Rule: An empty struct (`struct Empty {};`) has `sizeof == 1` so two distinct instances in an array have unique memory addresses.",
        "Natural Alignment: A k-byte primitive (`int32_t` = 4B, `double` = 8B) must reside at a memory address divisible by k. The struct's total `sizeof` is padded to a multiple of its largest member's `alignof`.",
        "Greedy Alignment Strategy: Ordering data members from largest alignment (8B pointers/doubles) down to smallest (1B chars/bools) minimizes internal padding Holes.",
        "Empty Base Optimization (EBO) & `[[no_unique_address]]`: A stateless base class or a C++20 `[[no_unique_address]]` member shares its address with adjacent members, reducing its footprint from 1+padding bytes to 0 bytes (how `std::unique_ptr` stays 8 bytes!)."
      ],
      diagram: `POOR ORDERING (sizeof = 24B, alignof = 8B)       GREEDY ORDERING (sizeof = 16B, alignof = 8B)
+----+--------------------+------------------+    +---------------------------------------+
| a  |  7 Bytes Padding   |    double b      |    |               double b                |
| 1B |  (Wasted Memory)   |     8 Bytes      |    |               8 Bytes                 |
+----+--------------------+------------------+    +-------------------+----+----+---------+
|   int32 c    | d  |    3 Bytes Padding     |    |     int32 c       | a  | d  | 2B Pad  |
|   4 Bytes    | 1B |    (Tail Alignment)    |    |     4 Bytes       | 1B | 1B | (Tail)  |
+--------------+----+------------------------+    +-------------------+----+----+---------+`,
      trap: "TRAP: Never use `#pragma pack(1)` indiscriminately on performance-critical structs—unaligned memory accesses cause severe CPU penalties or hardware faults (SIGBUS) on strict architectures!"
    },
    {
      id: 2,
      tag: "MODULE 02 · ENCAPSULATION & FRIENDS",
      title: "Encapsulation, `friend` Mechanics, `this`, `mutable` & Ref-Qualifiers",
      subtitle: "Enforcing class invariants while granting surgical access to external operators and inspectors.",
      bullets: [
        "`struct` vs `class`: Literally identical in C++ except default member access and default inheritance are `public` for `struct` and `private` for `class`.",
        "`friend` Functions & Classes: A `friend` declaration grants access to `private` and `protected` members. Friendship is NOT inherited, NOT transitive (friend of a friend is not a friend), and NOT reciprocal.",
        "Hidden `this` Pointer & `const` / `mutable`: Every non-static member function receives `ClassName* const this` (or `const ClassName* const this` for `const` methods). Marking a member `mutable` allows modifying it inside a `const` method (ideal for `std::mutex` or caches).",
        "Member Ref-Qualifiers (`&` vs `&&`): Overloading `data() const &` (called on lvalues) vs `data() &&` (called on rvalues) lets you move internal buffers out of temporary objects safely."
      ],
      diagram: `Friendship Rules Matrix:
  Class A declares \`friend class B;\`   --->  B can access A::private_data  (YES)
  Does A access B::private_data?       --->  NO (Not Reciprocal)
  Class C inherits from B              --->  Can C access A::private_data? (NO - Not Inherited)
  B declares \`friend class D;\`         --->  Can D access A::private_data? (NO - Not Transitive)`,
      trap: "TRAP: `static` member functions do NOT have a `this` pointer, cannot be `const`, and cannot be `virtual`!"
    },
    {
      id: 3,
      tag: "MODULE 03 · CONSTRUCTORS & RAII",
      title: "Constructors, Initializer Lists, `explicit` & Deterministic RAII",
      subtitle: "How objects are born, initialized in memory order, and deterministically destroyed.",
      bullets: [
        "Member Initializer List Order: Members are ALWAYS initialized in the exact order they are declared inside the class body—NEVER the order written in the constructor's `: b_(x), a_(b_)` initializer list!",
        "Why Prefer Initializer Lists? Assigning inside `{ a_ = x; }` default-constructs `a_` first and then calls `operator=`. Initializer lists `: a_(x)` construct `a_` directly in one step (and are mandatory for `const` and reference `&` members).",
        "`explicit` Keyword: Prevents accidental implicit conversions (`void take(Buffer b); take(100);` fails to compile if `explicit Buffer(size_t)` is used).",
        "RAII (Resource Acquisition Is Initialization): Heap memory, file descriptors, sockets, and mutex locks are acquired in the constructor and released unconditionally in the destructor during stack unwinding."
      ],
      diagram: `class BadOrder {
    int first_;    // Declared 1st -> Initialized 1st (with garbage from uninitialized second_!)
    int second_;   // Declared 2nd -> Initialized 2nd
public:
    BadOrder(int val) : second_(val), first_(second_ * 2) {} // BUG: first_ reads garbage!
};`,
      trap: "TRAP: Never throw an exception out of a Destructor! During stack unwinding from another exception, a throwing destructor immediately calls `std::terminate()`. Destructors are implicitly `noexcept` since C++11."
    },
    {
      id: 4,
      tag: "MODULE 04 · VALUE CATEGORIES & MOVE",
      title: "Value Categories (`lvalue`, `prvalue`, `xvalue`) & Move Semantics",
      subtitle: "Understanding identity vs movability, `std::move`, `noexcept` vector growth, and `std::forward`.",
      bullets: [
        "Value Taxonomy: `glvalue` (has identity: `lvalue` + `xvalue`) vs `rvalue` (can be moved from: `prvalue` + `xvalue`). Note: String literals like `\"hello\"` are `lvalues` because they live at a fixed address in `.rodata`!",
        "`std::move(x)` Does NOT Move Anything: It is a zero-cost compile-time cast `static_cast<remove_reference_t<T>&&>(x)` that turns an `lvalue` into an `xvalue` so the Move Constructor is selected by overload resolution.",
        "Why Move Constructors MUST be `noexcept`: When `std::vector` reallocates its buffer, it only moves elements if `MoveCtor` is `noexcept` (`std::is_nothrow_move_constructible`). Otherwise, it falls back to deep copying to preserve the Strong Exception Guarantee!",
        "Reference Collapsing & `std::forward<T>`: In `template<class T> void f(T&& arg)`, `arg` itself is an lvalue because it has a name. `std::forward<T>(arg)` preserves the caller's original lvalue/rvalue category."
      ],
      diagram: `                  Expression
                 /          \\
        glvalue (Identity)   rvalue (Movable)
           /          \\       /          \\
       lvalue          xvalue          prvalue
   (var, *ptr,      (std::move(x),   (42, x + y,
    ++x, "str")      a.member_rval)   x++, T{})`,
      trap: "TRAP: Moving from a `const` object (`const std::string s; auto s2 = std::move(s);`) silently calls the **Copy Constructor** because `const std::string&&` cannot bind to `string(string&&)`!"
    },
    {
      id: 5,
      tag: "MODULE 05 · RULE OF 0 / 3 / 5",
      title: "The Rule of 0 / 3 / 5, Copy-and-Swap & Copy Elision (RVO)",
      subtitle: "Managing raw resources cleanly without leaks, double-frees, or self-assignment bugs.",
      bullets: [
        "Rule of 0: Classes that compose RAII members (`std::vector`, `std::string`, `std::unique_ptr`) should declare ZERO custom destructors, copy, or move functions.",
        "Rule of 5: If a class defines a custom Destructor (e.g., owns `new T[]`), compiler generation of Move operations is suppressed! You must explicitly define or `=delete`: (1) Destructor, (2) Copy Ctor, (3) Move Ctor (`noexcept`), (4) Copy Assign, (5) Move Assign (`noexcept`).",
        "Copy-and-Swap Idiom: Implementing `T& operator=(T other) noexcept { swap(*this, other); return *this; }` handles both copy-assignment and move-assignment, guarantees strong exception safety, and eliminates self-assignment (`a = a`) bugs.",
        "Mandatory Copy Elision (C++17): Returning a temporary `return Matrix(r, c);` (URVO) constructs the object directly in the caller's stack slot with zero copies or moves."
      ],
      diagram: `SHALLOW COPY (Default Compiler Copy)          DEEP COPY / MOVE (Rule of 5)
 [Obj A: ptr] ──┐                              [Obj A: ptr] ──> [Heap Buffer #1]
                ├──> [Shared Heap Buffer]      [Obj B: ptr] ──> [Heap Buffer #2 (Copy)]
 [Obj B: ptr] ──┘    (DOUBLE FREE CRASH!)      [Moved A: nullptr] (Move steals pointer in O(1))`,
      trap: "TRAP: Declaring even `virtual ~Base() = default;` disables the compiler's implicit Move Constructor and Move Assignment Operator! Always explicitly `= default` your move operations in polymorphic base classes."
    },
    {
      id: 6,
      tag: "MODULE 06 · OPERATOR OVERLOADING",
      title: "Operator Overloading, C++20 Spaceship (`<=>`) & Functors",
      subtitle: "Making user-defined types behave like built-in primitives with zero runtime overhead.",
      bullets: [
        "Member vs Non-Member (`friend`) Operators: Assignment (`=`), subscript (`[]`), call (`()`), and arrow (`->`) MUST be non-static member functions. Symmetric binary operators (`+`, `==`, `<<`) should be non-member/`friend` functions so left-hand implicit conversions work (`10 + BigInt(5)`).",
        "C++20 Spaceship Operator (`<=>`): Defining `auto operator<=>(const T&) const = default;` automatically generates all six relational operators (`==`, `!=`, `<`, `<=`, `>`, `>=`) with memberwise lexicographical comparison.",
        "Prefix vs Postfix Increment: `T& operator++()` (prefix) increments and returns `*this` by reference. `T operator++(int)` (postfix dummy `int`) saves a copy, increments, and returns the old copy by value.",
        "`explicit operator bool() const`: Allows `if (smart_ptr)` checks without allowing accidental arithmetic conversions like `smart_ptr + 5`."
      ],
      diagram: `Prefix (++obj) vs Postfix (obj++) Signature & Cost:
  T& operator++()       --> Mutates in-place, returns *this by LVALUE REF (0 temporaries)
  T  operator++(int)    --> Copies old state, mutates, returns old copy by PRVALUE (1 temporary)`,
      trap: "TRAP: Never overload `&&`, `||`, or `,` (comma operator)! Overloaded versions lose short-circuit evaluation and sequence-point guarantees."
    },
    {
      id: 7,
      tag: "MODULE 07 · INHERITANCE & DIAMOND BASE",
      title: "Inheritance Modes, Name Hiding, Object Slicing & Diamond Virtual Base",
      subtitle: "How derived subobjects nest in memory and how `virtual public` eliminates ambiguity.",
      bullets: [
        "Execution Order: Construction always runs `Virtual Base -> Base -> Members (in declaration order) -> Derived`. Destruction always runs in the exact reverse order: `~Derived -> ~Members -> ~Base -> ~Virtual Base`.",
        "Name Hiding: Defining `void f(string)` in `Derived` hides ALL overloads of `f(int)` and `f(double)` in `Base`! Use `using Base::f;` in `Derived` to bring base overloads into scope.",
        "Object Slicing: Assigning or passing a `Derived` instance by value (`void fn(Base b)`) invokes `Base(const Base&)`, slicing off `Derived`'s member variables and resetting `vptr` to `Base`'s vtable.",
        "The Diamond Problem (`: virtual public Base`): When `Scanner` and `Printer` inherit `virtual public PoweredDevice`, `Copier` contains only ONE shared `PoweredDevice` subobject (tracked via a virtual base offset pointer `vbptr`), and the most-derived class (`Copier`) constructs `PoweredDevice` directly."
      ],
      diagram: `OBJECT SLICING (Pass-by-Value)                 VIRTUAL DIAMOND LAYOUT (Copier)
  Derived d [ vptr->Derived | base_x | der_y ]   [ Scanner: vbptr | dpi ]
                     │                           [ Printer: vbptr | ppm ]
        void take(Base b) (By Value!)            [ Copier : copier_flags ]
                     ▼                           [ Shared PoweredDevice: serial_id ] <-- Single Instance!
  Base b    [ vptr->Base    | base_x ] (der_y LOST!)`,
      trap: "TRAP: You cannot downcast from a `virtual` base class to a derived class using `static_cast` (`static_cast<Copier*>(virtual_base_ptr)` is a compile error because the offset is dynamic)—you MUST use `dynamic_cast`!"
    },
    {
      id: 8,
      tag: "MODULE 08 · VTABLE, VPTR & RTTI",
      title: "Vtable & Vptr Internals, Multiple Inheritance Thunks & Virtual Traps",
      subtitle: "Tracing every pointer dereference of runtime polymorphism and avoiding classic interview traps.",
      bullets: [
        "Vtable & Vptr Mechanics: Any class with a `virtual` method gets a per-class `vtable` in read-only memory (`.rodata`) and a hidden 8-byte `vptr` at offset 0 of every object instance.",
        "Why Base Destructors Must Be `virtual`: If `Base* p = new Derived()` is deleted without a `virtual ~Base()`, the compiler statically calls `~Base()` only—leaking all resources owned by `Derived` (Undefined Behavior).",
        "Multiple Inheritance & `this` Adjustment Thunks: In `class Media : public Audio, public Video`, `Media` has TWO `vptr`s (offset 0 for `Audio`, offset +16 for `Video`). Casting `Media*` to `Video*` adds +16 to the pointer!",
        "Pure Virtual with a Body: `virtual void calibrate() = 0;` CAN have a function body defined outside the class, allowing derived overrides to share common base logic via `Base::calibrate()`."
      ],
      diagram: `Multiple Inheritance Object Layout (class MediaStream : public AudioSource, public VideoSource):
+-----------------------------------------------------------------------+
| [0x00] vptr_Audio  ---> AudioVtable (&MediaStream::~, &streamAudio)   | <-- AudioSource* & MediaStream*
| [0x08] sample_rate (4B) + 4B padding                                  |
|-----------------------------------------------------------------------|
| [0x10] vptr_Video  ---> VideoVtable (Thunk +16 adjust, &streamVideo)  | <-- VideoSource* points HERE!
| [0x18] fps (4B) + bitrate (4B)                                        |
+-----------------------------------------------------------------------+`,
      trap: "TRAP #1: Calling a virtual function inside a Base constructor/destructor invokes `Base`'s version, NOT `Derived`'s! TRAP #2: Default arguments on virtual functions bind statically from the pointer type (`Base*`), not dynamically!"
    },
    {
      id: 9,
      tag: "MODULE 09 · SMART POINTER INTERNALS",
      title: "`unique_ptr`, `shared_ptr` Control Blocks & `weak_ptr` Cycles",
      subtitle: "Inside atomic reference counting, single-allocation `make_shared`, and dangling-safe observers.",
      bullets: [
        "`std::unique_ptr<T, Deleter>`: Move-only, exclusive ownership. Uses EBO / `[[no_unique_address]]` so stateless deleters add 0 bytes (`sizeof(unique_ptr<T>) == 8` bytes).",
        "`std::shared_ptr<T>` Memory Layout: 16 bytes (two raw pointers: one to `T`, one to the heap **Control Block** containing atomic `strong_count`, atomic `weak_count`, custom deleter, and allocator).",
        "`std::make_shared<T>` vs `shared_ptr<T>(new T)`: `make_shared` performs ONE heap allocation for both `T` and the Control Block side-by-side (faster, no leak risk, better cache locality).",
        "`std::weak_ptr<T>`: Non-owning observer that increments `weak_count` only. Breaks cyclic `shared_ptr` leaks (e.g., doubly-linked lists/trees). Must call `if (auto sp = wp.lock())` to atomically promote to `shared_ptr` before reading."
      ],
      diagram: `std::make_shared<Sensor>() Single-Allocation Memory Block:
  Stack (16 Bytes)                  Single Contiguous Heap Allocation
+------------------+             +------------------------------------+------------------------+
| shared_ptr<T>    |             | Control Block                      | Managed Object (T)     |
|  ptr_ ───────────|────────────>|  atomic strong_count = 2           |  Sensor data members   |
|  control_block_ ─|────────────>|  atomic weak_count   = 1           |  (Constructed in-place)|
+------------------+             +------------------------------------+------------------------+`,
      trap: "TRAP: Creating two `std::shared_ptr<T>` from the same raw pointer (`T* raw = new T; shared_ptr<T> p1(raw); shared_ptr<T> p2(raw);`) creates TWO independent Control Blocks and causes a double-free crash! Use `std::enable_shared_from_this<T>` instead."
    },
    {
      id: 10,
      tag: "MODULE 10 · ADVANCED OOP IDIOMS",
      title: "CRTP, C++23 Deducing `this`, Non-Virtual Interface (NVI) & Pimpl",
      subtitle: "Production systems patterns used in LLVM, game engines, and low-latency financial libraries.",
      bullets: [
        "CRTP (Curiously Recurring Template Pattern): `class Derived : public Base<Derived>` resolves polymorphic calls at compile time (`static_cast<const Derived*>(this)->impl()`), eliminating `vptr` overhead and enabling full inlining.",
        "C++23 Explicit Object Parameter (Deducing `this`): `template<class Self> void run(this Self&& self)` replaces CRTP and eliminates duplicate `const` / non-`const` / `&` / `&&` method overloads.",
        "NVI (Non-Virtual Interface Idiom): Public methods are non-virtual wrappers (acquiring locks, checking preconditions/postconditions) that invoke `private virtual` customization hooks in derived classes.",
        "Pimpl (Pointer to Implementation): Hides all private class members behind `std::unique_ptr<Impl> pimpl_;` in the `.cpp` file—slashing header compile times and preserving binary ABI compatibility across shared library updates."
      ],
      diagram: `NVI (Non-Virtual Interface) Pattern:
  Caller ---> public: void execute() [Non-Virtual: Lock Mutex -> Validate -> Log]
                           │
                           ▼
              private: virtual void doExecute() = 0 [Overridden by Derived classes!]`,
      trap: "TRAP: With the Pimpl idiom (`std::unique_ptr<Impl>`), you MUST declare `~Widget();` in the header and define `Widget::~Widget() = default;` in the `.cpp` file where `struct Impl` is a complete type—otherwise `unique_ptr`'s destructor fails to compile on an incomplete type!"
    },
    {
      id: 11,
      track: "threading",
      tag: "MODULE 11 · CPPNUTS THREADING #1",
      title: "5 Ways to Create Threads, `join()`, `detach()`, `joinable()` & C++20 `std::jthread`",
      subtitle: "Hardware execution contexts, callable entry points, lifecycle invariants, and cooperative cancellation.",
      bullets: [
        "5 Callable Types in `std::thread`: (1) Function Pointer `std::thread(fn, arg)`, (2) Lambda Expression, (3) Functor (`operator()`), (4) Non-Static Member Function `std::thread(&Class::fn, &obj, arg)`, and (5) Static Member Function `std::thread(&Class::staticFn, arg)`.",
        "`join()` vs `detach()`: `t.join()` blocks the calling thread until `t` finishes and releases OS kernel handles. `t.detach()` separates the OS thread into a background daemon thread outliving the `std::thread` object.",
        "`t.joinable()` Guard: Calling `join()` or `detach()` TWICE on the same `std::thread` throws `std::system_error`. Always check `if (t.joinable())` before joining or detaching.",
        "Passing Arguments & References: `std::thread` copies/moves all arguments into internal thread-local storage by default—even if the function signature takes `T&`! Wrap references explicitly with `std::ref(x)` or `std::cref(x)`.",
        "C++20 `std::jthread`: RAII thread wrapper that automatically calls `request_stop()` and `join()` in its destructor (`~jthread()`) and supports cooperative cancellation via `std::stop_token`."
      ],
      diagram: `Thread Lifecycle & Destructor Invariant:
  std::thread t(worker) ──► [joinable() == true]
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
     t.join()                t.detach()        ~thread() while joinable()
  (Blocks caller,         (Daemon background,            │
   joinable = false)       joinable = false)             ▼
                                              std::terminate() CRASH!`,
      trap: "TRAP: If a `std::thread` object goes out of scope while `t.joinable() == true` (i.e., you neither called `join()` nor `detach()`), its destructor `~thread()` immediately invokes `std::terminate()`, crashing the entire process! And never `detach()` a thread that holds references/pointers to local stack variables."
    },
    {
      id: 12,
      track: "threading",
      tag: "MODULE 12 · CPPNUTS THREADING #2",
      title: "Race Conditions, Critical Sections, `std::mutex`, `try_lock()` & Variadic `std::try_lock`",
      subtitle: "Why `++counter` is a 3-instruction Read-Modify-Write data race and how blocking vs non-blocking locks work.",
      bullets: [
        "Data Race Anatomy (`++counter`): Compiles to three separate CPU instructions: (1) `LOAD [counter] -> REG`, (2) `ADD REG, 1`, (3) `STORE REG -> [counter]`. If two threads interleave these steps, increments are silently lost (Undefined Behavior).",
        "`std::mutex::lock()` vs `try_lock()`: `mtx.lock()` is blocking (puts the thread to sleep in the OS kernel wait queue if contended). `mtx.try_lock()` is non-blocking—it acquires the lock and returns `true` immediately if free, or returns `false` without blocking.",
        "Variadic `std::try_lock(m1, m2, ..., mn)`: Global C++ standard function that attempts to lock multiple Lockable objects in order (`m1` -> `mn`) without blocking.",
        "All-or-Nothing Rollback: If `std::try_lock(m1, m2, m3)` succeeds on all mutexes, it returns `-1`. If locking `m2` (index 1) fails, it automatically UNLOCKS `m1` (index 0) and returns the 0-based failed index (`1`)!"
      ],
      diagram: `Data Race on ++counter (Initial counter = 0):
  Thread A: [LOAD 0] ──────────────────────► [INC -> 1] ──► [STORE 1]
  Thread B:          [LOAD 0] ──► [INC -> 1] ──► [STORE 1]
  Result: counter == 1 instead of 2! (Lost Update Bug)

Variadic std::try_lock(m1, m2, m3):
  [m1.try_lock() OK] ──► [m2.try_lock() FAIL!] ──► [Rollback: m1.unlock()] ──► returns index 1`,
      trap: "TRAP: Never call raw `mtx.lock()` and `mtx.unlock()` manually in production code—if an exception is thrown or an early `return` executes inside the critical section, `mtx.unlock()` is skipped and every waiting thread deadlocks forever! Always use RAII wrappers."
    },
    {
      id: 13,
      track: "threading",
      tag: "MODULE 13 · CPPNUTS THREADING #3",
      title: "`std::timed_mutex` & `std::recursive_mutex`",
      subtitle: "Bounded-wait lock acquisition (`try_lock_for`, `try_lock_until`) and re-entrant thread ownership.",
      bullets: [
        "`std::timed_mutex`: Extends `std::mutex` with timeout-bounded blocking: `try_lock_for(rel_time)` waits up to a duration (e.g., `100ms`), and `try_lock_until(abs_time)` waits until a specific `std::chrono::time_point`.",
        "Difference from `try_lock()`: Plain `mtx.try_lock()` checks once and returns immediately; `timed_mutex::try_lock_for(50ms)` blocks and sleeps until either the mutex becomes available (`true`) or the 50ms timeout expires (`false`).",
        "Self-Deadlock on `std::mutex`: If a thread that already holds `std::mutex m` calls `m.lock()` a second time (e.g., in a recursive function or when public method `A()` calls public method `B()`), the thread blocks waiting for itself forever (Undefined Behavior).",
        "`std::recursive_mutex`: Tracks both the owning `thread::id` and an internal recursion counter. The same thread can call `lock()` `N` times and must call `unlock()` exactly `N` times before another thread can acquire it."
      ],
      diagram: `std::recursive_mutex Internal Ownership State:
  [Unlocked: owner=none, count=0]
       │ Thread T1 calls lock() (Depth 1)
       ▼
  [Locked:   owner=T1,   count=1] ──► T1 calls lock() (Depth 2) ──► [owner=T1, count=2]
       ▲                                                                   │
       └────────────────── T1 calls unlock() (Depth 2) ◄───────────────────┘`,
      trap: "TRAP: While `std::recursive_mutex` prevents self-deadlock in recursive algorithms, needing it in regular class hierarchies is often a design smell indicating unclear lock invariants. Prefer the NVI pattern: public methods lock a standard `std::mutex` and call `private` unlocked helper methods!"
    },
    {
      id: 14,
      track: "threading",
      tag: "MODULE 14 · CPPNUTS THREADING #4",
      title: "`std::lock_guard` vs `std::unique_lock` (`defer_lock`, `try_to_lock`, `adopt_lock`) vs `std::scoped_lock`",
      subtitle: "Choosing the right RAII lock wrapper and mastering the 3 `std::unique_lock` ownership tags.",
      bullets: [
        "`std::lock_guard<std::mutex>`: Lightweight, zero-overhead RAII wrapper. Locks in constructor, unlocks in destructor. Cannot be unlocked early, cannot be copied or moved, and cannot be used with `std::condition_variable`.",
        "`std::unique_lock<std::mutex>`: Flexible RAII wrapper storing an `owns_lock()` boolean flag. Supports manual `ul.unlock()` / `ul.lock()`, move semantics, timed locking, and is REQUIRED by `std::condition_variable::wait()`.",
        "The 3 Ownership Strategies for `std::unique_lock`: (1) `std::defer_lock` — does NOT lock in constructor (wrap an unlocked mutex to lock later via `ul.lock()` or `std::lock`); (2) `std::try_to_lock` — calls `mtx.try_lock()` in constructor without blocking (check `if (ul.owns_lock())`); (3) `std::adopt_lock` — assumes the calling thread ALREADY locked the mutex and takes RAII destruction ownership.",
        "C++17 `std::scoped_lock(m1, m2, ...)`: Drop-in variadic replacement for `lock_guard` that locks any number of mutexes simultaneously using a deadlock-avoidance algorithm."
      ],
      diagram: `std::unique_lock<std::mutex> Ownership Tags:
  ┌─────────────────────────┬───────────────────────────────────────────────────────┐
  │ (default) ul(mtx)       │ Calls mtx.lock() immediately in constructor           │
  │ ul(mtx, defer_lock)     │ Does NOT lock; owns_lock() == false until ul.lock()   │
  │ ul(mtx, try_to_lock)    │ Calls mtx.try_lock(); check ul.owns_lock()!           │
  │ ul(mtx, adopt_lock)     │ Assumes mtx is ALREADY locked; unlocks in ~ul()       │
  └─────────────────────────┴───────────────────────────────────────────────────────┘`,
      trap: "TRAP: Passing `std::adopt_lock` when the current thread has NOT already locked the mutex is Undefined Behavior! Conversely, passing `std::defer_lock` when the mutex IS already locked by the current thread will cause a self-deadlock when you later call `ul.lock()`."
    },
    {
      id: 15,
      track: "threading",
      tag: "MODULE 15 · CPPNUTS THREADING #5",
      title: "AB-BA Deadlock & Atomic Multi-Lock Acquisition (`std::lock` & `std::scoped_lock`)",
      subtitle: "How circular lock ordering freezes production servers and how C++'s try-and-back-off algorithm breaks the cycle.",
      bullets: [
        "Classic AB-BA Deadlock: Thread 1 locks `mtxA` and waits for `mtxB`, while simultaneously Thread 2 locks `mtxB` and waits for `mtxA`. Neither thread can ever proceed (Coffman's Hold-and-Wait + Circular Wait conditions).",
        "`std::lock(m1, m2, ...)` Deadlock Avoidance: Locks two or more mutexes using an internal try-and-back-off algorithm—if it locks `m1` but cannot lock `m2`, it releases `m1` and retries in a different order so no circular wait can form.",
        "Two Idiomatic Patterns with `std::lock`: (1) C++11: `std::unique_lock<std::mutex> l1(m1, std::defer_lock), l2(m2, std::defer_lock); std::lock(l1, l2);` or (2) C++17: `std::scoped_lock lk(m1, m2);` (single-line RAII!).",
        "Lock Hierarchy Rule: Even without `std::lock`, deadlocks are eliminated if every thread in the system acquires locks in a strict global address or layer order (e.g., always lock `&m1 < &m2`)."
      ],
      diagram: `AB-BA Deadlock (Circular Wait):
  Thread 1: [Holds mtxA] ─────── waits for ──────► [mtxB]
                 ▲                                    │
                 └────────── waits for ─────── [Holds mtxB] :Thread 2

C++17 Fix: std::scoped_lock lk(mtxA, mtxB); // Deadlock-free regardless of arg order!`,
      trap: "TRAP: `std::lock(m1, m2)` only avoids deadlock when acquiring `m1` and `m2` TOGETHER in a single call. If Thread 1 calls `lock(m1)` in function `foo()` and later calls `lock(m2)` in `bar()`, `std::lock` cannot help—you must acquire both together or enforce a global lock hierarchy!"
    },
    {
      id: 16,
      track: "threading",
      tag: "MODULE 16 · CPPNUTS THREADING #6",
      title: "`std::condition_variable`, Spurious Wakeups, Even-Odd Threads & Producer-Consumer",
      subtitle: "Event-driven thread synchronization without CPU-burning spin loops.",
      bullets: [
        "Why Condition Variables? Polling a mutex in a `while` loop burns 100% of a CPU core. `std::condition_variable` puts a waiting thread into a 0%-CPU OS sleep state until another thread modifies shared state and signals `notify_one()` or `notify_all()`.",
        "How `cv.wait(ul, predicate)` Works: Equivalent to `while (!predicate()) cv.wait(ul);`. When `predicate()` is false, `wait()` atomically UNLOCKS `ul` and puts the thread to sleep. When notified, it wakes up, RE-LOCKS `ul`, and re-evaluates `predicate()`.",
        "Spurious Wakeups & Lost Notifications: OS schedulers (POSIX `pthread_cond_wait` / Windows futexes) can wake a waiting thread even when no thread called `notify`! Always pass a stateful boolean predicate lambda to `cv.wait(ul, [&]{ return ready; })`.",
        "Unlock Before Notify Optimization: Releasing the `unique_lock` (or closing the `lock_guard` scope) BEFORE calling `cv.notify_one()` prevents the woken thread from immediately blocking on the still-locked mutex ('hurry up and wait' pessimization)."
      ],
      diagram: `std::condition_variable::wait(ul, pred) Lifecycle:
  Consumer: [Lock ul] ──► [pred() == false] ──► [Atomically Unlock ul + Sleep]
                                                             │
  Producer: [Lock lg] ──► [Mutate Queue] ──► [Unlock lg] ──► cv.notify_one()
                                                             │
  Consumer: [Wake Up] ◄── [Re-acquire ul] ◄── [Re-check pred() == true!] ──► Proceed`,
      trap: "TRAP: Calling `cv.notify_one()` WITHOUT mutating a shared variable protected by the mutex causes a 'Lost Wakeup' if the notification fires before the consumer enters `cv.wait()`. The state variable (`bool ready` or `queue.size()`) is the memory of the notification!"
    },
    {
      id: 17,
      track: "threading",
      tag: "MODULE 17 · CPPNUTS THREADING #7",
      title: "`std::future`, `std::promise`, `std::async` (`async` vs `deferred`) & `std::packaged_task`",
      subtitle: "Single-use asynchronous value channels, exception propagation across threads, and launch policies.",
      bullets: [
        "`std::promise<T>` & `std::future<T>`: A thread-safe single-use channel sharing a heap-allocated Shared State. The producer thread calls `promise.set_value(val)` (or `set_exception()`), and the consumer thread calls `future.get()` to block until the result is ready.",
        "`future.get()` is Move-Once: Calling `future.get()` moves the value out of the shared state and invalidates the future (`future.valid() == false`). If multiple threads need to read the same result, convert it via `std::shared_future<T> sf = fut.share();`.",
        "`std::async` Launch Policies: `std::launch::async` forces execution on a background thread immediately. `std::launch::deferred` performs lazy evaluation—no thread is spawned, and the function executes synchronously on the calling thread when `.get()` or `.wait()` is called.",
        "`std::packaged_task<R(Args...)>`: Wraps any callable target so it can be invoked asynchronously (e.g., pushed into a Thread Pool `std::queue`) while returning its result through an associated `std::future<R>`."
      ],
      diagram: `Shared State Channel (std::promise ──► std::future):
  Worker Thread                           Main Thread
  ┌────────────────────────┐              ┌────────────────────────┐
  │ promise.set_value(42)  │ ───writes──► │ [Heap Shared State]    │
  └────────────────────────┘              │   value = 42, ready=1  │
                                          └───────────┬────────────┘
                                                      │ unblocks & moves
                                                      ▼
                                          int res = future.get();`,
      trap: "TRAP: The `std::future` returned by `std::async(std::launch::async, fn)` has a BLOCKING destructor! If you ignore its return value (`std::async(std::launch::async, fn);` without assigning to a variable), the temporary `std::future` destructs at the semicolon and blocks right there—turning your async call into synchronous code!"
    },
    {
      id: 18,
      track: "threading",
      tag: "MODULE 18 · CPPNUTS THREADING #8",
      title: "`std::atomic`, `std::shared_mutex`, `std::call_once`, C++20 Semaphores & Thread Pool",
      subtitle: "Hardware lock-free operations, reader-writer locks, one-time init, and production worker pools.",
      bullets: [
        "`std::atomic<T>`: Maps directly to lock-free CPU instructions (`LOCK XADD`, `CMPXCHG` / `LDREX`/`STREX`) without OS context switches. Supports `load()`, `store()`, `fetch_add()`, and `compare_exchange_weak/strong()`.",
        "`std::shared_mutex` (C++17 Reader-Writer Lock): Allows unlimited concurrent readers via `std::shared_lock<std::shared_mutex>` while granting exclusive access to a single writer via `std::unique_lock<std::shared_mutex>`.",
        "`std::call_once` & `std::once_flag`: Guarantees a callable initialization routine runs exactly once across all threads, even under heavy contention (ideal for thread-safe lazy hardware/DB initialization).",
        "C++20 `std::counting_semaphore<Max>` / `std::latch` / `std::barrier`: Unlike a mutex (which must be unlocked by the same thread that locked it), a semaphore tracks a permit count (`acquire()` decrements, `release()` increments from any thread) to throttle concurrency.",
        "Production Thread Pool Architecture: Pre-spawns `N` persistent worker threads (`std::thread::hardware_concurrency()`) sleeping on a `condition_variable` task queue (`std::queue<std::function<void()>>`), eliminating thread creation/destruction overhead."
      ],
      diagram: `Production Thread Pool Architecture:
  [Enqueued Tasks: packaged_task 1..K] ──► [Mutex + Condition Variable Task Queue]
                                                 │        │        │
                                      notify_one()        │        │
                                                 ▼        ▼        ▼
                                            [Worker 1][Worker 2][Worker 3] ──► Fulfill std::future<R>`,
      trap: "TRAP: `std::atomic<int> x` guarantees each individual operation (`++x`, `x += 5`) is atomic, but composing two atomic reads (`if (x > 0) x = x - 1;`) is NOT atomic (Time-Of-Check to Time-Of-Use race)! Use a `compare_exchange_weak` CAS loop for compound lock-free updates."
    },
    {
      id: 19,
      track: "stl",
      tag: "MODULE 19 · STL CONTAINERS #1",
      title: "`std::vector<T>` Internals, Geometric 2x Growth & Iterator Invalidation",
      subtitle: "The 24-byte stack control header, contiguous heap cache locality, and reallocation mechanics.",
      bullets: [
        "24-Byte Stack Header (64-bit ABI): Every `std::vector<T>` stores three 8-byte pointers on the stack: `start_` (`begin()`), `finish_` (`end()`, `size = finish_ - start_`), and `end_of_storage_` (`capacity = end_of_storage_ - start_`).",
        "Geometric Growth (2x on GCC/Clang, 1.5x on MSVC): When `size() == capacity()`, `push_back()` allocates a new buffer of `2 * capacity()`, moves (if `T(T&&)` is `noexcept`) or copies existing elements, destroys old elements, and frees the old heap block.",
        "`emplace_back()` vs `push_back()`: `emplace_back(args...)` forwards constructor arguments directly into uninitialized heap memory via placement `new (finish_) T(std::forward<Args>(args)...)`, avoiding temporary object creation.",
        "`reserve(n)` vs `resize(n)`: `reserve(n)` only grows raw uninitialized capacity (`size()` stays unchanged); `resize(n)` constructs `n` actual default-initialized `T` objects."
      ],
      diagram: `std::vector<int> Stack Header (24B) & Heap Reallocation:
  Stack [start_ | finish_ | end_of_storage_] (size=4, cap=4)
           │
           ▼
  Old Heap: [ 10 | 20 | 30 | 40 ]  ──(push_back(50) triggers 2x alloc)──►
  New Heap: [ 10 | 20 | 30 | 40 | 50 | -- | -- | -- ] (size=5, cap=8)
  WARNING : All pointers, references, and iterators to Old Heap are now DANGLING!`,
      trap: "TRAP: Holding a pointer or reference to an element (`int& ref = v[0];`) across a `v.push_back(...)` that exceeds `v.capacity()` causes Use-After-Free Undefined Behavior because the entire underlying array is relocated to a new heap address!"
    },
    {
      id: 20,
      track: "stl",
      tag: "MODULE 20 · STL CONTAINERS #2",
      title: "`std::unordered_map` Hash Buckets, Load Factor & Rehashing",
      subtitle: "How compiler symbol tables achieve O(1) lookup and what happens during bucket collisions.",
      bullets: [
        "Bucket Array + Separate Chaining: `std::unordered_map<K, V>` maintains a contiguous array of bucket pointers (`bucket_count()`), where each bucket points to a heap-allocated linked list of key-value nodes.",
        "Index Calculation: For any key `k`, the container computes `std::size_t h = Hash{}(k);` and maps it to bucket index `h % bucket_count()`.",
        "Load Factor & Rehash: `load_factor() = size() / bucket_count()`. When `load_factor() > max_load_factor()` (default `1.0`), the table allocates a larger prime/power-of-2 bucket array and re-links all nodes (`rehash()`).",
        "Pointer vs Iterator Stability: Rehashing invalidates all **iterators**, but C++11 guarantees that **pointers and references** to `std::pair<const K, V>` elements remain valid across `rehash()` because nodes are relinked without being reallocated!"
      ],
      diagram: `std::unordered_map Bucket Array (bucket_count = 4, size = 3):
  Bucket [0] ──► nullptr
  Bucket [1] ──► [Node: "x" -> 10] ──► [Node: "y" -> 20] (Collision Chain!)
  Bucket [2] ──► nullptr
  Bucket [3] ──► [Node: "main" -> 0x400] ──► nullptr`,
      trap: "TRAP: `map[key]` (`operator[]`) silently INSERTS a default-constructed value `V{}` if `key` does not exist—mutating the map, increasing `size()`, and potentially triggering a `rehash()`! In read-only or `const` paths, always use `map.find(key)` or C++20 `map.contains(key)`."
    },
    {
      id: 21,
      track: "stl",
      tag: "MODULE 21 · STL CONTAINERS #3",
      title: "`std::map` (Red-Black Tree) vs `std::priority_queue` (Binary Heap)",
      subtitle: "Ordered O(log N) tree traversal vs cache-friendly array-backed heap scheduling.",
      bullets: [
        "`std::map<K, V>` / `std::set<K>`: Implemented as a self-balancing Red-Black Binary Search Tree. Each node allocates 3 pointers (`parent`, `left`, `right`) + color bit + payload on the heap.",
        "Logarithmic Range Queries: `map.lower_bound(k)` (first element `>= k`) and `map.upper_bound(k)` (first element `> k`) run in `O(log N)` time, making `std::map` ideal for interval tables, order books, and memory allocators.",
        "`std::priority_queue<T>`: Container adapter (wrapping `std::vector<T>` by default) that maintains a Binary Max-Heap (`std::less<T>`) or Min-Heap (`std::greater<T>`) in contiguous memory.",
        "Why `priority_queue` Beats `std::set` for Schedulers: Because `priority_queue` lives inside a contiguous `std::vector`, `push()` (`std::push_heap`) and `pop()` (`std::pop_heap`) have zero per-node heap allocations and superior CPU L1 cache locality."
      ],
      diagram: `Red-Black Tree (std::map)               Binary Max-Heap in std::vector (priority_queue)
         [20: Black]                    Index:   [0]  [1]  [2]  [3]  [4]
        /           \\                   Array:  [ 90 | 70 | 50 | 30 | 20 ]
   [10: Red]     [30: Red]              Children of [i] are at [2i+1] and [2i+2]!`,
      trap: "TRAP: Passing `std::binary_search` or `std::lower_bound(map.begin(), map.end(), k)` as a free `<algorithm>` function on a `std::map` or `std::set` takes `O(N)` linear time because tree iterators are bidirectional, not random-access! Always call the member method `map.lower_bound(k)` for `O(log N)`."
    },
    {
      id: 22,
      track: "stl",
      tag: "MODULE 22 · STL CONTAINERS #4",
      title: "`std::deque` Segmented Map, C++20 `std::span` & Ranges",
      subtitle: "Chunked double-ended queues without reallocation spikes and non-owning contiguous views.",
      bullets: [
        "`std::deque<T>` Architecture: Instead of one giant contiguous array, `std::deque` uses a central pointer array (`map`) pointing to fixed-size contiguous chunks (e.g., 512B or 4KB pages).",
        "Why `std::queue` Uses `std::deque` by Default: Pushing/popping at BOTH ends (`push_front`, `push_back`, `pop_front`) is `O(1)` without ever copying existing elements to a new buffer.",
        "C++20 `std::span<T>`: A lightweight 16-byte non-owning view (`{T* ptr, std::size_t size}`) over any contiguous sequence (`std::vector`, `std::array`, raw C array) with zero heap allocation.",
        "C++20 `std::ranges` & Views: Lazy composable pipelines (`v | std::views::filter(...) | std::views::transform(...)`) that evaluate elements on-the-fly without allocating intermediate vectors."
      ],
      diagram: `std::deque<T> Central Map of Fixed-Size Chunks:
  Map Array: [ ChunkPtr0 | ChunkPtr1 | ChunkPtr2 ]
                  │           │           │
                  ▼           ▼           ▼
               [..|10|20]  [30|40|50]  [60|70|..]  <-- O(1) push_front & push_back!`,
      trap: "TRAP: While `std::deque::push_back()` and `push_front()` do NOT invalidate pointers or references to existing elements, they DO invalidate all existing `std::deque` iterators! And never pass a `std::deque` to a C API expecting a contiguous `T*` buffer."
    }
  ],

  codeDemos: [
    {
      id: "alignment",
      title: "01 · Greedy Alignment, Padding & C++20 [[no_unique_address]]",
      subtitle: "Inspect exact byte offsets, padding waste, bit-fields, and Empty Base Optimization.",
      tags: ["Greedy Alignment", "Struct Padding", "EBO / C++20"],
      code: `#include <cstddef>
#include <cstdint>
#include <iostream>

struct Empty {}; // 1 byte by C++ object identity rule

// Poor ordering: 24 bytes (10 bytes lost to alignment padding!)
struct PoorLayout {
    char a;       // offset 0 (1B) + 7B padding
    double b;     // offset 8 (8B)
    int32_t c;    // offset 16 (4B)
    char d;       // offset 20 (1B) + 3B tail padding
};

// Greedy ordering (8B -> 4B -> 1B): 16 bytes (saves 33% RAM!)
struct GreedyLayout {
    double b;     // offset 0 (8B)
    int32_t c;    // offset 8 (4B)
    char a;       // offset 12 (1B)
    char d;       // offset 13 (1B) + 2B tail padding
};

struct CompactHolder {
    int* ptr;
    [[no_unique_address]] Empty deleter; // 0 bytes overhead in C++20!
};

int main() {
    std::cout << "sizeof(Empty)         = " << sizeof(Empty) << " B\\n";
    std::cout << "sizeof(PoorLayout)    = " << sizeof(PoorLayout) << " B (align " << alignof(PoorLayout) << ")\\n";
    std::cout << "  Poor offsets        -> a:" << offsetof(PoorLayout, a)
              << " b:" << offsetof(PoorLayout, b)
              << " c:" << offsetof(PoorLayout, c)
              << " d:" << offsetof(PoorLayout, d) << "\\n";
    std::cout << "sizeof(GreedyLayout)  = " << sizeof(GreedyLayout) << " B (align " << alignof(GreedyLayout) << ")\\n";
    std::cout << "  Greedy offsets      -> b:" << offsetof(GreedyLayout, b)
              << " c:" << offsetof(GreedyLayout, c)
              << " a:" << offsetof(GreedyLayout, a)
              << " d:" << offsetof(GreedyLayout, d) << "\\n";
    std::cout << "sizeof(CompactHolder) = " << sizeof(CompactHolder) << " B (EBO via [[no_unique_address]])\\n";
}`,
      expectedOutput: `sizeof(Empty)         = 1 B
sizeof(PoorLayout)    = 24 B (align 8)
  Poor offsets        -> a:0 b:8 c:16 d:20
sizeof(GreedyLayout)  = 16 B (align 8)
  Greedy offsets      -> b:0 c:8 a:12 d:13
sizeof(CompactHolder) = 8 B (EBO via [[no_unique_address]])`
    },
    {
      id: "friends_this",
      title: "02 · Encapsulation, Friend Functions/Classes, `mutable` & Ref-Qualifiers",
      subtitle: "Demonstrates friend operator<<, friend Inspector class, mutable cache in const methods, and & vs &&.",
      tags: ["friend Class/Fn", "mutable", "Ref-Qualifiers (& / &&)"],
      code: `#include <iostream>
#include <string>
#include <utility>

class AuditInspector;

class BankVault {
    std::string owner_;
    double balance_;
    mutable int audits_ = 0; // Modifiable even inside const methods!

public:
    BankVault(std::string owner, double bal)
        : owner_(std::move(owner)), balance_(bal) {}

    double balance() const {
        ++audits_;
        return balance_;
    }

    // Ref-qualifiers: Lvalue (&) copies safely; Rvalue (&&) moves!
    const std::string& getOwner() const & {
        std::cout << "[Lvalue & overload] ";
        return owner_;
    }
    std::string getOwner() && {
        std::cout << "[Rvalue && move overload] ";
        return std::move(owner_);
    }

    friend std::ostream& operator<<(std::ostream& os, const BankVault& v);
    friend class AuditInspector;
};

std::ostream& operator<<(std::ostream& os, const BankVault& v) {
    ++v.audits_;
    return os << "Vault(" << v.owner_ << ", $" << v.balance_ << ", audits=" << v.audits_ << ")";
}

class AuditInspector {
public:
    static bool isSolvent(const BankVault& v, double threshold) {
        return v.balance_ >= threshold; // Direct private access!
    }
};

int main() {
    const BankVault v("Alice", 50000.0);
    std::cout << "Read balance : $" << v.balance() << "\\n";
    std::cout << "Friend <<    : " << v << "\\n";
    std::cout << "Inspector    : " << (AuditInspector::isSolvent(v, 10000) ? "SOLVENT" : "LOW") << "\\n";
    std::cout << "From lvalue  : " << v.getOwner() << "\\n";
    std::cout << "From rvalue  : " << BankVault("TempBob", 0).getOwner() << "\\n";
}`,
      expectedOutput: `Read balance : $50000
Friend <<    : Vault(Alice, $50000, audits=2)
Inspector    : SOLVENT
From lvalue  : [Lvalue & overload] Alice
From rvalue  : [Rvalue && move overload] TempBob`
    },
    {
      id: "rvalue_move",
      title: "03 · Value Categories (lvalue/prvalue/xvalue), Move & Rule of 5",
      subtitle: "Compile-time value category classification, noexcept move constructor in std::vector, and perfect forwarding.",
      tags: ["lvalue / xvalue / prvalue", "Rule of 5", "noexcept Move"],
      code: `#include <iostream>
#include <type_traits>
#include <utility>
#include <vector>

template <typename T>
constexpr const char* category() {
    if constexpr (std::is_lvalue_reference_v<T>) return "lvalue";
    else if constexpr (std::is_rvalue_reference_v<T>) return "xvalue (expiring rvalue)";
    else return "prvalue (pure rvalue)";
}
#define CAT(expr) category<decltype((expr))>()

struct Buffer {
    size_t n;
    int* ptr;
    explicit Buffer(size_t s) : n(s), ptr(new int[s]{}) {}
    ~Buffer() { delete[] ptr; }

    Buffer(const Buffer& o) : n(o.n), ptr(new int[o.n]) {
        std::cout << "  [Copy Ctor] Deep copy (" << n << " ints)\\n";
    }
    Buffer(Buffer&& o) noexcept : n(std::exchange(o.n, 0)), ptr(std::exchange(o.ptr, nullptr)) {
        std::cout << "  [Move Ctor noexcept] O(1) pointer steal (" << n << " ints)\\n";
    }
};

int main() {
    int x = 10;
    std::cout << "x             -> " << CAT(x) << "\\n";
    std::cout << "10            -> " << CAT(10) << "\\n";
    std::cout << "++x           -> " << CAT(++x) << "\\n";
    std::cout << "x++           -> " << CAT(x++) << "\\n";
    std::cout << "\"hello\"       -> " << CAT("hello") << "\\n";
    std::cout << "std::move(x)  -> " << CAT(std::move(x)) << "\\n\\n";

    std::cout << "Vector reallocation with noexcept Move:\\n";
    std::vector<Buffer> v;
    v.push_back(Buffer(64));
    v.push_back(Buffer(128)); // Reallocates buffer -> moves item 0 via noexcept Move!
}`,
      expectedOutput: `x             -> lvalue
10            -> prvalue (pure rvalue)
++x           -> lvalue
x++           -> prvalue (pure rvalue)
"hello"       -> lvalue
std::move(x)  -> xvalue (expiring rvalue)

Vector reallocation with noexcept Move:
  [Move Ctor noexcept] O(1) pointer steal (64 ints)
  [Move Ctor noexcept] O(1) pointer steal (128 ints)
  [Move Ctor noexcept] O(1) pointer steal (64 ints)`
    },
    {
      id: "diamond",
      title: "04 · Diamond Problem (`virtual public`), Object Slicing & Name Hiding",
      subtitle: "Compare virtual inheritance single-base unification, object slicing by value, and `using Base::fn`.",
      tags: ["Diamond virtual public", "Object Slicing", "Name Hiding"],
      code: `#include <iostream>
#include <string>

struct Device {
    int id;
    explicit Device(int i) : id(i) { std::cout << "1. Device(" << id << ") constructed\\n"; }
    virtual ~Device() = default;
    virtual std::string type() const { return "BaseDevice"; }
};

struct Scanner : virtual public Device {
    explicit Scanner(int i) : Device(i) { std::cout << "2. Scanner constructed\\n"; }
    std::string type() const override { return "Scanner"; }
};

struct Printer : virtual public Device {
    explicit Printer(int i) : Device(i) { std::cout << "3. Printer constructed\\n"; }
    std::string type() const override { return "Printer"; }
};

struct Copier : public Scanner, public Printer {
    // Most-derived class initializes virtual base Device directly!
    explicit Copier(int master_id) : Device(master_id), Scanner(1), Printer(2) {
        std::cout << "4. Copier constructed\\n";
    }
    std::string type() const override { return "AllInOneCopier#" + std::to_string(id); }
};

void printSliced(Device d)       { std::cout << "By Value (SLICED) : " << d.type() << "\\n"; }
void printPolymorphic(const Device& d) { std::cout << "By Ref (INTACT)   : " << d.type() << "\\n"; }

int main() {
    Copier c(2026);
    std::cout << "Shared Device::id = " << c.id << " (Zero ambiguity!)\\n";
    printSliced(c);
    printPolymorphic(c);
}`,
      expectedOutput: `1. Device(2026) constructed
2. Scanner constructed
3. Printer constructed
4. Copier constructed
Shared Device::id = 2026 (Zero ambiguity!)
By Value (SLICED) : BaseDevice
By Ref (INTACT)   : AllInOneCopier#2026`
    },
    {
      id: "vtable_traps",
      title: "05 · Vtable Dispatch, Multiple Vptrs & Classic Virtual Interview Traps",
      subtitle: "Pure virtual with body, default arguments on virtual functions, ctor virtual call trap, and multi-vptr offsets.",
      tags: ["vptr & vtable", "Multiple Vptrs", "Interview Traps"],
      code: `#include <iostream>
#include <memory>

struct BaseInstrument {
    BaseInstrument() {
        std::cout << "[Trap 1: In Base Ctor] whoAmI() -> ";
        whoAmI(); // Calls Base version because Derived is not constructed yet!
    }
    virtual ~BaseInstrument() = default;
    virtual void whoAmI() const { std::cout << "BaseInstrument\\n"; }

    // Trap 2: Default argument is bound STATICALLY at compile time!
    virtual void trigger(int gain = 10) const = 0;
};

void BaseInstrument::trigger(int gain) const {
    std::cout << "[Pure Virtual Base Body] default calibration gain=" << gain << "\\n";
}

struct Scope final : BaseInstrument {
    void whoAmI() const override { std::cout << "Scope (Derived)\\n"; }
    void trigger(int gain = 999) const override {
        BaseInstrument::trigger(gain);
        std::cout << "[Scope::trigger] Dynamic body ran, but gain = " << gain << " (from Base* static type!)\\n";
    }
};

struct Audio { int hz = 48000; virtual ~Audio() = default; virtual void a() {} };
struct Video { int fps = 60;   virtual ~Video() = default; virtual void v() {} };
struct Media : Audio, Video { int br = 5000; };

int main() {
    std::unique_ptr<BaseInstrument> ptr = std::make_unique<Scope>();
    ptr->trigger(); // Uses BaseInstrument's default arg (10), NOT Scope's (999)!

    Media m;
    Audio* pa = &m;
    Video* pv = &m;
    std::cout << "Multi-vptr offset (Video* - Audio*) = +"
              << (reinterpret_cast<char*>(pv) - reinterpret_cast<char*>(pa)) << " bytes\\n";
}`,
      expectedOutput: `[Trap 1: In Base Ctor] whoAmI() -> BaseInstrument
[Pure Virtual Base Body] default calibration gain=10
[Scope::trigger] Dynamic body ran, but gain = 10 (from Base* static type!)
Multi-vptr offset (Video* - Audio*) = +16 bytes`
    },
    {
      id: "smart_pointers",
      title: "06 · Custom SharedPtr Control Block & Breaking Cycles with weak_ptr",
      subtitle: "Build a reference-counted smart pointer from scratch and prevent cyclic memory leaks with std::weak_ptr.",
      tags: ["Control Block", "std::shared_ptr", "std::weak_ptr"],
      code: `#include <iostream>
#include <memory>
#include <string>
#include <utility>

template <typename T>
class MiniShared {
    T* ptr_ = nullptr;
    size_t* count_ = nullptr;
    void release() {
        if (count_ && --(*count_) == 0) {
            delete ptr_;
            delete count_;
            std::cout << "  [MiniShared] Ref count hit 0 -> freed resource!\\n";
        }
    }
public:
    explicit MiniShared(T* p = nullptr) : ptr_(p), count_(p ? new size_t(1) : nullptr) {}
    ~MiniShared() { release(); }
    MiniShared(const MiniShared& o) : ptr_(o.ptr_), count_(o.count_) { if (count_) ++(*count_); }
    MiniShared(MiniShared&& o) noexcept : ptr_(std::exchange(o.ptr_, nullptr)), count_(std::exchange(o.count_, nullptr)) {}
    size_t use_count() const { return count_ ? *count_ : 0; }
};

struct Node {
    std::string name;
    std::shared_ptr<Node> next;
    std::weak_ptr<Node> prev; // Weak back-edge prevents memory leak!
    explicit Node(std::string n) : name(std::move(n)) {}
    ~Node() { std::cout << "  [~Node] Cleanly destroyed " << name << "\\n"; }
};

int main() {
    std::cout << "1. MiniShared Lifecycle:\\n";
    {
        MiniShared<int> a(new int(99));
        MiniShared<int> b = a;
        std::cout << "  use_count after copy = " << a.use_count() << "\\n";
    }
    std::cout << "2. Doubly-Linked Cycle with std::weak_ptr:\\n";
    {
        auto n1 = std::make_shared<Node>("NodeA");
        auto n2 = std::make_shared<Node>("NodeB");
        n1->next = n2;
        n2->prev = n1;
        std::cout << "  n1 strong=" << n1.use_count() << ", weak_ptr lock=" << n2->prev.lock()->name << "\\n";
    }
}`,
      expectedOutput: `1. MiniShared Lifecycle:
  use_count after copy = 2
  [MiniShared] Ref count hit 0 -> freed resource!
2. Doubly-Linked Cycle with std::weak_ptr:
  n1 strong=1, weak_ptr lock=NodeA
  [~Node] Cleanly destroyed NodeA
  [~Node] Cleanly destroyed NodeB`
    },
    {
      id: "operators_spaceship",
      title: "07 · Operator Overloading, C++20 Spaceship (<=>) & Functors",
      subtitle: "Synthesize all 6 relational operators with <=>, distinguish ++x vs x++, and build stateful functors.",
      tags: ["operator<=>", "Prefix vs Postfix ++", "Functor ()"],
      code: `#include <compare>
#include <iostream>

class SemVer {
    int major_, minor_, patch_;
public:
    constexpr SemVer(int ma, int mi, int pa) : major_(ma), minor_(mi), patch_(pa) {}

    // C++20 Spaceship: synthesizes ==, !=, <, <=, >, >= automatically!
    auto operator<=>(const SemVer&) const = default;

    // Prefix ++v (returns lvalue reference, no copy)
    SemVer& operator++() { ++patch_; return *this; }

    // Postfix v++ (takes dummy int, returns old copy by value)
    SemVer operator++(int) { SemVer old = *this; ++(*this); return old; }

    friend std::ostream& operator<<(std::ostream& os, const SemVer& v) {
        return os << v.major_ << "." << v.minor_ << "." << v.patch_;
    }
};

struct ExponentialMovingAvg {
    double alpha;
    double state = 0.0;
    double operator()(double sample) {
        state = alpha * sample + (1.0 - alpha) * state;
        return state;
    }
};

int main() {
    SemVer v1(1, 9, 0), v2(2, 0, 0);
    std::cout << v1 << " < " << v2 << " : " << std::boolalpha << (v1 < v2) << "\\n";
    std::cout << "Postfix v1++ returns : " << v1++ << " (now " << v1 << ")\\n";
    std::cout << "Prefix  ++v1 returns : " << ++v1 << "\\n";

    ExponentialMovingAvg ema{0.5};
    std::cout << "Functor EMA(100)     : " << ema(100.0) << ", EMA(200): " << ema(200.0) << "\\n";
}`,
      expectedOutput: `1.9.0 < 2.0.0 : true
Postfix v1++ returns : 1.9.0 (now 1.9.1)
Prefix  ++v1 returns : 1.9.2
Functor EMA(100)     : 50, EMA(200): 125`
    },
    {
      id: "crtp_nvi",
      title: "08 · Static Polymorphism (CRTP) & Non-Virtual Interface (NVI) Idiom",
      subtitle: "Zero-overhead static dispatch via CRTP alongside private virtual hooks in the NVI pattern.",
      tags: ["CRTP Static Dispatch", "NVI Pattern", "Zero Overhead"],
      code: `#include <iostream>

// 1. CRTP: Compile-Time Polymorphism (sizeof == 8B, NO vptr!)
template <typename Derived>
struct ShapeCRTP {
    double area() const {
        return static_cast<const Derived*>(this)->computeArea();
    }
};

struct Circle : ShapeCRTP<Circle> {
    double r = 3.0;
    double computeArea() const { return 3.14159 * r * r; }
};

// 2. NVI: Public non-virtual method enforces invariants around private virtual hook
class DatabaseQuery {
public:
    virtual ~DatabaseQuery() = default;
    void run() const {
        std::cout << "[NVI Guard] Begin transaction & verify permissions\\n";
        executeImpl(); // Calls private virtual override in Derived!
        std::cout << "[NVI Guard] Commit transaction & emit telemetry\\n";
    }
private:
    virtual void executeImpl() const = 0;
};

class LedgerUpdate final : public DatabaseQuery {
    void executeImpl() const override {
        std::cout << "  -> [LedgerUpdate] Updating account balances...\\n";
    }
};

int main() {
    Circle c;
    std::cout << "CRTP Circle area = " << c.area()
              << " | sizeof(Circle) = " << sizeof(Circle) << " B (No vptr!)\\n\\n";
    LedgerUpdate q;
    q.run();
}`,
      expectedOutput: `CRTP Circle area = 28.2743 | sizeof(Circle) = 8 B (No vptr!)

[NVI Guard] Begin transaction & verify permissions
  -> [LedgerUpdate] Updating account balances...
[NVI Guard] Commit transaction & emit telemetry`
    },
    {
      id: "threads_5_ways",
      track: "threading",
      title: "09 · CppNuts #1: 5 Ways to Spawn Threads, join()/detach() & C++20 std::jthread",
      subtitle: "Spawn threads via Function Pointer, Lambda, Functor, Non-Static & Static Member Functions, plus std::jthread.",
      tags: ["std::thread (5 Ways)", "join() vs detach()", "C++20 std::jthread"],
      code: `#include <iostream>
#include <thread>
#include <string>

// 1. Function Pointer
void worker_fn(int id) {
    std::cout << "[1. Function Ptr] Worker #" << id << " finished\\n";
}

// 3. Functor (Function Object)
struct PacketCompressor {
    void operator()(const std::string& algo) const {
        std::cout << "[3. Functor]      Compressed payload using " << algo << "\\n";
    }
};

// 4 & 5. Non-Static & Static Member Functions
class EngineController {
public:
    void calibrate(int rpm) {
        std::cout << "[4. Member Fn]    Calibrated engine to " << rpm << " RPM\\n";
    }
    static void runDiagnostics(const std::string& subsystem) {
        std::cout << "[5. Static Fn]    Diagnostics OK on " << subsystem << "\\n";
    }
};

int main() {
    EngineController ctrl;

    std::thread t1(worker_fn, 101);
    std::thread t2([](int a, int b) {
        std::cout << "[2. Lambda]       Computed " << a << " + " << b << " = " << (a + b) << "\\n";
    }, 20, 22);
    std::thread t3(PacketCompressor{}, "LZ4-Fast");
    std::thread t4(&EngineController::calibrate, &ctrl, 6500);
    std::thread t5(&EngineController::runDiagnostics, "FuelInjection");

    // Always guard with joinable() before join()!
    if (t1.joinable()) t1.join();
    if (t2.joinable()) t2.join();
    if (t3.joinable()) t3.join();
    if (t4.joinable()) t4.join();
    if (t5.joinable()) t5.join();

    std::cout << "All 5 threads joined cleanly (t1.joinable() = "
              << std::boolalpha << t1.joinable() << ")\\n";
}`,
      expectedOutput: `[1. Function Ptr] Worker #101 finished
[2. Lambda]       Computed 20 + 22 = 42
[3. Functor]      Compressed payload using LZ4-Fast
[4. Member Fn]    Calibrated engine to 6500 RPM
[5. Static Fn]    Diagnostics OK on FuelInjection
All 5 threads joined cleanly (t1.joinable() = false)`
    },
    {
      id: "mutex_timed_recursive",
      track: "threading",
      title: "10 · CppNuts #2: Race Conditions, std::mutex, timed_mutex & recursive_mutex",
      subtitle: "Eliminate data races with std::mutex, test bounded timeouts with timed_mutex, and re-enter recursive_mutex.",
      tags: ["std::mutex", "std::timed_mutex", "std::recursive_mutex"],
      code: `#include <iostream>
#include <thread>
#include <mutex>
#include <chrono>

std::mutex g_mtx;
int shared_counter = 0;

void safe_increment(int iterations) {
    for (int i = 0; i < iterations; ++i) {
        std::lock_guard<std::mutex> lk(g_mtx); // Critical section protected!
        ++shared_counter;
    }
}

std::recursive_mutex g_rec_mtx;
int factorial_locked(int n) {
    // Same thread locks g_rec_mtx recursively without self-deadlock!
    std::lock_guard<std::recursive_mutex> lk(g_rec_mtx);
    if (n <= 1) return 1;
    return n * factorial_locked(n - 1);
}

std::timed_mutex g_timed_mtx;
void try_timed_worker() {
    using namespace std::chrono_literals;
    if (g_timed_mtx.try_lock_for(25ms)) {
        std::cout << "[timed_mutex] Acquired lock within 25ms timeout!\\n";
        g_timed_mtx.unlock();
    }
}

int main() {
    std::thread t1(safe_increment, 10000);
    std::thread t2(safe_increment, 10000);
    t1.join();
    t2.join();
    std::cout << "[std::mutex]           shared_counter = " << shared_counter << " (Zero Race!)\\n";
    std::cout << "[std::recursive_mutex] 5! recursive   = " << factorial_locked(5) << "\\n";

    std::thread t3(try_timed_worker);
    t3.join();
}`,
      expectedOutput: `[std::mutex]           shared_counter = 20000 (Zero Race!)
[std::recursive_mutex] 5! recursive   = 120
[timed_mutex] Acquired lock within 25ms timeout!`
    },
    {
      id: "unique_lock_deadlock",
      track: "threading",
      title: "11 · CppNuts #3: unique_lock (defer/try/adopt), Variadic try_lock & Deadlock Fix",
      subtitle: "Master std::unique_lock ownership strategies, variadic std::try_lock(m1, m2), and AB-BA deadlock prevention.",
      tags: ["unique_lock Tags", "AB-BA Deadlock Fix", "std::lock / scoped_lock"],
      code: `#include <iostream>
#include <thread>
#include <mutex>

struct BankAccount {
    std::string name;
    int balance;
    std::mutex mtx;
    BankAccount(std::string n, int b) : name(std::move(n)), balance(b) {}
};

// Deadlock-free transfer even when called concurrently as transfer(A,B) and transfer(B,A)!
void safe_transfer(BankAccount& from, BankAccount& to, int amount) {
    // 1. defer_lock: wrap both mutexes WITHOUT locking yet
    std::unique_lock<std::mutex> lockA(from.mtx, std::defer_lock);
    std::unique_lock<std::mutex> lockB(to.mtx, std::defer_lock);

    // 2. std::lock: atomically locks both using deadlock-avoidance algorithm!
    std::lock(lockA, lockB);

    from.balance -= amount;
    to.balance += amount;
}

int main() {
    BankAccount alice("Alice", 1000);
    BankAccount bob("Bob", 1000);

    // Opposite lock order (Alice->Bob vs Bob->Alice) — NO AB-BA Deadlock!
    std::thread t1(safe_transfer, std::ref(alice), std::ref(bob), 300);
    std::thread t2(safe_transfer, std::ref(bob), std::ref(alice), 150);
    t1.join();
    t2.join();

    std::cout << "After concurrent bidirectional transfers:\\n";
    std::cout << "  Alice balance = $" << alice.balance << " | Bob balance = $" << bob.balance << "\\n";

    // Variadic std::try_lock(m1, m2): returns -1 when all locks succeed!
    int status = std::try_lock(alice.mtx, bob.mtx);
    std::cout << "Variadic std::try_lock(alice, bob) returned: " << status << " (both locked!)\\n";
    if (status == -1) {
        alice.mtx.unlock();
        bob.mtx.unlock();
    }
}`,
      expectedOutput: `After concurrent bidirectional transfers:
  Alice balance = $850 | Bob balance = $1150
Variadic std::try_lock(alice, bob) returned: -1 (both locked!)`
    },
    {
      id: "condition_variable_even_odd",
      track: "threading",
      title: "12 · CppNuts #4: std::condition_variable — Even-Odd Alternating Threads",
      subtitle: "The classic CppNuts concurrency interview problem: alternate Odd and Even threads strictly using cv.wait().",
      tags: ["std::condition_variable", "Spurious Wakeup Guard", "Even-Odd Threads"],
      code: `#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>

std::mutex mtx;
std::condition_variable cv;
int counter = 1;
const int MAX_COUNT = 10;

void print_odd() {
    while (true) {
        std::unique_lock<std::mutex> ul(mtx);
        cv.wait(ul, [] { return (counter % 2 == 1) || (counter > MAX_COUNT); });
        if (counter > MAX_COUNT) break;
        std::cout << "[Odd  Thread] -> " << counter << "\\n";
        ++counter;
        ul.unlock(); // Unlock before notify_all()!
        cv.notify_all();
    }
}

void print_even() {
    while (true) {
        std::unique_lock<std::mutex> ul(mtx);
        cv.wait(ul, [] { return (counter % 2 == 0) || (counter > MAX_COUNT); });
        if (counter > MAX_COUNT) break;
        std::cout << "[Even Thread] -> " << counter << "\\n";
        ++counter;
        ul.unlock();
        cv.notify_all();
    }
}

int main() {
    std::thread t_odd(print_odd);
    std::thread t_even(print_even);
    t_odd.join();
    t_even.join();
    std::cout << "Completed strict 1..10 alternating handoff!\\n";
}`,
      expectedOutput: `[Odd  Thread] -> 1
[Even Thread] -> 2
[Odd  Thread] -> 3
[Even Thread] -> 4
[Odd  Thread] -> 5
[Even Thread] -> 6
[Odd  Thread] -> 7
[Even Thread] -> 8
[Odd  Thread] -> 9
[Even Thread] -> 10
Completed strict 1..10 alternating handoff!`
    },
    {
      id: "producer_consumer_queue",
      track: "threading",
      title: "13 · CppNuts #5: Bounded Producer-Consumer Queue with Condition Variables",
      subtitle: "Thread-safe bounded ring queue using cv_not_full and cv_not_empty without busy waiting.",
      tags: ["Producer-Consumer", "Bounded Queue", "notify_one()"],
      code: `#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>

class BoundedQueue {
    std::queue<int> q_;
    const std::size_t capacity_;
    std::mutex mtx_;
    std::condition_variable cv_not_full_;
    std::condition_variable cv_not_empty_;

public:
    explicit BoundedQueue(std::size_t cap) : capacity_(cap) {}

    void produce(int item) {
        std::unique_lock<std::mutex> ul(mtx_);
        cv_not_full_.wait(ul, [this] { return q_.size() < capacity_; });
        q_.push(item);
        std::cout << "[Producer] Enqueued " << item << " (size=" << q_.size() << "/" << capacity_ << ")\\n";
        ul.unlock();
        cv_not_empty_.notify_one();
    }

    int consume() {
        std::unique_lock<std::mutex> ul(mtx_);
        cv_not_empty_.wait(ul, [this] { return !q_.empty(); });
        int item = q_.front();
        q_.pop();
        std::cout << "[Consumer] Dequeued " << item << " (size=" << q_.size() << "/" << capacity_ << ")\\n";
        ul.unlock();
        cv_not_full_.notify_one();
        return item;
    }
};

int main() {
    BoundedQueue channel(2);
    std::thread prod([&] {
        for (int v : {10, 20, 30, 40}) channel.produce(v);
    });
    std::thread cons([&] {
        for (int i = 0; i < 4; ++i) channel.consume();
    });
    prod.join();
    cons.join();
}`,
      expectedOutput: `[Producer] Enqueued 10 (size=1/2)
[Producer] Enqueued 20 (size=2/2)
[Consumer] Dequeued 10 (size=1/2)
[Consumer] Dequeued 20 (size=0/2)
[Producer] Enqueued 30 (size=1/2)
[Producer] Enqueued 40 (size=2/2)
[Consumer] Dequeued 30 (size=1/2)
[Consumer] Dequeued 40 (size=0/2)`
    },
    {
      id: "future_promise_async_pool",
      track: "threading",
      title: "14 · CppNuts #6: std::promise/future, std::async (async vs deferred) & Thread Pool",
      subtitle: "Fulfill promises across threads, compare launch::async vs launch::deferred, and dispatch to a Thread Pool.",
      tags: ["std::promise / future", "std::async Policies", "C++20 Thread Pool"],
      code: `#include <iostream>
#include <thread>
#include <future>
#include <mutex>

void compute_odd_sum(std::promise<long long>&& prom, int n) {
    long long sum = 0;
    for (int i = 1; i <= n; i += 2) sum += i;
    prom.set_value(sum); // Signals the associated std::future immediately!
}

int main() {
    // 1. std::promise + std::future
    std::promise<long long> odd_prom;
    std::future<long long> odd_fut = odd_prom.get_future();
    std::thread worker(compute_odd_sum, std::move(odd_prom), 100);
    std::cout << "[promise/future] Odd sum [1..100] = " << odd_fut.get() << "\\n";
    worker.join();

    // 2. std::async: launch::async vs launch::deferred
    auto f_async = std::async(std::launch::async, [] { return 21 * 2; });
    auto f_deferred = std::async(std::launch::deferred, [] { return 100 + 28; });
    std::cout << "[launch::async]    Result = " << f_async.get() << " (ran on worker thread)\\n";
    std::cout << "[launch::deferred] Result = " << f_deferred.get() << " (ran lazily on main thread)\\n";

    // 3. std::packaged_task (Building block of Thread Pools)
    std::packaged_task<int(int, int)> task([](int a, int b) { return a * b; });
    std::future<int> task_fut = task.get_future();
    std::thread pool_worker(std::move(task), 12, 12);
    std::cout << "[packaged_task]    12 * 12 = " << task_fut.get() << "\\n";
    pool_worker.join();
}`,
      expectedOutput: `[promise/future] Odd sum [1..100] = 2500
[launch::async]    Result = 42 (ran on worker thread)
[launch::deferred] Result = 128 (ran lazily on main thread)
[packaged_task]    12 * 12 = 144`
    },
    {
      id: "stl_vector_growth",
      track: "stl",
      title: "15 · STL #1: std::vector Geometric Growth, reserve() & noexcept Move",
      subtitle: "Trace exact capacity doubling steps, pointer addresses, and zero-reallocation reserve().",
      tags: ["std::vector", "Capacity 2x Growth", "emplace_back"],
      code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    std::cout << "sizeof(std::vector<int>) header = " << sizeof(v) << " Bytes (3 pointers)\\n";

    std::size_t prev_cap = v.capacity();
    for (int i = 1; i <= 9; ++i) {
        v.push_back(i * 10);
        if (v.capacity() != prev_cap) {
            std::cout << "  [Realloc] size=" << v.size()
                      << " -> capacity grew from " << prev_cap
                      << " to " << v.capacity() << "\\n";
            prev_cap = v.capacity();
        }
    }

    std::vector<int> fast;
    fast.reserve(100); // Pre-allocate 100 slots in ONE heap call!
    std::cout << "After reserve(100): size=" << fast.size()
              << ", capacity=" << fast.capacity() << "\\n";
}`,
      expectedOutput: `sizeof(std::vector<int>) header = 24 Bytes (3 pointers)
  [Realloc] size=1 -> capacity grew from 0 to 1
  [Realloc] size=2 -> capacity grew from 1 to 2
  [Realloc] size=3 -> capacity grew from 2 to 4
  [Realloc] size=5 -> capacity grew from 4 to 8
  [Realloc] size=9 -> capacity grew from 8 to 16
After reserve(100): size=0, capacity=100`
    },
    {
      id: "stl_unordered_map_symbol",
      track: "stl",
      title: "16 · STL #2: std::unordered_map Compiler Symbol Table & Custom Hash",
      subtitle: "Inspect hash buckets, load factors, O(1) symbol lookups, and custom struct hashing.",
      tags: ["std::unordered_map", "Hash Buckets", "Symbol Table"],
      code: `#include <iostream>
#include <unordered_map>
#include <string>

struct SymbolInfo {
    std::string type;
    int stack_offset;
};

int main() {
    std::unordered_map<std::string, SymbolInfo> symtab;
    symtab.reserve(8);

    symtab.emplace("argc", SymbolInfo{"int", -4});
    symtab.emplace("argv", SymbolInfo{"char**", -16});
    symtab.emplace("vptr", SymbolInfo{"void**", 0});

    std::cout << "Symbol count = " << symtab.size()
              << " | Bucket count = " << symtab.bucket_count() << "\\n";

    // Safe lookup with find() (never inserts accidental defaults!)
    if (auto it = symtab.find("vptr"); it != symtab.end()) {
        std::cout << "Found symbol '" << it->first << "' -> type=" << it->second.type
                  << ", offset=" << it->second.stack_offset
                  << " (in bucket #" << symtab.bucket(it->first) << ")\\n";
    }
}`,
      expectedOutput: `Symbol count = 3 | Bucket count = 11
Found symbol 'vptr' -> type=void**, offset=0 (in bucket #4)`
    },
    {
      id: "stl_map_heap_ranges",
      track: "stl",
      title: "17 · STL #3: std::map Red-Black Tree lower_bound() & Min-Heap Scheduler",
      subtitle: "Combine O(log N) ordered interval lookups in std::map with a Min-Heap priority_queue.",
      tags: ["std::map RB-Tree", "lower_bound()", "std::priority_queue"],
      code: `#include <iostream>
#include <map>
#include <queue>
#include <vector>
#include <functional>

int main() {
    // 1. Ordered Red-Black Tree (std::map) with O(log N) lower_bound
    std::map<int, std::string> addr_symbols = {
        {0x1000, "main()"},
        {0x2000, "Account::withdraw()"},
        {0x3000, "ThreadPool::enqueue()"}
    };

    auto it = addr_symbols.lower_bound(0x1800); // First symbol >= 0x1800
    if (it != addr_symbols.end()) {
        std::cout << "[std::map lower_bound(0x1800)] -> 0x" << std::hex << it->first
                  << std::dec << " : " << it->second << "\\n";
    }

    // 2. Binary Min-Heap Scheduler (std::priority_queue with std::greater)
    std::priority_queue<int, std::vector<int>, std::greater<int>> min_heap;
    for (int latency_us : {45, 12, 88, 5, 29}) min_heap.push(latency_us);

    std::cout << "[Min-Heap Dispatch Order (us)]: ";
    while (!min_heap.empty()) {
        std::cout << min_heap.top() << " ";
        min_heap.pop();
    }
    std::cout << "\\n";
}`,
      expectedOutput: `[std::map lower_bound(0x1800)] -> 0x2000 : Account::withdraw()
[Min-Heap Dispatch Order (us)]: 5 12 29 45 88 `
    }
  ],

  quizQuestions: [
    {
      id: 1,
      topic: "Greedy Alignment & Padding",
      question: "On a 64-bit platform (where char=1B, int=4B, double=8B), what is sizeof(S) for `struct S { char a; double b; int c; char d; };` vs after reordering greedily (`double b; int c; char a; char d;`)?",
      options: [
        "24 bytes poorly aligned vs. 16 bytes greedily aligned",
        "14 bytes for both because modern compilers automatically reorder struct fields",
        "32 bytes poorly aligned vs. 24 bytes greedily aligned",
        "16 bytes poorly aligned vs. 14 bytes greedily aligned"
      ],
      answer: 0,
      explanation: "The C++ standard forbids the compiler from reordering members with the same access specifier. In `{char a; double b; int c; char d;}`, `a` needs 7 bytes of padding before `b` (offset 8), and `d` at offset 20 needs 3 bytes of tail padding so `sizeof(S)` is a multiple of 8 = 24 bytes. Greedy ordering (`double`, `int`, `char`, `char`) packs into 8 + 4 + 1 + 1 + 2(tail) = 16 bytes."
    },
    {
      id: 2,
      topic: "Empty Classes & EBO",
      question: "Why is `sizeof(EmptyClass)` equal to 1 byte in C++, and how can an empty stateless deleter inside `std::unique_ptr` take 0 bytes?",
      options: [
        "EmptyClass has a hidden 1-byte vptr; unique_ptr uses #pragma pack(1)",
        "C++ requires distinct objects to have unique addresses (1 byte minimum), but Empty Base Optimization (EBO) or C++20 `[[no_unique_address]]` elides that byte when used as a base subobject or annotated member",
        "EmptyClass is 1 byte for null-termination; unique_ptr stores the deleter on the heap",
        "EmptyClass is 0 bytes in C++20"
      ],
      answer: 1,
      explanation: "Two distinct objects of the same type must have different memory addresses (`&a != &b`), requiring `sizeof >= 1`. However, the Empty Base Optimization (EBO) and C++20 `[[no_unique_address]]` allow empty base subobjects or annotated members to occupy 0 bytes."
    },
    {
      id: 3,
      topic: "Vtable & Virtual Destructor",
      question: "What happens if you execute `Base* p = new Derived(); delete p;` when `Base` does NOT have a `virtual` destructor?",
      options: [
        "Compilation fails with an error on `delete p`",
        "Only `~Derived()` runs, skipping `~Base()`",
        "Undefined Behavior (typically only `~Base()` runs, leaking all resources in `Derived`)",
        "The runtime automatically checks RTTI and calls `~Derived()` anyway"
      ],
      answer: 2,
      explanation: "Deleting a derived object through a pointer to a base class without a `virtual` destructor is Undefined Behavior per the C++ standard. In practice, static dispatch invokes only `~Base()`, leaking `Derived`'s members."
    },
    {
      id: 4,
      topic: "Virtual Call in Constructor Trap",
      question: "If `Base::Base()` calls a `virtual void init()` function that is overridden in `Derived`, which version of `init()` executes when constructing a `Derived` instance?",
      options: [
        "`Derived::init()` because the dynamic object being created is `Derived`",
        "`Base::init()` because during `Base()` execution, `Derived` members are not yet initialized and `vptr` points to `Base`'s vtable",
        "It throws `std::bad_function_call` at runtime",
        "Both `Base::init()` and `Derived::init()` run sequentially"
      ],
      answer: 1,
      explanation: "While `Base`'s constructor is running, the object's dynamic type is `Base` (`vptr` points to `Base`'s vtable) to prevent `Derived::init()` from accessing uninitialized `Derived` member variables."
    },
    {
      id: 5,
      topic: "Default Arguments on Virtual Functions",
      question: "Given `struct Base { virtual void run(int x = 10); };` and `struct Derived : Base { void run(int x = 99) override; };`, what happens on `Base* p = new Derived(); p->run();`?",
      options: [
        "`Derived::run` executes with `x = 10`",
        "`Derived::run` executes with `x = 99`",
        "`Base::run` executes with `x = 10`",
        "Ambiguous default argument compile error"
      ],
      answer: 0,
      explanation: "Default arguments are resolved STATICALLY at compile time based on the static pointer type (`Base*` -> `10`), while the virtual function target is resolved DYNAMICALLY at runtime via `vptr` (`Derived::run`)."
    },
    {
      id: 6,
      topic: "Value Categories (lvalue / prvalue / xvalue)",
      question: "Which of the following correctly classifies the expressions `\"hello\"`, `++x`, `x++`, and `std::move(x)`?",
      options: [
        "`\"hello\"` is prvalue, `++x` is prvalue, `x++` is lvalue, `std::move(x)` is xvalue",
        "`\"hello\"` is lvalue, `++x` is lvalue, `x++` is prvalue, `std::move(x)` is xvalue",
        "`\"hello\"` is lvalue, `++x` is xvalue, `x++` is prvalue, `std::move(x)` is prvalue",
        "All four are rvalues"
      ],
      answer: 1,
      explanation: "String literals (`const char[N]`) live in `.rodata` and have an address, so they are lvalues! Prefix `++x` increments and returns a reference (`int&` = lvalue). Postfix `x++` returns a temporary copy (`int` = prvalue). `std::move(x)` returns an rvalue reference (`T&&` = xvalue)."
    },
    {
      id: 7,
      topic: "Move Semantics & std::vector",
      question: "Why does `std::vector<T>` fall back to copying elements instead of moving them during capacity reallocation if `T(T&&)` is NOT marked `noexcept`?",
      options: [
        "Because `std::move` requires `noexcept` to compile",
        "To preserve `std::vector::push_back`'s Strong Exception Guarantee: if moving element #5 threw an exception mid-transfer, elements #0-#4 in the old buffer would already be mutated/pilfered and could not be restored",
        "Because the linker strips non-noexcept move constructors",
        "It only happens for polymorphic classes with vtables"
      ],
      answer: 1,
      explanation: "`std::move_if_noexcept` checks if the move constructor is `noexcept`. If moving can throw mid-reallocation, the original vector buffer is already damaged, violating the Strong Exception Guarantee."
    },
    {
      id: 8,
      topic: "Friend Functions & Classes",
      question: "If `class A` declares `friend class B;`, and `class C : public B` inherits from `B`, which statement is true?",
      options: [
        "Both `B` and `C` can access `A`'s private members",
        "`B` can access `A`'s private members, AND `A` can access `B`'s private members",
        "Only `B` can access `A`'s private members; friendship is neither inherited by `C`, nor reciprocal to `A`, nor transitive",
        "`friend` functions have their own `this` pointer"
      ],
      answer: 2,
      explanation: "In C++, friendship is strictly one-way (non-reciprocal), non-inherited (`C` does not become a friend of `A`), and non-transitive."
    },
    {
      id: 9,
      topic: "Diamond Problem & Virtual Inheritance",
      question: "In a diamond hierarchy `Copier : Scanner, Printer` where both `Scanner` and `Printer` inherit `: virtual public PoweredDevice`, which constructor initializes `PoweredDevice` when creating a `Copier`?",
      options: [
        "`Scanner`'s constructor, because it is listed first",
        "Both `Scanner` and `Printer` initialize it sequentially",
        "The most-derived class (`Copier`) initializes the virtual base `PoweredDevice` directly, and before any non-virtual bases",
        "`Printer`'s constructor overwrites `Scanner`'s initialization"
      ],
      answer: 2,
      explanation: "With `virtual` inheritance, the most-derived class being instantiated (`Copier`) is solely responsible for constructing all `virtual` base subobjects first, before any non-virtual base constructors run."
    },
    {
      id: 10,
      topic: "Object Slicing",
      question: "What happens when a `Derived` object is passed by value to `void inspect(Base b)`?",
      options: [
        "`Base`'s copy constructor runs, copying only the `Base` subobject, stripping `Derived` members, and setting `b`'s `vptr` to `Base`'s vtable",
        "`b` retains `Derived`'s `vptr` but loses `Derived`'s data members",
        "A runtime `std::bad_cast` exception is thrown",
        "The compiler converts `Base b` into `const Base& b` automatically"
      ],
      answer: 0,
      explanation: "Passing by value constructs a brand-new `Base` object on the stack via `Base(const Base&)`. Its `vptr` points to `Base`'s vtable and all `Derived`-specific fields are sliced off."
    },
    {
      id: 11,
      topic: "Smart Pointers & Control Blocks",
      question: "What is the key memory difference between `auto p = std::make_shared<Widget>();` and `std::shared_ptr<Widget> p(new Widget());`?",
      options: [
        "`make_shared` makes `sizeof(p)` 8 bytes instead of 16 bytes",
        "`make_shared` allocates `Widget` and the atomic Control Block together in ONE contiguous heap allocation, whereas `shared_ptr(new Widget())` performs TWO separate heap allocations",
        "`make_shared` disables `std::weak_ptr` support",
        "`make_shared` uses non-atomic reference counts"
      ],
      answer: 1,
      explanation: "`std::shared_ptr<T>` is always 16 bytes (object pointer + control block pointer), but `std::make_shared<T>` combines the `T` allocation and the Control Block allocation into a single contiguous heap block."
    },
    {
      id: 12,
      topic: "Member Initializer List Order",
      question: "In `struct Foo { int a; int b; Foo(int x) : b(x), a(b * 2) {} };`, what is the value of `a` after `Foo f(5)`?",
      options: [
        "`10` because `b(x)` is written first in the initializer list",
        "Undefined Behavior (garbage) because `a` is declared before `b` in the struct definition, so `a(b * 2)` runs before `b` is initialized",
        "`0` because members are zero-initialized before the initializer list runs",
        "It fails to compile in C++20"
      ],
      answer: 1,
      explanation: "Class members are ALWAYS initialized in the exact order they are declared in the class definition (`a` then `b`), regardless of the order in the constructor's member initializer list."
    },
    {
      id: 13,
      topic: "Multiple Inheritance Vptrs",
      question: "If `class Media : public Audio, public Video` inherits from two polymorphic base classes (each having virtual methods and one `int`), how many `vptr`s does a `Media` instance contain?",
      options: [
        "Only 1 shared `vptr` at offset 0",
        "2 `vptr`s (one inside the `Audio` subobject at offset 0, and one inside the `Video` subobject at a non-zero offset)",
        "3 `vptr`s (`Audio`, `Video`, and `Media` each get a separate `vptr`)",
        "0 `vptr`s because multiple inheritance uses static dispatch"
      ],
      answer: 1,
      explanation: "`Media` shares its primary `vptr` with its first base class (`Audio` at offset 0) and maintains a secondary `vptr` at the start of the `Video` subobject so a `Video*` pointer works polymorphically."
    },
    {
      id: 14,
      topic: "Reference Collapsing & Perfect Forwarding",
      question: "Inside `template <typename T> void wrapper(T&& arg)`, what is the value category of the named variable `arg` itself, and what happens if the caller passes an `int&` lvalue?",
      options: [
        "`arg` is an rvalue; `T` deduces to `int`",
        "`arg` is always an lvalue (because it has a name and address!); when an `int&` is passed, `T` deduces to `int&` and `T&&` collapses (`int& &&` -> `int&`)",
        "`arg` is an xvalue; `T` deduces to `const int&`",
        "`wrapper` cannot accept lvalues because `T&&` is an rvalue reference"
      ],
      answer: 1,
      explanation: "Any named parameter—even one declared as `T&&` or `int&&`—is an lvalue expression inside the function body! And because `T` is a deduced template parameter, `T&&` is a forwarding reference where passing an lvalue `int&` deduces `T = int&`."
    },
    {
      id: 15,
      topic: "Name Hiding & Overload Resolution",
      question: "If `Base` defines `void log(int)` and `void log(double)`, and `Derived : public Base` defines `void log(std::string)`, what happens when you call `Derived d; d.log(42);` (without `using Base::log;`)?",
      options: [
        "It calls `Base::log(int)` normally",
        "Compile error: `Derived::log(std::string)` hides all functions named `log` in `Base` during name lookup (Name Hiding)",
        "It converts `42` to `\"42\"` and calls `Derived::log`",
        "Runtime segmentation fault"
      ],
      answer: 1,
      explanation: "In C++, name lookup stops as soon as it finds the name `log` in `Derived` scope, BEFORE checking parameter types. Thus `Derived::log(std::string)` hides `Base::log(int)` unless `using Base::log;` is added to `Derived`."
    },
    {
      id: 16,
      track: "threading",
      topic: "std::thread Lifecycle & ~thread()",
      question: "What happens when a `std::thread t(worker);` object goes out of scope and its destructor `~thread()` executes BEFORE either `t.join()` or `t.detach()` is called?",
      options: [
        "The destructor automatically waits for `worker` to finish (`t.join()`)",
        "The destructor automatically detaches the thread into the background (`t.detach()`)",
        "`t.joinable()` is still `true`, so `~thread()` immediately calls `std::terminate()`, crashing the entire program",
        "The OS kills the child thread silently and continues `main()`"
      ],
      answer: 2,
      explanation: "In C++11, if a `std::thread` object is destroyed while `joinable() == true`, its destructor strictly invokes `std::terminate()`. C++20 introduced `std::jthread` specifically to provide RAII auto-join + cooperative `stop_token` cancellation on destruction."
    },
    {
      id: 17,
      track: "threading",
      topic: "Passing References to std::thread",
      question: "Given `void increment(int& x) { ++x; }`, why does `int val = 10; std::thread t(increment, val);` fail to compile or fail to modify `val`?",
      options: [
        "`std::thread` cannot execute functions that return `void`",
        "`std::thread`'s constructor copies all arguments by value into thread-local storage by default (and tries to pass an rvalue copy to `int&`); you must wrap `val` with `std::ref(val)`",
        "References cannot be shared across threads in C++",
        "You must pass `&val` instead of `val` even when the parameter is `int&`"
      ],
      answer: 1,
      explanation: "`std::thread` decays and copies its arguments into internal storage for safety, then invokes the callable with rvalue projections of those stored copies. Since a non-const lvalue reference (`int&`) cannot bind to an rvalue copy, compilation fails unless you pass `std::ref(val)`."
    },
    {
      id: 18,
      track: "threading",
      topic: "Variadic std::try_lock(m1, m2, m3)",
      question: "What does the standard function `int res = std::try_lock(m1, m2, m3);` do if `m1.try_lock()` succeeds, `m2.try_lock()` fails, and `m3` has not been tried yet?",
      options: [
        "It keeps `m1` locked, skips `m2`, tries `m3`, and returns `1`",
        "It blocks on `m2` until `m2` becomes available",
        "It immediately unlocks `m1` (all-or-nothing rollback) and returns `1` (the 0-based index of the mutex that failed to lock); if all succeed, it returns `-1`",
        "It throws `std::system_error`"
      ],
      answer: 2,
      explanation: "As emphasized in CppNuts, variadic `std::try_lock(m1, m2, ..., mn)` returns `-1` when ALL mutexes are locked. If any mutex fails at 0-based index `k`, it automatically unlocks all previously acquired mutexes (`0 .. k-1`) and returns `k`."
    },
    {
      id: 19,
      track: "threading",
      topic: "std::recursive_mutex vs std::mutex",
      question: "What happens if a thread that ALREADY holds a standard `std::mutex m` calls `m.lock()` a second time (e.g., inside a recursive function), and how does `std::recursive_mutex` solve this?",
      options: [
        "`std::mutex` ignores the second `lock()` call; `std::recursive_mutex` throws an exception",
        "`std::mutex` causes Undefined Behavior / immediate self-deadlock; `std::recursive_mutex` allows the SAME owning thread to lock it `N` times, requiring `N` matching `unlock()` calls before releasing ownership",
        "`std::recursive_mutex` automatically unlocks after the first return statement",
        "Both behave identically in C++20"
      ],
      answer: 1,
      explanation: "A non-recursive `std::mutex` cannot be locked twice by the same thread without unlocking first (it deadlocks waiting for itself). `std::recursive_mutex` records the owning `thread::id` and increments an ownership count on each re-entrant `lock()`, releasing the lock only when `unlock()` has been called an equal number of times."
    },
    {
      id: 20,
      track: "threading",
      topic: "std::unique_lock Ownership Tags",
      question: "Which correctly describes `std::defer_lock`, `std::try_to_lock`, and `std::adopt_lock` when constructing `std::unique_lock<std::mutex> ul(mtx, tag)`?",
      options: [
        "`defer_lock` locks lazily on destruction; `try_to_lock` blocks for 10ms; `adopt_lock` clones the mutex",
        "`defer_lock` leaves `mtx` unlocked on construction so you can lock it later; `try_to_lock` calls non-blocking `mtx.try_lock()`; `adopt_lock` assumes the current thread ALREADY locked `mtx` and takes RAII unlock ownership",
        "`adopt_lock` calls `mtx.lock()` immediately; `defer_lock` calls `mtx.try_lock()`",
        "All three tags can also be used with `std::lock_guard`"
      ],
      answer: 1,
      explanation: "`std::lock_guard` only supports `std::adopt_lock`. `std::unique_lock` supports all three: `defer_lock` (do not lock yet), `try_to_lock` (attempt non-blocking `try_lock()`, check `ul.owns_lock()`), and `adopt_lock` (manage an already-locked mutex)."
    },
    {
      id: 21,
      track: "threading",
      topic: "AB-BA Deadlock & std::lock / std::scoped_lock",
      question: "Thread 1 runs `transfer(accA, accB)` and Thread 2 simultaneously runs `transfer(accB, accA)`. How do `std::lock(l1, l2)` or C++17 `std::scoped_lock lk(accA.mtx, accB.mtx)` prevent AB-BA deadlock?",
      options: [
        "They disable OS thread preemption until `transfer()` finishes",
        "They use a deadlock-avoidance try-and-back-off algorithm to acquire both mutexes atomically regardless of argument order",
        "They merge `accA.mtx` and `accB.mtx` into a single global mutex",
        "They spin without ever unlocking either mutex"
      ],
      answer: 1,
      explanation: "`std::lock(m1, m2)` (and C++17 `std::scoped_lock(m1, m2)`) uses a try-and-back-off lock acquisition algorithm: if it locks the first mutex (`m1`) and `m2.try_lock()` fails, it unlocks `m1` before blocking on `m2`, breaking the Hold-and-Wait condition required for AB-BA deadlock."
    },
    {
      id: 22,
      track: "threading",
      topic: "std::condition_variable & Spurious Wakeups",
      question: "Why does `cv.wait(ul, [&]{ return !queue.empty(); })` require a `std::unique_lock<std::mutex>` (not `lock_guard`) AND a boolean predicate loop?",
      options: [
        "Because `condition_variable` copies the lock into the kernel",
        "Because `wait()` must atomically UNLOCK the mutex before sleeping and RE-LOCK it upon waking (which `lock_guard` cannot do), and the predicate loop guards against OS spurious wakeups and stolen wakeups",
        "Because `lock_guard` only works with `std::timed_mutex`",
        "The predicate is only checked before going to sleep, never after waking up"
      ],
      answer: 1,
      explanation: "`cv.wait(ul, pred)` is equivalent to `while (!pred()) cv.wait(ul);`. While sleeping, `wait()` must unlock `ul` so a producer thread can acquire the mutex and mutate the queue; when notified (or spuriously woken by the OS), `wait()` re-acquires `ul` and re-checks `pred()`."
    },
    {
      id: 23,
      track: "threading",
      topic: "std::async Launch Policies (async vs deferred)",
      question: "What is the exact difference between `std::async(std::launch::async, fn)` and `std::async(std::launch::deferred, fn)`?",
      options: [
        "`launch::async` runs on the main thread; `launch::deferred` runs on a GPU thread",
        "`launch::async` starts `fn` eagerly on a separate thread of execution; `launch::deferred` does NOT spawn a thread—it evaluates `fn` lazily and synchronously on the thread that first calls `.get()` or `.wait()`",
        "`launch::deferred` runs `fn` after `main()` returns",
        "Both always spawn a new OS thread immediately"
      ],
      answer: 1,
      explanation: "`std::launch::async` guarantees asynchronous execution on another thread, whereas `std::launch::deferred` delays execution until `future.get()` or `future.wait()` is called, executing `fn` synchronously on the caller's thread."
    },
    {
      id: 24,
      track: "threading",
      topic: "std::promise & std::future Channel",
      question: "How many times can you call `.get()` on a `std::future<T>` associated with a `std::promise<T>`, and what happens if multiple threads need to read the same asynchronous result?",
      options: [
        "Unlimited times; `.get()` returns a `const T&`",
        "Exactly ONCE (`.get()` moves the result out of the shared state and makes `fut.valid() == false`); to allow multiple threads to read the result, convert it to `std::shared_future<T>` via `fut.share()`",
        "Twice: once in the worker thread and once in `main()`",
        "Calling `.get()` resets the `std::promise` for reuse"
      ],
      answer: 1,
      explanation: "`std::future<T>::get()` moves the stored value out of the shared state, leaving `valid() == false` (a second `.get()` is Undefined Behavior or throws `std::future_error`). `std::shared_future<T>` allows multiple threads to copy/read the shared result safely."
    },
    {
      id: 25,
      track: "threading",
      topic: "std::atomic vs Mutex & Lock-Free CAS",
      question: "Given `std::atomic<int> counter{10};`, why is `if (counter > 0) counter -= 1;` NOT thread-safe across multiple threads even though `counter` is `std::atomic`?",
      options: [
        "Because `std::atomic<int>` does not support `operator-=`",
        "Because reading `counter > 0` (`load`) and subtracting `1` (`fetch_sub`) are two separate atomic steps—another thread can modify `counter` in between (TOCTOU race); atomic conditional updates require a `compare_exchange_weak` CAS loop",
        "Because `std::atomic` only works on 64-bit integers",
        "It IS completely thread-safe and free of race conditions"
      ],
      answer: 1,
      explanation: "Each individual operation on `std::atomic<int>` (`load()` and `fetch_sub()`) is atomic, but the gap between the `if (counter > 0)` check and the `counter -= 1` update is a classic Time-Of-Check to Time-Of-Use (TOCTOU) race. A Compare-And-Swap (`compare_exchange_weak`) loop is required to make the check-and-decrement a single atomic transaction."
    },
    {
      id: 26,
      track: "stl",
      topic: "std::vector Reallocation & Iterator Invalidation",
      question: "When `std::vector<int> v` has `size() == 4` and `capacity() == 4`, what happens to existing pointers (`int* p = &v[0]`) and iterators when `v.push_back(50)` executes?",
      options: [
        "Only the `end()` iterator is invalidated; `p` remains valid",
        "All iterators, pointers, and references to elements in `v` are invalidated because `v` allocates a new 2x buffer on the heap and frees the old array",
        "`v` links a second 4-element chunk without moving existing elements",
        "`push_back` throws `std::length_error` unless `reserve()` was called"
      ],
      answer: 1,
      explanation: "When `size() == capacity()`, `std::vector` must allocate a brand-new contiguous heap block (typically doubling capacity to 8), move/copy the 4 elements over, and deallocate the old block—invalidating every pointer, reference, and iterator into the old buffer."
    },
    {
      id: 27,
      track: "stl",
      topic: "std::unordered_map operator[] Trap",
      question: "What happens when you check `if (symtab[\"missing_key\"] == 0)` on a `std::unordered_map<std::string, int> symtab` that does NOT contain `\"missing_key\"`?",
      options: [
        "It throws `std::out_of_range`",
        "It returns `false` without modifying `symtab`",
        "It silently INSERTS `{\"missing_key\", 0}` into `symtab`, increments `symtab.size()`, and may trigger a `rehash()` that invalidates all iterators!",
        "It fails to compile"
      ],
      answer: 2,
      explanation: "`std::unordered_map::operator[]` is a mutating lookup-or-insert operator: if the key is absent, it default-constructs the mapped value (`0`) and inserts the node. Always use `find()` or C++20 `contains()` for non-mutating queries."
    },
    {
      id: 28,
      track: "stl",
      topic: "std::map::lower_bound vs std::lower_bound",
      question: "Why should you call `my_map.lower_bound(key)` instead of `std::lower_bound(my_map.begin(), my_map.end(), val)` on a `std::map<int, int>`?",
      options: [
        "`std::lower_bound` does not compile on `std::map`",
        "`my_map.lower_bound(key)` traverses the Red-Black Tree pointers in `O(log N)` time, whereas `std::lower_bound` performs `O(N)` linear iterator increments because `std::map` iterators are Bidirectional, not Random-Access",
        "Both run in `O(1)` time",
        "`my_map.lower_bound(key)` rebalances the tree"
      ],
      answer: 1,
      explanation: "Although `std::lower_bound` does `O(log N)` comparisons, advancing a bidirectional iterator (`std::advance`) across a node-based Red-Black tree takes `O(N)` pointer hops. The member function `map::lower_bound` walks down from the root in `O(log N)` steps."
    },
    {
      id: 29,
      track: "stl",
      topic: "std::deque vs std::vector Memory Layout",
      question: "How does `std::deque<T>` support `O(1)` `push_front()` AND `O(1)` `push_back()` without invalidating pointers or references to existing elements?",
      options: [
        "It uses a doubly-linked list where every element is a separate heap node",
        "It uses a central map array of pointers to fixed-size contiguous memory chunks, allocating new chunks at the front or back as needed",
        "It leaves 50% empty space at the start of a single contiguous array",
        "It uses `realloc()` in the OS kernel"
      ],
      answer: 1,
      explanation: "`std::deque` is a segmented array: a central array of pointers ('map') points to fixed-size contiguous blocks. Growing at the front or back simply allocates a new block and hooks it into the map without moving existing elements."
    },
    {
      id: 30,
      track: "stl",
      topic: "reserve() vs resize() on std::vector",
      question: "After executing `std::vector<int> v; v.reserve(50);`, what are `v.size()` and `v.capacity()`, and is `v[0] = 10;` valid?",
      options: [
        "`size() == 50`, `capacity() >= 50`, and `v[0] = 10` is valid",
        "`size() == 0`, `capacity() >= 50`, and accessing `v[0]` is Undefined Behavior (out-of-bounds of `size()`) because no elements have been constructed yet",
        "`size() == 50`, `capacity() == 0`",
        "`reserve(50)` zero-initializes 50 integers"
      ],
      answer: 1,
      explanation: "`reserve(50)` only allocates raw uninitialized heap storage for at least 50 elements while keeping `size() == 0`. Elements must still be constructed via `push_back()`, `emplace_back()`, or `resize()`."
    }
  ]
};
