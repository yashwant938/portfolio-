// ============================================================================
// LAB 01: Greedy Struct Alignment, Padding, Bit-Fields, EBO & [[no_unique_address]]
// Part of CppOOPTopics — Complete C++ OOP & Memory Internals Lab
// Compile: g++ -std=c++20 -O2 lab01_alignment_and_memory.cpp -o lab01
// ============================================================================

#include <cstddef>
#include <cstdint>
#include <iostream>

// 1. WHY EMPTY CLASSES ARE 1 BYTE (Identity Rule)
// Two distinct objects in C++ must have distinct memory addresses.
struct EmptyClass {};
static_assert(sizeof(EmptyClass) == 1, "Empty class must be at least 1 byte");

// 2. POOR vs. GREEDY ALIGNMENT (Largest-to-Smallest Member Ordering)
// CPU reads memory at natural alignment boundaries:
// - char (1B): any address
// - int32_t (4B): address % 4 == 0
// - double / int64_t / pointer (8B): address % 8 == 0
struct PoorlyAligned {
    char a;       // Offset 0 (1 byte) + 7 bytes padding!
    double b;     // Offset 8 (8 bytes)
    int32_t c;    // Offset 16 (4 bytes)
    char d;       // Offset 20 (1 byte) + 3 bytes tail padding (so sizeof % 8 == 0)!
}; // Total: 24 bytes (10 bytes wasted on padding!)

// Greedy Alignment: Sort members by decreasing alignment requirement (8B -> 4B -> 2B -> 1B)
struct GreedilyAligned {
    double b;     // Offset 0 (8 bytes, align 8)
    int32_t c;    // Offset 8 (4 bytes, align 4)
    char a;       // Offset 12 (1 byte, align 1)
    char d;       // Offset 13 (1 byte, align 1) + 2 bytes tail padding (to reach 16, multiple of 8)
}; // Total: 16 bytes (Saves 33% memory per instance!)

// 3. BIT-FIELDS: Packing sub-byte flags into a single integer unit
struct PacketHeader {
    uint32_t version : 4;    // 4 bits
    uint32_t header_len : 4; // 4 bits
    uint32_t flags : 8;      // 8 bits
    uint32_t payload_id : 16;// 16 bits
}; // Total: 4 bytes (32 bits total)

// 4. EMPTY BASE OPTIMIZATION (EBO) vs. C++20 [[no_unique_address]]
struct StatelessDeleter {}; // sizeof == 1 standalone

// Without EBO (Member composition wastes 8 bytes due to alignment padding!)
struct UnoptimizedHolder {
    int* ptr;                 // 8 bytes
    StatelessDeleter deleter; // 1 byte + 7 bytes padding -> 16 bytes total!
};

// Classic EBO via Inheritance (How pre-C++20 std::unique_ptr achieved 8 bytes)
struct EBOHolder : private StatelessDeleter {
    int* ptr; // 8 bytes total! Base subobject takes 0 bytes.
};

// Modern C++20: [[no_unique_address]] achieves EBO via composition without inheritance!
struct ModernHolder {
    int* ptr;
    [[no_unique_address]] StatelessDeleter deleter; // 8 bytes total!
};

// 5. CACHE LINE ALIGNMENT (Preventing False Sharing in Concurrency)
struct alignas(64) CacheAlignedCounter {
    uint64_t count = 0;
};

int main() {
    std::cout << "=== LAB 01: GREEDY ALIGNMENT & MEMORY LAYOUT ===\n\n";

    std::cout << "[1] EmptyClass sizeof        : " << sizeof(EmptyClass) << " byte\n";
    std::cout << "[2] PoorlyAligned sizeof     : " << sizeof(PoorlyAligned)
              << " bytes (alignof = " << alignof(PoorlyAligned) << ")\n";
    std::cout << "    Offsets -> a:" << offsetof(PoorlyAligned, a)
              << ", b:" << offsetof(PoorlyAligned, b)
              << ", c:" << offsetof(PoorlyAligned, c)
              << ", d:" << offsetof(PoorlyAligned, d) << "\n";

    std::cout << "[3] GreedilyAligned sizeof   : " << sizeof(GreedilyAligned)
              << " bytes (alignof = " << alignof(GreedilyAligned) << ")\n";
    std::cout << "    Offsets -> b:" << offsetof(GreedilyAligned, b)
              << ", c:" << offsetof(GreedilyAligned, c)
              << ", a:" << offsetof(GreedilyAligned, a)
              << ", d:" << offsetof(GreedilyAligned, d) << "\n";

    std::cout << "[4] PacketHeader (Bit-field) : " << sizeof(PacketHeader) << " bytes\n";
    std::cout << "[5] UnoptimizedHolder sizeof : " << sizeof(UnoptimizedHolder) << " bytes\n";
    std::cout << "[6] EBOHolder sizeof         : " << sizeof(EBOHolder) << " bytes\n";
    std::cout << "[7] ModernHolder (C++20)     : " << sizeof(ModernHolder) << " bytes\n";
    std::cout << "[8] CacheAlignedCounter      : " << sizeof(CacheAlignedCounter)
              << " bytes (alignof = " << alignof(CacheAlignedCounter) << ")\n";
    return 0;
}
