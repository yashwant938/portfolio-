// ============================================================================
// LAB 10: std::future & std::promise, std::async (async vs deferred),
//         std::packaged_task, std::call_once, std::atomic, std::shared_mutex,
//         C++20 std::counting_semaphore & Production Thread Pool
//         (CppNuts C++ Multithreading Series — Complete Implementation)
// ============================================================================
// Compile: g++ -std=c++20 -O2 -pthread lab10_future_promise_async_threadpool.cpp -o lab10
// ============================================================================

#include <iostream>
#include <thread>
#include <future>
#include <mutex>
#include <shared_mutex>
#include <condition_variable>
#include <atomic>
#include <semaphore>
#include <latch>
#include <queue>
#include <vector>
#include <functional>

using ull = unsigned long long;

// ============================================================================
// PART 1: std::promise & std::future — Returning Values from Worker Threads
// ============================================================================
void sum_odd_range(std::promise<ull>&& odd_sum_promise, ull start, ull end) {
    ull sum = 0;
    for (ull i = start; i <= end; ++i) {
        if (i & 1ULL) sum += i;
    }
    // Fulfill the promise -> immediately unblocks future.get() in the waiting thread!
    odd_sum_promise.set_value(sum);
}

// ============================================================================
// PART 2: std::async — std::launch::async vs std::launch::deferred
// ============================================================================
// - std::launch::async    : Spawns an asynchronous task immediately on a worker thread.
// - std::launch::deferred : Lazy evaluation! Does NOT create a thread; runs synchronously
//                           on the calling thread only when .get() or .wait() is invoked.
ull compute_squares_sum(ull n, const char* policy_label) {
    std::cout << "  [" << policy_label << "] Running on thread ID: "
              << std::this_thread::get_id() << "\n";
    ull total = 0;
    for (ull i = 1; i <= n; ++i) total += i * i;
    return total;
}

// ============================================================================
// PART 3: std::call_once & std::once_flag (Thread-Safe Lazy Initialization)
// ============================================================================
class DatabaseConnectionPool {
    static std::once_flag init_flag_;
    static int init_count_;
public:
    static void connect() {
        std::call_once(init_flag_, [] {
            ++init_count_;
            std::cout << "  [std::call_once] Initializing DB pool (executed ONCE across all threads!)\n";
        });
    }
    static int get_init_count() { return init_count_; }
};
std::once_flag DatabaseConnectionPool::init_flag_;
int DatabaseConnectionPool::init_count_ = 0;

// ============================================================================
// PART 4: std::shared_mutex (Reader-Writer Lock: shared_lock vs unique_lock)
// ============================================================================
class ThreadSafeConfigCache {
    mutable std::shared_mutex rw_mtx_;
    int config_version_ = 1;
public:
    int read_version() const {
        std::shared_lock<std::shared_mutex> read_lk(rw_mtx_); // Multiple readers allowed simultaneously!
        return config_version_;
    }
    void update_version(int next_ver) {
        std::unique_lock<std::shared_mutex> write_lk(rw_mtx_); // Exclusive writer lock!
        config_version_ = next_ver;
    }
};

// ============================================================================
// PART 5: Production C++20 Thread Pool with std::packaged_task & std::future
// ============================================================================
class ThreadPool {
    std::vector<std::thread> workers_;
    std::queue<std::function<void()>> tasks_;
    std::mutex queue_mtx_;
    std::condition_variable cv_;
    bool stop_ = false;

public:
    explicit ThreadPool(std::size_t num_threads) {
        for (std::size_t i = 0; i < num_threads; ++i) {
            workers_.emplace_back([this] {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lk(this->queue_mtx_);
                        this->cv_.wait(lk, [this] {
                            return this->stop_ || !this->tasks_.empty();
                        });
                        if (this->stop_ && this->tasks_.empty()) return;
                        task = std::move(this->tasks_.front());
                        this->tasks_.pop();
                    }
                    task();
                }
            });
        }
    }

    template <class F, class... Args>
    auto enqueue(F&& f, Args&&... args)
        -> std::future<std::invoke_result_t<F, Args...>> {
        using return_type = std::invoke_result_t<F, Args...>;

        auto task = std::make_shared<std::packaged_task<return_type()>>(
            std::bind(std::forward<F>(f), std::forward<Args>(args)...)
        );

        std::future<return_type> res = task->get_future();
        {
            std::unique_lock<std::mutex> lk(queue_mtx_);
            tasks_.emplace([task]() { (*task)(); });
        }
        cv_.notify_one();
        return res;
    }

    ~ThreadPool() {
        {
            std::unique_lock<std::mutex> lk(queue_mtx_);
            stop_ = true;
        }
        cv_.notify_all();
        for (std::thread& worker : workers_) {
            if (worker.joinable()) worker.join();
        }
    }
};

int main() {
    std::cout << "====================================================================\n";
    std::cout << " LAB 10: FUTURE, PROMISE, ASYNC, ATOMICS & THREAD POOL (CppNuts)\n";
    std::cout << "====================================================================\n\n";

    std::cout << "--- 1. std::promise & std::future Single-Use Channel ---\n";
    {
        std::promise<ull> odd_promise;
        std::future<ull> odd_future = odd_promise.get_future();

        std::thread worker(sum_odd_range, std::move(odd_promise), 1, 1000);
        std::cout << "  [Main] Waiting on odd_future.get()...\n";
        std::cout << "  [Main] Sum of odd numbers [1..1000] = " << odd_future.get() << "\n";
        worker.join();
    }

    std::cout << "\n--- 2. std::async: std::launch::async vs std::launch::deferred ---\n";
    {
        std::cout << "  [Main] Main thread ID: " << std::this_thread::get_id() << "\n";
        auto f_async = std::async(std::launch::async, compute_squares_sum, 100, "launch::async");
        auto f_deferred = std::async(std::launch::deferred, compute_squares_sum, 100, "launch::deferred");

        std::cout << "  [Main] Result from async    = " << f_async.get() << "\n";
        std::cout << "  [Main] Result from deferred = " << f_deferred.get()
                  << " (Note: ran on Main thread ID!)\n";
    }

    std::cout << "\n--- 3. std::call_once + std::shared_mutex + std::atomic + C++20 Semaphore ---\n";
    {
        std::vector<std::thread> pool;
        for (int i = 0; i < 4; ++i) {
            pool.emplace_back(DatabaseConnectionPool::connect);
        }
        for (auto& t : pool) t.join();
        std::cout << "  [std::call_once] DB init count = " << DatabaseConnectionPool::get_init_count() << "\n";

        ThreadSafeConfigCache cache;
        cache.update_version(42);
        std::cout << "  [std::shared_mutex] Concurrent read version = " << cache.read_version() << "\n";

        std::atomic<int> lock_free_counter{0};
        lock_free_counter.fetch_add(10, std::memory_order_relaxed);
        std::cout << "  [std::atomic] Lock-free fetch_add result = " << lock_free_counter.load()
                  << " (is_always_lock_free = " << std::boolalpha
                  << std::atomic<int>::is_always_lock_free << ")\n";

        std::counting_semaphore<2> sem(2); // Allows up to 2 concurrent threads
        sem.acquire();
        sem.release();
        std::cout << "  [C++20 std::counting_semaphore<2>] Acquire/Release verified!\n";
    }

    std::cout << "\n--- 4. Production C++20 Thread Pool (4 Workers, 8 Queued Tasks) ---\n";
    {
        ThreadPool pool(4);
        std::vector<std::future<int>> results;

        for (int i = 1; i <= 8; ++i) {
            results.emplace_back(pool.enqueue([i] {
                return i * i * 10;
            }));
        }

        std::cout << "  [ThreadPool] Task outputs: ";
        for (auto& fut : results) {
            std::cout << fut.get() << " ";
        }
        std::cout << "\n";
    }

    return 0;
}
