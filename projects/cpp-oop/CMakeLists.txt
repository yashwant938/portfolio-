cmake_minimum_required(VERSION 3.16)
project(CppOOPTopics LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

find_package(Threads REQUIRED)

if(MSVC)
    add_compile_options(/W4)
else()
    add_compile_options(-Wall -Wextra -Wpedantic -O2)
endif()

# Track 1: C++20 OOP & Low-Level Memory Engineering Labs (Labs 01 - 06)
add_executable(lab01_alignment_and_memory cpp_labs/lab01_alignment_and_memory.cpp)
add_executable(lab02_encapsulation_friends_this cpp_labs/lab02_encapsulation_friends_this.cpp)
add_executable(lab03_lvalue_rvalue_move_rule_of_5 cpp_labs/lab03_lvalue_rvalue_move_rule_of_5.cpp)
add_executable(lab04_inheritance_diamond_slicing cpp_labs/lab04_inheritance_diamond_slicing.cpp)
add_executable(lab05_vtable_virtual_dispatch_rtti cpp_labs/lab05_vtable_virtual_dispatch_rtti.cpp)
add_executable(lab06_smart_pointers_operator_overloading_idioms cpp_labs/lab06_smart_pointers_operator_overloading_idioms.cpp)

# Track 2: CppNuts C++20 Multithreading & Concurrency Labs (Labs 07 - 10)
add_executable(lab07_threads_join_detach_5_ways cpp_labs/lab07_threads_join_detach_5_ways.cpp)
target_link_libraries(lab07_threads_join_detach_5_ways PRIVATE Threads::Threads)

add_executable(lab08_mutex_lock_types_deadlock cpp_labs/lab08_mutex_lock_types_deadlock.cpp)
target_link_libraries(lab08_mutex_lock_types_deadlock PRIVATE Threads::Threads)

add_executable(lab09_condition_variable_producer_consumer cpp_labs/lab09_condition_variable_producer_consumer.cpp)
target_link_libraries(lab09_condition_variable_producer_consumer PRIVATE Threads::Threads)

add_executable(lab10_future_promise_async_threadpool cpp_labs/lab10_future_promise_async_threadpool.cpp)
target_link_libraries(lab10_future_promise_async_threadpool PRIVATE Threads::Threads)
