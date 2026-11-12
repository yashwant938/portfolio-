// ============================================================================
// LAB 06: Smart Pointer Internals, Spaceship (<=>), Functors, CRTP & NVI Idiom
// Part of CppOOPTopics — Complete C++ OOP & Memory Internals Lab
// Compile: clang++ -std=c++20 -O2 lab06_smart_pointers_operator_overloading_idioms.cpp -o lab06
// ============================================================================

#include <atomic>
#include <compare>
#include <iostream>
#include <memory>
#include <string>
#include <utility>

// 1. CUSTOM SHARED_PTR IMPLEMENTATION (Understanding the Control Block)
template <typename T>
class MiniSharedPtr {
    struct ControlBlock {
        std::atomic<std::size_t> strong_count{1};
    };

    T* ptr_ = nullptr;
    ControlBlock* cb_ = nullptr;

    void release() noexcept {
        if (cb_ && cb_->strong_count.fetch_sub(1, std::memory_order_acq_rel) == 1) {
            delete ptr_;
            delete cb_;
            std::cout << "  [MiniSharedPtr] strong_count hit 0 -> freed object & control block!\n";
        }
    }

public:
    explicit MiniSharedPtr(T* raw = nullptr)
        : ptr_(raw), cb_(raw ? new ControlBlock{} : nullptr) {}

    ~MiniSharedPtr() { release(); }

    // Copy Constructor increments atomic ref count
    MiniSharedPtr(const MiniSharedPtr& other) noexcept : ptr_(other.ptr_), cb_(other.cb_) {
        if (cb_) cb_->strong_count.fetch_add(1, std::memory_order_relaxed);
    }

    // Move Constructor transfers ownership with ZERO atomic operations!
    MiniSharedPtr(MiniSharedPtr&& other) noexcept
        : ptr_(std::exchange(other.ptr_, nullptr)),
          cb_(std::exchange(other.cb_, nullptr)) {}

    MiniSharedPtr& operator=(MiniSharedPtr other) noexcept {
        std::swap(ptr_, other.ptr_);
        std::swap(cb_, other.cb_);
        return *this;
    }

    std::size_t use_count() const noexcept { return cb_ ? cb_->strong_count.load() : 0; }
    T& operator*() const noexcept { return *ptr_; }
    T* operator->() const noexcept { return ptr_; }
};

// 2. BREAKING CYCLIC REFERENCES WITH std::weak_ptr
struct GraphNode {
    std::string name;
    std::shared_ptr<GraphNode> next; // Strong ownership forward
    std::weak_ptr<GraphNode> prev;   // Weak non-owning back-pointer prevents memory leak!

    explicit GraphNode(std::string n) : name(std::move(n)) {}
    ~GraphNode() { std::cout << "  [~GraphNode] Destroyed node '" << name << "' cleanly\n"; }
};

// 3. C++20 THREE-WAY SPACESHIP OPERATOR (<=>) & FUNCTOR (`operator()`)
class VersionTag {
    int major_, minor_, patch_;
public:
    constexpr VersionTag(int maj, int min, int pat)
        : major_(maj), minor_(min), patch_(pat) {}

    // Defaulted `<=>` automatically synthesizes ==, !=, <, <=, >, >= in one line!
    auto operator<=>(const VersionTag&) const = default;

    friend std::ostream& operator<<(std::ostream& os, const VersionTag& v) {
        return os << "v" << v.major_ << "." << v.minor_ << "." << v.patch_;
    }
};

// 4. NVI (NON-VIRTUAL INTERFACE) IDIOM: Public non-virtual wrapper + Private virtual hook
class TransactionTask {
public:
    virtual ~TransactionTask() = default;

    // Public Non-Virtual Interface enforces pre/post-conditions around every execution!
    void execute() const {
        std::cout << "  [NVI Pre-Hook] Acquiring audit lock...\n";
        doExecute(); // Dispatches to private virtual override in Derived!
        std::cout << "  [NVI Post-Hook] Releasing audit lock & committing log.\n";
    }

private:
    virtual void doExecute() const = 0; // Yes! Private virtual functions are valid and idiomatic!
};

class WireTransfer final : public TransactionTask {
    void doExecute() const override {
        std::cout << "  [WireTransfer::doExecute] Executing SWIFT settlement.\n";
    }
};

int main() {
    std::cout << "=== LAB 06: SMART POINTER INTERNALS, <==> OPERATOR, WEAK_PTR & NVI ===\n\n";

    std::cout << "[1] Custom MiniSharedPtr Control Block Lifecycle:\n";
    {
        MiniSharedPtr<int> p1(new int(42));
        std::cout << "  After p1 init       : use_count = " << p1.use_count() << "\n";
        {
            MiniSharedPtr<int> p2 = p1; // Copy increments atomic counter
            std::cout << "  After p2 copy       : use_count = " << p1.use_count() << "\n";
            MiniSharedPtr<int> p3 = std::move(p2); // Move transfers ownership (count stays 2!)
            std::cout << "  After p3 move       : use_count = " << p1.use_count() << "\n";
        }
        std::cout << "  After inner scope   : use_count = " << p1.use_count() << "\n";
    }

    std::cout << "\n[2] Breaking Doubly-Linked Cycle with std::weak_ptr:\n";
    {
        auto n1 = std::make_shared<GraphNode>("Alpha");
        auto n2 = std::make_shared<GraphNode>("Beta");
        n1->next = n2;
        n2->prev = n1; // weak_ptr does NOT increment n1's strong_count!
        std::cout << "  n1 strong count = " << n1.use_count()
                  << " | n2 strong count = " << n2.use_count() << "\n";
    }

    std::cout << "\n[3] C++20 Spaceship Operator (<=>):\n";
    constexpr VersionTag v1(2, 4, 0), v2(2, 10, 1);
    static_assert(v1 < v2 && v2 > v1 && v1 != v2);
    std::cout << "  Compared at compile time: " << v1 << " < " << v2 << " is TRUE\n";

    std::cout << "\n[4] Non-Virtual Interface (NVI) Idiom (Private Virtual Hook):\n";
    WireTransfer wt;
    wt.execute();
    return 0;
}
