// ============================================================================
// LAB 03: Value Categories (lvalue/prvalue/xvalue), Move Semantics & Rule of 5
// Part of CppOOPTopics — Complete C++ OOP & Memory Internals Lab
// Compile: clang++ -std=c++20 -O2 lab03_lvalue_rvalue_move_rule_of_5.cpp -o lab03
// ============================================================================

#include <algorithm>
#include <cstddef>
#include <iostream>
#include <type_traits>
#include <utility>
#include <vector>

// 1. COMPILE-TIME VALUE CATEGORY DETECTOR MACRO
// - decltype((expr)) is T&  if expr is an lvalue
// - decltype((expr)) is T&& if expr is an xvalue
// - decltype((expr)) is T   if expr is a prvalue
template <typename T>
constexpr const char* classify_value_category() {
    if constexpr (std::is_lvalue_reference_v<T>) return "lvalue (has identity, cannot be moved)";
    else if constexpr (std::is_rvalue_reference_v<T>) return "xvalue (eXpiring value: has identity, can be moved)";
    else return "prvalue (pure rvalue: temporary, no identity)";
}
#define VALUE_CATEGORY(expr) classify_value_category<decltype((expr))>()

// 2. RULE OF 5: Complete Resource-Managing Telemetry Buffer
class TelemetryBuffer {
    std::size_t size_ = 0;
    int* data_ = nullptr;

public:
    inline static int copies = 0;
    inline static int moves = 0;

    explicit TelemetryBuffer(std::size_t n = 0)
        : size_(n), data_(n ? new int[n]{} : nullptr) {}

    // [1] Destructor
    ~TelemetryBuffer() { delete[] data_; }

    // [2] Copy Constructor (Deep Copy - O(N))
    TelemetryBuffer(const TelemetryBuffer& other)
        : size_(other.size_), data_(other.size_ ? new int[other.size_] : nullptr) {
        ++copies;
        std::copy(other.data_, other.data_ + size_, data_);
        std::cout << "  [Copy Ctor] Deep copied " << size_ << " ints\n";
    }

    // [3] Move Constructor (Pilfer pointer in O(1))
    // CRITICAL: Must be `noexcept` so std::vector moves instead of copying on resize!
    TelemetryBuffer(TelemetryBuffer&& other) noexcept
        : size_(std::exchange(other.size_, 0)),
          data_(std::exchange(other.data_, nullptr)) {
        ++moves;
        std::cout << "  [Move Ctor] Stole buffer of " << size_ << " ints (O(1) pointer swap)\n";
    }

    // [4] Copy Assignment
    TelemetryBuffer& operator=(const TelemetryBuffer& other) {
        if (this != &other) {
            TelemetryBuffer temp(other);
            swap(*this, temp);
        }
        return *this;
    }

    // [5] Move Assignment
    TelemetryBuffer& operator=(TelemetryBuffer&& other) noexcept {
        if (this != &other) {
            delete[] data_;
            size_ = std::exchange(other.size_, 0);
            data_ = std::exchange(other.data_, nullptr);
            ++moves;
        }
        return *this;
    }

    friend void swap(TelemetryBuffer& a, TelemetryBuffer& b) noexcept {
        using std::swap;
        swap(a.size_, b.size_);
        swap(a.data_, b.data_);
    }

    std::size_t size() const { return size_; }
};

// 3. PERFECT FORWARDING & REFERENCE COLLAPSING:
// T&  + &  -> T&
// T&  + && -> T&
// T&& + &  -> T&
// T&& + && -> T&&
void target(const int&) { std::cout << "  -> Bound to const int& (lvalue overload)\n"; }
void target(int&&)      { std::cout << "  -> Bound to int&& (rvalue overload)\n"; }

template <typename T>
void relay_with_forward(T&& arg) {
    // Remember: Inside this function, `arg` itself has a name, so `arg` is an LVALUE!
    // std::forward<T>(arg) casts back to rvalue ONLY if T was deduced as non-reference.
    target(std::forward<T>(arg));
}

int main() {
    std::cout << "=== LAB 03: VALUE CATEGORIES, MOVE SEMANTICS & RULE OF 5 ===\n\n";

    int x = 42;
    std::cout << "Expression `x`            : " << VALUE_CATEGORY(x) << "\n";
    std::cout << "Expression `42`           : " << VALUE_CATEGORY(42) << "\n";
    std::cout << "Expression `x + 1`        : " << VALUE_CATEGORY(x + 1) << "\n";
    std::cout << "Expression `++x`          : " << VALUE_CATEGORY(++x) << "\n";
    std::cout << "Expression `x++`          : " << VALUE_CATEGORY(x++) << "\n";
    std::cout << "Expression `\"literal\"`    : " << VALUE_CATEGORY("literal") << "\n";
    std::cout << "Expression `std::move(x)` : " << VALUE_CATEGORY(std::move(x)) << "\n\n";

    std::cout << "Testing Perfect Forwarding:\n";
    relay_with_forward(x);   // Passes lvalue -> calls target(const int&)
    relay_with_forward(999); // Passes rvalue -> calls target(int&&)

    std::cout << "\nTesting std::vector Reallocation with noexcept Move Constructor:\n";
    std::vector<TelemetryBuffer> vec;
    vec.push_back(TelemetryBuffer(100));
    vec.push_back(TelemetryBuffer(200)); // Triggers vector growth -> uses noexcept Move!
    std::cout << "Total Copies: " << TelemetryBuffer::copies
              << " | Total Moves: " << TelemetryBuffer::moves << "\n";
    return 0;
}
