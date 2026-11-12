// ============================================================================
// LAB 08: CppNuts Threading #2 — Mutexes, try_lock, timed/recursive_mutex,
//         lock_guard vs unique_lock vs scoped_lock & Deadlock Avoidance
// Part of CppOOPTopics — C++ OOP, Memory & Multithreading Lab
// Compile: clang++ -std=c++20 -O2 -pthread lab08_mutex_lock_types_deadlock.cpp -o lab08
// ============================================================================

#include <chrono>
#include <iostream>
#include <mutex>
#include <thread>

using namespace std::chrono_literals;

// 1. RACE CONDITION vs MUTEX PROTECTION & TRY_LOCK
int shared_counter = 0;
std::mutex counter_mtx;

void safeIncrement(int iterations) {
    for (int i = 0; i < iterations; ++i) {
        std::lock_guard<std::mutex> guard(counter_mtx);
        ++shared_counter;
    }
}

// 2. RECURSIVE_MUTEX (Allows the SAME thread to lock the mutex multiple times)
class RecursiveLedger {
    std::recursive_mutex rmtx_;
    int balance_ = 1000;
public:
    void transferWithBonus(int steps, int amount) {
        if (steps <= 0) return;
        std::lock_guard<std::recursive_mutex> lock(rmtx_); // Locks at depth `steps`
        balance_ += amount;
        std::cout << "  [recursive_mutex] Depth " << steps << " -> balance = $" << balance_ << "\n";
        transferWithBonus(steps - 1, amount); // Re-locks same rmtx_ on same thread without deadlock!
    }
};

// 3. TIMED_MUTEX (try_lock_for / try_lock_until)
std::timed_mutex tmtx;

void timedWorker(int id) {
    if (tmtx.try_lock_for(20ms)) {
        std::cout << "  [timed_mutex] Thread " << id << " acquired lock within timeout!\n";
        std::this_thread::sleep_for(5ms);
        tmtx.unlock();
    } else {
        std::cout << "  [timed_mutex] Thread " << id << " timed out waiting for lock.\n";
    }
}

// 4. UNIQUE_LOCK STRATEGIES (defer_lock, try_to_lock, adopt_lock) & DEADLOCK AVOIDANCE
std::mutex resource_A;
std::mutex resource_B;

void deadlockFreeTransfer(const char* worker_name, std::mutex& first, std::mutex& second) {
    // Classic Deadlock happens if Thread 1 locks (A then B) while Thread 2 locks (B then A).
    // Solution 1 (C++11): std::unique_lock with std::defer_lock + std::lock(ul1, ul2)
    // Solution 2 (C++17): std::scoped_lock lock(first, second);
    std::unique_lock<std::mutex> lock1(first, std::defer_lock);  // Does NOT lock yet!
    std::unique_lock<std::mutex> lock2(second, std::defer_lock); // Does NOT lock yet!

    // std::lock uses a deadlock-avoidance try-and-backoff algorithm to lock both atomically!
    std::lock(lock1, lock2);
    std::cout << "  [Deadlock-Free] " << worker_name << " locked both mutexes safely via std::lock + defer_lock\n";
}

// 5. STD::TRY_LOCK(m1, m2) (Global variadic non-blocking lock)
void testVariadicTryLock() {
    std::unique_lock<std::mutex> l1(resource_A, std::defer_lock);
    std::unique_lock<std::mutex> l2(resource_B, std::defer_lock);
    // Returns -1 if ALL locks succeeded, or 0-based index of failed lock!
    int failed_idx = std::try_lock(l1, l2);
    if (failed_idx == -1) {
        std::cout << "  [std::try_lock(m1, m2)] Successfully locked both mutexes (returned -1)\n";
    }
}

int main() {
    std::cout << "=== LAB 08: MUTEXES, TIMED/RECURSIVE MUTEX, UNIQUE_LOCK & DEADLOCK ===\n\n";

    std::cout << "[1] Protecting Critical Section with std::lock_guard:\n";
    std::thread t1(safeIncrement, 10000);
    std::thread t2(safeIncrement, 10000);
    t1.join();
    t2.join();
    std::cout << "  Final shared_counter = " << shared_counter << " (Expected: 20000, Zero Race!)\n\n";

    std::cout << "[2] std::recursive_mutex in Recursive Function:\n";
    RecursiveLedger ledger;
    ledger.transferWithBonus(3, 50);

    std::cout << "\n[3] std::timed_mutex (try_lock_for):\n";
    std::thread tw1(timedWorker, 1);
    std::thread tw2(timedWorker, 2);
    tw1.join();
    tw2.join();

    std::cout << "\n[4] Avoiding AB-BA Deadlock with std::unique_lock(defer_lock) + std::lock:\n";
    std::thread d1(deadlockFreeTransfer, "Thread-AB", std::ref(resource_A), std::ref(resource_B));
    std::thread d2(deadlockFreeTransfer, "Thread-BA", std::ref(resource_B), std::ref(resource_A));
    d1.join();
    d2.join();

    std::cout << "\n[5] Variadic std::try_lock(m1, m2):\n";
    testVariadicTryLock();
    return 0;
}
