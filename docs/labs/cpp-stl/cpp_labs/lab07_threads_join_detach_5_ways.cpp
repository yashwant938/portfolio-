// ============================================================================
// LAB 07: CppNuts Threading #1 — 5 Ways to Create Threads, join/detach & jthread
// Part of CppOOPTopics — C++ OOP, Memory & Multithreading Lab
// Compile: clang++ -std=c++20 -O2 -pthread lab07_threads_join_detach_5_ways.cpp -o lab07
// ============================================================================

#include <chrono>
#include <iostream>
#include <thread>

// [Way 1] Free Function Pointer
void freeFunctionWorker(int id, int iterations) {
    std::cout << "  [1. Function Pointer] Worker #" << id
              << " running " << iterations << " iterations\n";
}

// [Way 3] Functor (Function Object overloading operator())
struct FunctorWorker {
    void operator()(const char* task_name) const {
        std::cout << "  [3. Functor Object]   Executing task: " << task_name << "\n";
    }
};

// [Way 4 & 5] Class with Non-Static and Static Member Functions
class EngineController {
public:
    void nonStaticCalibrate(int rpm) {
        std::cout << "  [4. Non-Static Method] Calibrating engine to " << rpm << " RPM (this=" << this << ")\n";
    }

    static void staticDiagnostics(const char* subsystem) {
        std::cout << "  [5. Static Method]     Running diagnostics on " << subsystem << "\n";
    }
};

// RAII ThreadGuard (Pre-C++20 pattern before std::jthread)
class ScopedThreadGuard {
    std::thread t_;
public:
    explicit ScopedThreadGuard(std::thread t) : t_(std::move(t)) {}
    ~ScopedThreadGuard() {
        // Always check joinable() before join()! Calling join() twice throws std::system_error!
        if (t_.joinable()) {
            t_.join();
        }
    }
    ScopedThreadGuard(const ScopedThreadGuard&) = delete;
    ScopedThreadGuard& operator=(const ScopedThreadGuard&) = delete;
};

int main() {
    std::cout << "=== LAB 07: 5 WAYS TO CREATE THREADS, JOIN/DETACH & STD::JTHREAD ===\n\n";

    // 1. Function Pointer
    std::thread t1(freeFunctionWorker, 101, 5);

    // 2. Lambda Expression
    std::thread t2([](int multiplier) {
        std::cout << "  [2. Lambda Function]   Computed 21 * " << multiplier
                  << " = " << (21 * multiplier) << "\n";
    }, 2);

    // 3. Functor (Note: pass FunctorWorker{} cleanly)
    std::thread t3(FunctorWorker{}, "TelemetryCompression");

    // 4. Non-Static Member Function (Requires &ClassName::method AND object pointer/ref!)
    EngineController ctrl;
    std::thread t4(&EngineController::nonStaticCalibrate, &ctrl, 6500);

    // 5. Static Member Function (No object instance pointer needed!)
    std::thread t5(&EngineController::staticDiagnostics, "FuelInjection");

    // Safe joining with joinable() verification
    for (std::thread* tp : {&t1, &t2, &t3, &t4, &t5}) {
        if (tp->joinable()) {
            tp->join();
        }
    }
    std::cout << "\nAll 5 threads joined cleanly (t1.joinable() is now "
              << std::boolalpha << t1.joinable() << ").\n\n";

    // 6. C++20 std::jthread with Cooperative Cancellation (std::stop_token)
    std::cout << "Testing C++20 std::jthread (Auto-join + stop_token):\n";
    {
        std::jthread jt([](std::stop_token stoken) {
            int step = 0;
            while (!stoken.stop_requested() && step < 3) {
                std::cout << "  [jthread] Heartbeat #" << ++step << "\n";
            }
            std::cout << "  [jthread] Exiting cleanly on scope exit.\n";
        });
    } // jt automatically requests stop and joins here!
    return 0;
}
