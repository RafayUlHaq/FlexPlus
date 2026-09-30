# FLEX+

### A modern, mobile-first reimagination of the university student portal.

FLEX+ is a React Native and Expo-based student portal designed to improve the everyday academic experience by bringing **attendance, academic performance, assignments, announcements, fees, and student information into one centralized dashboard**.

The project reimagines the traditional FLEX experience with a stronger focus on **mobile usability, proactive academic alerts, visual progress tracking, and interactive student tools**.

---

## Overview

Traditional university portals often require students to navigate through multiple sections to find information about their attendance, marks, assignments, fees, and announcements.

FLEX+ addresses this by creating a **centralized academic dashboard** that surfaces the information students need most, while providing interactive tools to monitor and manage their academic progress.

> **Goal:** Make academic information easier to find, understand, and act on.

---

## Proposed Solution

FLEX+ introduces a single, mobile-first dashboard that:

* Surfaces important academic information at a glance.
* Highlights courses and academic areas requiring attention.
* Provides real-time-style attendance calculations from class data.
* Organizes assignments according to priority.
* Visualizes marks and attendance trends.
* Allows students to search and filter courses.
* Provides interactive course and fee details through modal interfaces.
* Handles loading, empty, warning, validation, and success states.
* Optimizes the overall experience for mobile devices.

---

## Key Improvements Over FLEX

FLEX+ focuses on improving the areas where a traditional portal experience can become inconvenient for students.

| Traditional FLEX Experience                            | FLEX+ Improvement                                |
| ------------------------------------------------------ | ------------------------------------------------ |
| Information is distributed across different sections   | Centralized academic dashboard                   |
| Attendance requires navigating into individual courses | Attendance is surfaced directly on the dashboard |
| Attendance issues may not be immediately noticeable    | Automatic low-attendance alerts                  |
| Academic performance requires manual checking          | Low-performance warnings and analytics           |
| Assignment information can be scattered                | Dedicated priority-based assignment tracking     |
| Limited visual representation of academic progress     | Attendance bars and performance charts           |
| Finding courses requires browsing through lists        | Search and attendance-based filtering            |
| Attendance information is primarily passive            | Interactive attendance updates                   |
| Designed around a traditional portal experience        | Mobile-first React Native interface              |
| Important information is not prioritized               | Dedicated **Needs Your Attention** section       |

---

## Features

### 📊 Academic Dashboard

A centralized overview of the student's academic status, including:

* CGPA
* Overall attendance
* Number of courses
* Total credit hours
* Current semester
* Programme information

### ⚠️ Academic Alerts

The dashboard automatically identifies areas that require attention, including:

* Attendance below 75%
* Low course marks
* Courses requiring academic attention

When there are no active alerts, FLEX+ displays a clear all-clear state.

### 📚 Course Management

Students can:

* Browse their courses
* Search by course name, code, or instructor
* Filter courses by attendance status
* View detailed course information
* Monitor attendance progress
* Mark classes as attended or missed

### 📅 Assignment Tracking

Assignments are displayed using dedicated cards with priority indicators, making upcoming academic tasks easier to identify.

Assignments are automatically sorted according to priority.

### 📢 Announcements

Announcements are presented in expandable cards, allowing students to view additional information without leaving the dashboard.

### 💳 Fee Management

The fee section provides an overview of:

* Total semester fee
* Amount paid
* Remaining balance
* Payment deadline
* Fee breakdown

A detailed modal provides additional payment information.

### 📈 Academic Analytics

FLEX+ provides visual representations of academic performance:

* **Course Performance:** Bar chart comparing marks across courses.
* **Attendance Trend:** Line chart showing attendance progression.

### 🧮 Performance Calculator

Students can enter or modify course marks and calculate their average performance.

Input validation prevents invalid values such as marks below 0 or above 100.

### 👤 Student Profile

A dedicated profile modal provides quick access to:

* Student name
* Student ID
* Programme
* Email

### 🔄 Application States

The application provides dedicated UI states for:

* Loading
* Empty data
* Search with no results
* Warnings
* Validation errors
* Successful updates
* Normal dashboard operation

---

## Tech Stack

| Technology                 | Purpose                             |
| -------------------------- | ----------------------------------- |
| **React Native**           | Mobile application framework        |
| **Expo**                   | Development and application runtime |
| **JavaScript**             | Application logic                   |
| **react-native-chart-kit** | Academic charts and visualization   |
| **react-native-svg**       | Chart rendering dependency          |

---

## Getting Started

### Prerequisites

To run the project locally, you will need:

* Node.js
* npm
* Expo CLI
* Android Studio / Android Emulator or a physical mobile device

Alternatively, the project can be run directly using **Expo Snack**.

---

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd FLEX+
```

Install dependencies:

```bash
npm install
```

Install the required chart libraries if they are not already present:

```bash
npm install react-native-chart-kit react-native-svg
```

---

### Run the Application

Start the Expo development server:

```bash
npx expo start
```

You can then:

* Scan the QR code using **Expo Go**
* Press `a` to launch the Android emulator
* Press `i` to launch the iOS simulator on macOS
* Open the development build in a compatible environment

> **Note:** The project uses `react-native-chart-kit`. For the most reliable chart rendering, use an Android or iOS environment rather than the web preview.

---

## Running with Expo Snack

FLEX+ can also be run without a local development environment.

1. Open [Expo Snack](https://snack.expo.dev/)
2. Create a new Snack.
3. Add the project files according to the structure below.
4. Add:

   * `react-native-chart-kit`
   * `react-native-svg`
5. Start the preview using an Android or iOS environment.

---

## Project Structure

```text
FLEX+/
├── App.js
├── theme.js
├── package.json
├── app.json
│
├── data/
│   └── mockData.js
│
└── components/
    ├── Header.js
    ├── SummaryCard.js
    ├── SectionHeader.js
    ├── StatusBadge.js
    ├── AttendanceBar.js
    ├── EmptyState.js
    ├── AttentionCard.js
    ├── CourseCard.js
    ├── AssignmentCard.js
    ├── AnnouncementCard.js
    ├── QuickAction.js
    ├── CourseDetailsModal.js
    ├── FeeDetailsModal.js
    ├── ProfileModal.js
    └── AnalyticsSection.js
```

### Architecture

The application follows a component-based React Native structure.

* `App.js` — Main application and dashboard state
* `theme.js` — Shared design tokens
* `data/mockData.js` — Demo student and academic data
* `components/` — Reusable UI components
* `AnalyticsSection.js` — Academic charts and performance calculator
* Modal components — Detailed course, fee, and profile information

This structure keeps the application modular and makes individual components easier to maintain and extend.

---

## Data

The current version uses **mock academic data** to demonstrate the application's functionality.

The data layer is separated from the UI through:

```text
data/mockData.js
```

This makes it possible to replace the mock data with a backend/API integration in a future version without redesigning the entire interface.

---

## Future Scope

Potential future improvements include:

* University authentication
* Integration with the actual FLEX backend/API
* Real-time attendance synchronization
* Push notifications for deadlines and attendance warnings
* Course timetable integration
* Examination schedule
* Result and transcript integration
* Online fee payment
* Faculty communication
* Backend database integration
* Persistent student data

---

## Project Status

**Prototype / Academic Project**

FLEX+ is currently a functional frontend prototype demonstrating an improved student portal experience using React Native and Expo.

---

## License

This project was developed for academic and educational purposes.

---

### Built with React Native + Expo
