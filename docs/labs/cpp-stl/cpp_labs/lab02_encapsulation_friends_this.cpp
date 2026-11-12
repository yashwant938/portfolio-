// ============================================================================
// LAB 02: Encapsulation, Friend Functions/Classes, `this`, `mutable` & Ref-Qualifiers
// Part of CppOOPTopics — Complete C++ OOP & Memory Internals Lab
// Compile: g++ -std=c++20 -O2 lab02_encapsulation_friends_this.cpp -o lab02
// ============================================================================

#include <iostream>
#include <string>
#include <utility>

class VaultInspector; // Forward declaration for friend class

class SecureVault {
private:
    std::string owner_;
    double secret_balance_;

    // `mutable` allows modification even inside a `const` member function!
    // Used for thread-safety mutexes, lazy caching, or telemetry counters.
    mutable int audit_access_count_ = 0;

    // Static inline member (C++17): Shared across ALL instances (lives in Data segment, not inside object!)
    inline static int total_vaults_ = 0;

public:
    explicit SecureVault(std::string owner, double balance)
        : owner_(std::move(owner)), secret_balance_(balance) {
        ++total_vaults_;
    }

    ~SecureVault() { --total_vaults_; }

    // `const` member function: `this` has type `const SecureVault* const`
    double getBalance() const {
        ++audit_access_count_; // Legal ONLY because audit_access_count_ is `mutable`
        return secret_balance_;
    }

    // Ref-Qualified Member Functions (C++11):
    // 1. Called when object is an LVALUE (`vault.extractOwner()`) -> copies safely
    const std::string& extractOwner() const & {
        std::cout << "  [& Lvalue Overload] Returning const reference to owner_\n";
        return owner_;
    }

    // 2. Called when object is an RVALUE (`SecureVault("Temp", 0).extractOwner()`) -> moves!
    std::string extractOwner() && {
        std::cout << "  [&& Rvalue Overload] Moving owner_ out of expiring temporary!\n";
        return std::move(owner_);
    }

    static int getActiveVaults() { return total_vaults_; }

    // 1. FRIEND GLOBAL FUNCTION: Can access `private` and `protected` members directly
    friend std::ostream& operator<<(std::ostream& os, const SecureVault& v);

    // 2. FRIEND CLASS: All methods of VaultInspector can inspect private state of SecureVault
    // Note: Friendship is NOT inherited, NOT transitive, and NOT reciprocal!
    friend class VaultInspector;
};

std::ostream& operator<<(std::ostream& os, const SecureVault& v) {
    ++v.audit_access_count_;
    return os << "Vault[Owner=" << v.owner_
              << ", Balance=$" << v.secret_balance_
              << ", Audits=" << v.audit_access_count_ << "]";
}

class VaultInspector {
public:
    static bool verifySolvency(const SecureVault& v, double min_required) {
        // Direct access to private member `secret_balance_`
        return v.secret_balance_ >= min_required;
    }
};

int main() {
    std::cout << "=== LAB 02: ENCAPSULATION, FRIENDS, MUTABLE & REF-QUALIFIERS ===\n\n";

    const SecureVault alice("Alice", 25000.0);
    std::cout << "Initial read (const object): $" << alice.getBalance() << "\n";
    std::cout << "Friend operator<< output   : " << alice << "\n";
    std::cout << "Friend class solvency check: "
              << (VaultInspector::verifySolvency(alice, 10000.0) ? "PASS" : "FAIL") << "\n\n";

    std::cout << "Testing Member Function Ref-Qualifiers (& vs &&):\n";
    const std::string& ref_name = alice.extractOwner(); // Calls `const &`
    std::string moved_name = SecureVault("EphemeralBob", 50.0).extractOwner(); // Calls `&&`
    std::cout << "  Extracted: " << ref_name << " and " << moved_name << "\n";
    std::cout << "Active vaults remaining    : " << SecureVault::getActiveVaults() << "\n";
    return 0;
}
