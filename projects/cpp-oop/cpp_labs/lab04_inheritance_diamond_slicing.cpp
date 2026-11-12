// ============================================================================
// LAB 04: Inheritance Modes, Object Slicing, Name Hiding & Diamond Virtual Base
// Part of CppOOPTopics — Complete C++ OOP & Memory Internals Lab
// Compile: clang++ -std=c++20 -O2 lab04_inheritance_diamond_slicing.cpp -o lab04
// ============================================================================

#include <iostream>
#include <string>

// 1. NAME HIDING ACROSS INHERITANCE & `using Base::fn`
class SignalProcessor {
public:
    void process(int hz) {
        std::cout << "  [Base] Processing integer frequency: " << hz << " Hz\n";
    }
    void process(double hz) {
        std::cout << "  [Base] Processing precise frequency: " << hz << " Hz\n";
    }
};

class AudioProcessor : public SignalProcessor {
public:
    // Without `using SignalProcessor::process;`, defining process(std::string)
    // in Derived HIDES both process(int) and process(double) in Base!
    using SignalProcessor::process;

    void process(const std::string& codec) {
        std::cout << "  [Derived] Processing codec: " << codec << "\n";
    }
};

// 2. OBJECT SLICING TRAP
class BaseSensor {
protected:
    int id_;
public:
    explicit BaseSensor(int id) : id_(id) {}
    virtual ~BaseSensor() = default;
    virtual std::string describe() const {
        return "BaseSensor#" + std::to_string(id_);
    }
};

class ThermalSensor : public BaseSensor {
    double max_temp_;
public:
    ThermalSensor(int id, double max_t) : BaseSensor(id), max_temp_(max_t) {}
    std::string describe() const override {
        return "ThermalSensor#" + std::to_string(id_) + " (max=" + std::to_string(max_temp_) + "C)";
    }
};

// BAD: Takes BaseSensor BY VALUE -> slices off ThermalSensor::max_temp_ and resets vptr!
void logByValue_SLICED(BaseSensor s) {
    std::cout << "  [By Value - SLICED]   : " << s.describe() << " (sizeof=" << sizeof(s) << "B)\n";
}

// GOOD: Takes BaseSensor BY CONST REFERENCE -> preserves dynamic type and vptr!
void logByReference_SAFE(const BaseSensor& s) {
    std::cout << "  [By Ref - POLYMORPHIC]: " << s.describe() << "\n";
}

// 3. THE DIAMOND PROBLEM & VIRTUAL INHERITANCE (`: virtual public`)
struct PoweredDevice {
    int serial_id;
    explicit PoweredDevice(int id) : serial_id(id) {
        std::cout << "  [1] PoweredDevice(" << serial_id << ") constructed at " << this << "\n";
    }
    virtual ~PoweredDevice() {
        std::cout << "  [4] ~PoweredDevice() destroyed\n";
    }
};

struct Scanner : virtual public PoweredDevice {
    int dpi = 600;
    explicit Scanner(int id) : PoweredDevice(id) {
        std::cout << "  [2a] Scanner constructed\n";
    }
    ~Scanner() override { std::cout << "  [3a] ~Scanner destroyed\n"; }
};

struct Printer : virtual public PoweredDevice {
    int ppm = 40;
    explicit Printer(int id) : PoweredDevice(id) {
        std::cout << "  [2b] Printer constructed\n";
    }
    ~Printer() override { std::cout << "  [3b] ~Printer destroyed\n"; }
};

struct AllInOneCopier : public Scanner, public Printer {
    // Most-derived class directly initializes virtual base `PoweredDevice`!
    // Scanner(999) and Printer(888)'s calls to PoweredDevice() are ignored by compiler!
    explicit AllInOneCopier(int master_id)
        : PoweredDevice(master_id), Scanner(999), Printer(888) {
        std::cout << "  [3] AllInOneCopier constructed\n";
    }
    ~AllInOneCopier() override { std::cout << "  [2] ~AllInOneCopier destroyed\n"; }
};

int main() {
    std::cout << "=== LAB 04: INHERITANCE, NAME HIDING, SLICING & DIAMOND VIRTUAL BASE ===\n\n";

    std::cout << "[A] Overload Resolution with `using Base::process`:\n";
    AudioProcessor ap;
    ap.process(44100);
    ap.process(48000.5);
    ap.process("FLAC");

    std::cout << "\n[B] Object Slicing vs. Polymorphic Reference:\n";
    ThermalSensor ts(7, 125.0);
    logByValue_SLICED(ts);
    logByReference_SAFE(ts);

    std::cout << "\n[C] Diamond Inheritance Lifecycle & Memory Unification:\n";
    {
        AllInOneCopier copier(2026);
        std::cout << "  Unambiguous serial_id : " << copier.serial_id << "\n";
        std::cout << "  Address via Scanner*  : " << static_cast<PoweredDevice*>(static_cast<Scanner*>(&copier)) << "\n";
        std::cout << "  Address via Printer*  : " << static_cast<PoweredDevice*>(static_cast<Printer*>(&copier)) << "\n";
        std::cout << "  sizeof(AllInOneCopier): " << sizeof(AllInOneCopier) << " bytes (includes vbptrs)\n";
    }
    return 0;
}
