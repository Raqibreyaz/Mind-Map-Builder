# Workflow Management Application

## Overview

This is a **workflow management** application that allows users to dynamically add and manage nodes and edges, track changes, and use undo/redo functionality. The application is built using **React** for the front-end and utilizes **Zustand** for efficient state management.

## Technologies Used

- **Zustand**: A small, fast, and scalable state management library for React. It allows for easy handling of global state in React applications with minimal boilerplate code.
  
- **@xyflow/react**: A library used to create and manage flow-based visualizations. It provides an intuitive API for adding, updating, and deleting nodes and edges in a workflow diagram.

- **React**: A JavaScript library for building user interfaces. It provides a component-based structure to build interactive UIs with efficient rendering.

- **Typescript**: Typescript is used for the code efficiency and increasing its quality

## Features

- **Add New Node**: Users can add new nodes dynamically, each representing a part of a workflow. These nodes are rendered and displayed on the canvas with user-defined attributes.
  
- **Add New Edge**: Users can draw connections (edges) between nodes, creating relationships and flow of information between them.

- **Undo/Redo**: All changes to nodes and edges are tracked, enabling users to undo or redo any action within the workflow.

- **Node and Edge Management**: Users can update, remove, and reconnect nodes and edges in real-time.

## Efficiency Achieved by Centralizing the State

By using **Zustand** for centralized state management, the application benefits from several efficiencies in terms of performance, code maintainability, and overall user experience:

1. **Simplified State Management**:
   - Zustand centralizes the application state (nodes, edges, and history stack) into a single store, making it easier to manage and access state across the entire application.
   - Centralized state eliminates the need for prop drilling and unnecessary state duplication across components.

2. **Efficient State Updates**:
   - Zustand's state management system allows components to subscribe to specific parts of the state. As a result, only the components that depend on a certain part of the state are re-rendered when the state is updated, improving rendering performance.
   - Instead of modifying state in individual components, the central state ensures consistency, reducing the chance of inconsistent or incorrect state across components.

3. **History Management (Undo/Redo)**:
   - Centralizing the state allows for easy tracking of the history of node and edge changes. Changes to the workflow, such as node additions or edge connections, are tracked in a history stack, enabling efficient undo and redo functionality.
   - By ensuring that only the relevant parts of the state (nodes and edges) are tracked, unnecessary state changes (e.g., position changes that don’t affect the node itself) are avoided, improving performance.

4. **Reduced Repeated Logic**:
   - Centralized state ensures that logic for manipulating nodes, edges, and history is abstracted into specific functions within the state management store (e.g., `addNewNode`, `addNewEdge`, `setNodes`, etc.). This reduces code duplication and makes it easier to maintain the logic in a single place.
   - Functions like `setNodes` or `onNodesChange` encapsulate the state modification logic, and the components don't need to worry about the implementation details.

5. **Predictable State and Debugging**:
   - With Zustand, the state is predictable because all state mutations are centralized and controlled through the store. This makes it easier to track what changes when, helping with debugging and ensuring that the application behaves as expected.
   - The predictable nature of the state also means that managing features like undo and redo becomes much simpler. We can revert the entire state to a previous snapshot (e.g., previous node positions or edge connections) when needed.

## How to Run the Project

1. Clone this repository to your local machine.
   
   ```bash
   git clone https://github.com/Raqibreyaz/Drag-n-Drop-Workflow.git

2. Navigate to the project directory.
  ```bash
  cd workflow-management-app
