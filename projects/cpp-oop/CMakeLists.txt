cmake_minimum_required(VERSION 3.16)
project(CppOOPTopics LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

if(MSVC)
    add_compile_options(/W4)
else()
    add_compile_options(-Wall -Wextra -Wpedantic -O2)
endif()

add_executable(lab01_alignment_and_memory cpp_labs/lab01_alignment_and_memory.cpp)
add_executable(lab02_encapsulation_friends_this cpp_labs/lab02_encapsulation_friends_this.cpp)
add_executable(lab03_lvalue_rvalue_move_rule_of_5 cpp_labs/lab03_lvalue_rvalue_move_rule_of_5.cpp)
add_executable(lab04_inheritance_diamond_slicing cpp_labs/lab04_inheritance_diamond_slicing.cpp)
add_executable(lab05_vtable_virtual_dispatch_rtti cpp_labs/lab05_vtable_virtual_dispatch_rtti.cpp)
add_executable(lab06_smart_pointers_operator_overloading_idioms cpp_labs/lab06_smart_pointers_operator_overloading_idioms.cpp)
