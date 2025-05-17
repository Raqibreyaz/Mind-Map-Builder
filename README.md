# Mind Map Builder

## 🎥 Demo

📽️ **[Demo Video](./Demo.mkv)** — See the app in action!

---

## 🧭 Overview

This is a **Mind Map Builder** application where users can **create, connect, edit, and organize tasks** in a flow-based interface. The app includes advanced interaction features such as drag-and-drop task creation, undo/redo via shortcuts, node editing, and efficient state handling using **Zustand**.

---

## ⚙️ Technologies Used

* **React** – Component-based UI library
* **TypeScript** – For type-safe development
* **Zustand** – Lightweight, global state management
* **@xyflow/react** – For creating visual node-edge diagrams

---

## ✨ Features

### 🧩 Workflow Creation

* **Add Node**: Add tasks dynamically via tool pane.
* **Add Edge**: Connect tasks with logical flow.
* **Drop-to-Add-Task**: Drop a task node directly onto an edge to auto-connect.

### ✏️ Node Editing

* **Edit Task Content**: Click any node to edit its title or description in-place.
* State is updated live and persisted in the centralized store.

### 🧠 State Management

* **Zustand-Powered Central Store**:

  * Nodes, edges, history stack, and UI states are all globally managed via Zustand.
  * Subscriptions are **selector-based**, so components only re-render when their data changes.
  * Avoids unnecessary prop drilling or duplicate local states.

### 🧠 Undo/Redo with Keyboard Shortcuts

* **Ctrl + Z / Ctrl + Y** support
* Internally uses a **history stack** to save meaningful snapshots
* **Optimizations**:

  * Node position changes during dragging are skipped to avoid cluttering history.
  * Only structural updates (add/delete/edit/connect) are tracked.

### 🧰 Draggable Tool Pane

* UI tool pane can be freely dragged anywhere in the editor for better usability.

---

## ⚡ State Optimization Using Zustand

### 🔄 Global, Predictable State

All logic flows through Zustand:

* Nodes and edges are stored in a flat, central store.
* Node editing and movement is dispatched via state functions (e.g., `updateNode`, `setNodes`).

### 🎯 Selective Subscriptions

Components use `useStore(selector)`:

* Only the components subscribed to `nodes` or `edges` re-render when those change.
* Tool pane, editor, and other UI segments remain isolated and unaffected by unrelated state updates.

### 🧠 Efficient History Management

* Zustand tracks `past`, `present`, and `future` snapshots.
* Dragging doesn’t pollute history — only **meaningful changes** like node addition, deletion, or editing trigger history updates.
* History is persisted in memory with shallow equality to avoid unnecessary memory usage.

---

## 🛠 How to Run the Project

```bash
git clone https://github.com/Raqibreyaz/Mind-Map-Builder.git
cd Mind-Map-Builder
pnpm install
pnpm run dev
```

---
