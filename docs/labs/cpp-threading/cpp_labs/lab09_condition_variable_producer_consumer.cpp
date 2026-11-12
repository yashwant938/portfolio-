// ============================================================================
// LAB 09: std::condition_variable — wait(), notify_one(), notify_all(),
//         Even-Odd Alternating Printer & Bounded Producer-Consumer Queue
//         (CppNuts C++ Multithreading Series — Complete Implementation)
// ============================================================================
// Compile: g++ -std=c++20 -O2 -pthread lab09_condition_variable_producer_consumer.cpp -o lab09
// ============================================================================

#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <vector>

std::mutex g_io_mtx;
template <typename... Args>
void safe_print(Args&&... args) {
    std::lock_guard<std::mutex> lk(g_io_mtx);
    (std::cout << ... << std::forward<Args>(args)) << "\n";
}

// ============================================================================
// PART 1: How std::condition_variable::wait(lock, predicate) Works Internally
// ============================================================================
// cv.wait(ul, [&]{ return ready; }) expands to:
//   while (!ready) {
//       cv.wait(ul); // Atomically unlocks `ul` and puts thread to sleep!
//                    // When notified (or spuriously woken), re-acquires `ul`
//                    // and re-checks the while(!ready) predicate!
//   }
// WHY unique_lock and NOT lock_guard?
//   Because cv.wait() must UNLOCK the mutex before sleeping and LOCK it again
//   upon waking up. std::lock_guard has no unlock()/lock() member functions!

namespace BankAccountCV {
    std::mutex mtx;
    std::condition_variable cv;
    long balance = 0;

    void add_money(long money) {
        {
            std::lock_guard<std::mutex> lg(mtx);
            balance += money;
            safe_print("  [DepositThread] Added $", money, " -> Current Balance = $", balance);
        } // Unlock BEFORE calling notify_one() to avoid "hurry up and wait" pessimization!
        cv.notify_one();
    }

    void withdraw_money(long money) {
        std::unique_lock<std::mutex> ul(mtx);
        safe_print("  [WithdrawThread] Waiting for balance > 0...");
        cv.wait(ul, [] { return balance != 0; });

        if (balance >= money) {
            balance -= money;
            safe_print("  [WithdrawThread] Withdrew $", money, " -> Remaining = $", balance);
        } else {
            safe_print("  [WithdrawThread] Insufficient balance ($", balance, ") to withdraw $", money);
        }
    }
}

// ============================================================================
// PART 2: CppNuts Classic Interview Problem — Even & Odd Threads Using CV
// ============================================================================
namespace EvenOddPrinter {
    std::mutex mtx;
    std::condition_variable cv;
    int current = 1;
    const int MAX_NUM = 10;
    std::vector<int> sequence;

    void print_odd() {
        while (true) {
            std::unique_lock<std::mutex> ul(mtx);
            cv.wait(ul, [] { return (current % 2 == 1) || (current > MAX_NUM); });
            if (current > MAX_NUM) break;
            sequence.push_back(current);
            ++current;
            ul.unlock();
            cv.notify_all();
        }
    }

    void print_even() {
        while (true) {
            std::unique_lock<std::mutex> ul(mtx);
            cv.wait(ul, [] { return (current % 2 == 0) || (current > MAX_NUM); });
            if (current > MAX_NUM) break;
            sequence.push_back(current);
            ++current;
            ul.unlock();
            cv.notify_all();
        }
    }
}

// ============================================================================
// PART 3: Bounded Producer-Consumer Queue with Two Condition Variables
// ============================================================================
class BoundedBuffer {
    std::queue<int> buffer_;
    const std::size_t capacity_;
    std::mutex mtx_;
    std::condition_variable cv_not_full_;
    std::condition_variable cv_not_empty_;

public:
    explicit BoundedBuffer(std::size_t cap) : capacity_(cap) {}

    void produce(int item) {
        std::unique_lock<std::mutex> ul(mtx_);
        cv_not_full_.wait(ul, [this] { return buffer_.size() < capacity_; });

        buffer_.push(item);
        safe_print("  [Producer] Produced #", item, " (Buffer size = ", buffer_.size(), "/", capacity_, ")");

        ul.unlock();
        cv_not_empty_.notify_one();
    }

    int consume() {
        std::unique_lock<std::mutex> ul(mtx_);
        cv_not_empty_.wait(ul, [this] { return !buffer_.empty(); });

        int item = buffer_.front();
        buffer_.pop();
        safe_print("  [Consumer] Consumed #", item, " (Buffer size = ", buffer_.size(), "/", capacity_, ")");

        ul.unlock();
        cv_not_full_.notify_one();
        return item;
    }
};

int main() {
    std::cout << "====================================================================\n";
    std::cout << " LAB 09: CONDITION VARIABLE, EVEN-ODD & PRODUCER-CONSUMER (CppNuts)\n";
    std::cout << "====================================================================\n\n";

    std::cout << "--- 1. Condition Variable: Bank Deposit & Withdraw ---\n";
    {
        std::thread t_withdraw(BankAccountCV::withdraw_money, 500);
        std::this_thread::sleep_for(std::chrono::milliseconds(15));
        std::thread t_deposit(BankAccountCV::add_money, 800);
        t_withdraw.join();
        t_deposit.join();
    }

    std::cout << "\n--- 2. CppNuts Interview Classic: Strict Even-Odd Alternating Threads ---\n";
    {
        std::thread t_odd(EvenOddPrinter::print_odd);
        std::thread t_even(EvenOddPrinter::print_even);
        t_odd.join();
        t_even.join();

        std::cout << "  Alternating Output: ";
        for (int v : EvenOddPrinter::sequence) {
            std::cout << v << " ";
        }
        std::cout << "(Strictly ordered 1..10!)\n";
    }

    std::cout << "\n--- 3. Bounded Producer-Consumer Queue (Capacity = 3, Items = 6) ---\n";
    {
        BoundedBuffer buf(3);
        std::thread producer([&] {
            for (int i = 1; i <= 6; ++i) {
                buf.produce(i * 10);
            }
        });

        std::thread consumer([&] {
            for (int i = 1; i <= 6; ++i) {
                buf.consume();
            }
        });

        producer.join();
        consumer.join();
    }

    return 0;
}
