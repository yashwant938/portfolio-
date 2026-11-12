// ============================================================================
// CppOOPTopics — Complete Dataset: 12 Concept Slides, 8 Live C++20 Demos, 15 Quiz Items
// Mirrors the architecture of CompilerCppTopics for Complete C++ OOP Mastery
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
    }
  ]
};
