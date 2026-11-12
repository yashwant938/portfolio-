// ============================================================================
// LAB 05: Vtable & Vptr Internals, Pure Virtual with Body, Traps & RTTI
// Part of CppOOPTopics — Complete C++ OOP & Memory Internals Lab
// Compile: clang++ -std=c++20 -O2 lab05_vtable_virtual_dispatch_rtti.cpp -o lab05
// ============================================================================

#include <cstdint>
#include <iostream>
#include <memory>
#include <typeinfo>

// 1. PURE VIRTUAL FUNCTION WITH A BODY + VIRTUAL DESTRUCTOR
class IInstrument {
public:
    virtual ~IInstrument() = default;

    // Pure virtual (= 0) makes IInstrument abstract, BUT we CAN provide a default
    // implementation that derived classes may invoke explicitly via `IInstrument::calibrate()`!
    virtual void calibrate() const = 0;

    // Classic Interview Trap: Default arguments on virtual functions are bound
    // STATICALLY at compile time based on pointer type, NOT dynamically via vtable!
    virtual void trigger(int gain_db = 10) const {
        std::cout << "  [IInstrument::trigger] gain = " << gain_db << " dB\n";
    }

    // Covariant Return Type: Overridden clone() can return Oscilloscope* instead of IInstrument*
    virtual IInstrument* clone() const = 0;
};

// Definition of pure virtual function body!
void IInstrument::calibrate() const {
    std::cout << "  [IInstrument::calibrate] Performing base zero-point calibration...\n";
}

class Oscilloscope final : public IInstrument {
    int channels_ = 4;
public:
    explicit Oscilloscope(int ch = 4) : channels_(ch) {}

    void calibrate() const override {
        IInstrument::calibrate(); // Reuse pure virtual base implementation!
        std::cout << "  [Oscilloscope::calibrate] Calibrating " << channels_ << " probes.\n";
    }

    // Notice different default argument (99) — calling via IInstrument* will still pass 10!
    void trigger(int gain_db = 99) const override {
        std::cout << "  [Oscilloscope::trigger] Dynamic body executed, but gain_db = "
                  << gain_db << " dB (from static pointer type!)\n";
    }

    // Covariant return type (`Oscilloscope*` is-a `IInstrument*`)
    Oscilloscope* clone() const override {
        return new Oscilloscope(*this);
    }
};

// 2. CALLING VIRTUAL FUNCTION IN CONSTRUCTOR/DESTRUCTOR TRAP
struct LifecycleTrapBase {
    LifecycleTrapBase() {
        // Inside Base constructor, Derived does not exist yet!
        // `vptr` currently points to LifecycleTrapBase's vtable!
        std::cout << "  [In Base Ctor] Calling virtual whoAmI() -> ";
        whoAmI();
    }
    virtual ~LifecycleTrapBase() = default;
    virtual void whoAmI() const { std::cout << "LifecycleTrapBase (NOT Derived!)\n"; }
};

struct LifecycleTrapDerived : LifecycleTrapBase {
    void whoAmI() const override { std::cout << "LifecycleTrapDerived\n"; }
};

// 3. MULTIPLE INHERITANCE WITH MULTIPLE VPTRs & THIS-POINTER ADJUSTMENT
struct AudioSource {
    int sample_rate = 48000;
    virtual ~AudioSource() = default;
    virtual void streamAudio() const {}
};

struct VideoSource {
    int fps = 60;
    virtual ~VideoSource() = default;
    virtual void streamVideo() const {}
};

// MediaStream has TWO vptrs: one for AudioSource subobject (offset 0),
// and one for VideoSource subobject (offset 16)!
struct MediaStream : public AudioSource, public VideoSource {
    int bitrate = 8000;
    void streamAudio() const override {}
    void streamVideo() const override {}
};

int main() {
    std::cout << "=== LAB 05: VTABLE INTERNALS, VIRTUAL TRAPS, COVARIANCE & RTTI ===\n\n";

    std::unique_ptr<IInstrument> inst = std::make_unique<Oscilloscope>(8);

    std::cout << "[1] Pure Virtual Function with Shared Base Implementation:\n";
    inst->calibrate();

    std::cout << "\n[2] Virtual Function Default Argument Trap (Static vs Dynamic Binding):\n";
    inst->trigger(); // Calls Oscilloscope::trigger(), but passes IInstrument's default (10)!

    std::cout << "\n[3] Virtual Dispatch Inside Base Constructor Trap:\n";
    LifecycleTrapDerived d;

    std::cout << "\n[4] Multiple Inheritance Two-Vptr & `this` Pointer Adjustment:\n";
    MediaStream ms;
    AudioSource* a_ptr = &ms;
    VideoSource* v_ptr = &ms;
    std::cout << "  sizeof(MediaStream)   : " << sizeof(MediaStream) << " bytes (2 vptrs + 3 ints)\n";
    std::cout << "  MediaStream* address  : " << &ms << "\n";
    std::cout << "  AudioSource* address  : " << a_ptr << " (offset 0)\n";
    std::cout << "  VideoSource* address  : " << v_ptr << " (shifted by +"
              << (reinterpret_cast<char*>(v_ptr) - reinterpret_cast<char*>(&ms)) << " bytes!)\n";

    std::cout << "\n[5] Runtime Type Information (RTTI: dynamic_cast & typeid):\n";
    std::cout << "  typeid(*inst).name()  : " << typeid(*inst).name() << "\n";
    if (auto* osc = dynamic_cast<Oscilloscope*>(inst.get())) {
        std::unique_ptr<Oscilloscope> cloned(osc->clone());
        std::cout << "  dynamic_cast succeeded! Covariant clone created at " << cloned.get() << "\n";
    }
    return 0;
}
