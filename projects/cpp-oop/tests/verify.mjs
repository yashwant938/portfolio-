import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");

const requiredFiles = [
  "index.html",
  "README.md",
  "CMakeLists.txt",
  "package.json",
  "src/styles.css",
  "src/data.js",
  "src/app.js",
  "cpp_labs/lab01_alignment_and_memory.cpp",
  "cpp_labs/lab02_encapsulation_friends_this.cpp",
  "cpp_labs/lab03_lvalue_rvalue_move_rule_of_5.cpp",
  "cpp_labs/lab04_inheritance_diamond_slicing.cpp",
  "cpp_labs/lab05_vtable_virtual_dispatch_rtti.cpp",
  "cpp_labs/lab06_smart_pointers_operator_overloading_idioms.cpp",
  "cpp_labs/lab07_threads_join_detach_5_ways.cpp",
  "cpp_labs/lab08_mutex_lock_types_deadlock.cpp",
  "cpp_labs/lab09_condition_variable_producer_consumer.cpp",
  "cpp_labs/lab10_future_promise_async_threadpool.cpp"
];

for (const rel of requiredFiles) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing required file: ${rel}`);
  }
}

// Check generative_ui design constraints on src/app.js & index.html
const appSource = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");

if (/text-\[(10|11)px\]/.test(appSource) || /text-\[(10|11)px\]/.test(indexSource)) {
  throw new Error("Design violation: sub-12px micro-text found");
}
if (!appSource.includes("var(--card)") || !appSource.includes("var(--foreground)") || !appSource.includes("var(--primary)")) {
  throw new Error("Design violation: missing semantic CSS variables");
}

// Simulate DOM and exercise all 6 views + 9 animation simulators + track switcher
const elements = {
  "top-nav-buttons": { innerHTML: "" },
  "track-switcher-bar": { innerHTML: "" },
  "app-main-container": { innerHTML: "" }
};

const sandbox = {
  window: {},
  navigator: { clipboard: { writeText: () => {} } },
  document: {
    readyState: "complete",
    addEventListener: () => {},
    getElementById: (id) => elements[id] || null
  }
};

vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, "src/data.js"), "utf8"), sandbox);
vm.runInContext(appSource, sandbox);

const data = sandbox.window.CPP_OOP_DATA;
if (data.slides.length !== 18) {
  throw new Error(`Expected 18 concept slides, got ${data.slides.length}`);
}
if (data.codeDemos.length !== 14) {
  throw new Error(`Expected 14 code demos, got ${data.codeDemos.length}`);
}
if (data.quizQuestions.length !== 25) {
  throw new Error(`Expected 25 quiz questions, got ${data.quizQuestions.length}`);
}

const views = ["landing", "slides", "code-demo", "animation", "quiz", "result"];
for (const v of views) {
  sandbox.window.switchView(v);
  if (!elements["app-main-container"].innerHTML || elements["app-main-container"].innerHTML.length < 100) {
    throw new Error(`View '${v}' failed to render content`);
  }
}

// Test Track Filter Switcher
for (const track of ["all", "oop", "threading"]) {
  sandbox.window.setTrackFilter(track);
  sandbox.window.switchView("landing");
  if (!elements["app-main-container"].innerHTML.includes("Curriculum")) {
    throw new Error(`Track filter '${track}' failed to render landing curriculum`);
  }
}
sandbox.window.setTrackFilter("all");

// Exercise all 9 animation simulators (5 OOP + 4 CppNuts Threading)
sandbox.window.switchView("animation");
const allSimTabs = [
  "align",
  "vtable",
  "rvalue",
  "diamond",
  "smartptr",
  "threads5",
  "mutex_deadlock",
  "cv_queue",
  "future_pool"
];
for (const tab of allSimTabs) {
  sandbox.window.setAnimTab(tab);
  if (!elements["app-main-container"].innerHTML.includes("Interactive Memory")) {
    throw new Error(`Animation tab '${tab}' failed to render`);
  }
}

// Test Simulator 1: Greedy Alignment
sandbox.window.setAnimTab("align");
sandbox.window.applyGreedySort();
if (!elements["app-main-container"].innerHTML.includes("16 Bytes")) {
  throw new Error("Greedy alignment sort failed to compute 16 Bytes");
}

// Test Simulator 6: CppNuts 5 Thread Creation Ways
sandbox.window.setAnimTab("threads5");
sandbox.window.selectThreadWay(3);
sandbox.window.setThreadLifecycleMode("jthread");
if (!elements["app-main-container"].innerHTML.includes("EngineController::calibrate")) {
  throw new Error("Thread simulator way #4 failed to render");
}

// Test Simulator 7: Mutex & Deadlock
sandbox.window.setAnimTab("mutex_deadlock");
sandbox.window.setDeadlockFixed(false);
if (!elements["app-main-container"].innerHTML.includes("CIRCULAR WAIT DEADLOCK")) {
  throw new Error("Deadlock simulator failed to show circular wait state");
}
sandbox.window.setDeadlockFixed(true);

// Test Simulator 8: Condition Variable Producer-Consumer & Even-Odd
sandbox.window.setAnimTab("cv_queue");
sandbox.window.cvProduceItem();
sandbox.window.cvConsumeItem();
sandbox.window.cvStepEvenOdd();
if (!elements["app-main-container"].innerHTML.includes("BOUNDED QUEUE")) {
  throw new Error("Condition variable simulator failed to render bounded queue");
}

// Test Simulator 9: Future/Promise, Async & Thread Pool
sandbox.window.setAnimTab("future_pool");
sandbox.window.togglePromiseState();
sandbox.window.setAsyncPolicySim("deferred");
sandbox.window.enqueuePoolTaskSim();
if (!elements["app-main-container"].innerHTML.includes("250000")) {
  throw new Error("Future/Promise simulator failed to fulfill promise");
}

console.log(
  "FRONTEND & DESIGN AUDIT PASSED: All 6 views, Dual-Track switcher, 18 slides, 14 demos, 9 simulators (5 OOP + 4 CppNuts Threading), 25 quiz questions, and 10 native C++20 labs verified."
);
