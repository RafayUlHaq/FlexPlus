// ============================================================
// FLEX+ Mock Data
// All UI is driven from these objects — no hardcoded values in JSX
// ============================================================

// ── Student profile ─────────────────────────────────────────
export const student = {
  name: 'Rafay Ul Haq',
  firstName: 'Rafay',
  id: 'BS-2021-SE-047',
  program: 'BS Software Engineering',
  semester: 7,
  cgpa: 3.42,
  totalCredits: 18,
  email: 'rafay.ulhaq@university.edu.pk',
  department: 'Department of Computer Science',
  batch: '2021',
};

// ── Courses ──────────────────────────────────────────────────
// attendance   → current percentage (recalculated dynamically when classes change)
// attended     → classes attended so far
// total        → total classes held so far
// marks        → current marks out of 100
export const initialCourses = [
  {
    id: 1,
    code: 'SE-301',
    name: 'Software Engineering',
    instructor: 'Dr. Ahmed Raza',
    attendance: 68,
    attended: 17,
    total: 25,
    marks: 74,
    creditHours: 3,
    upcomingAssignment: 'SRS Document Submission',
    assignmentDeadline: 'Sep 30, 2026',
  },
  {
    id: 2,
    code: 'CS-402',
    name: 'Mobile Application Development',
    instructor: 'Dr. Usman Khan',
    attendance: 88,
    attended: 22,
    total: 25,
    marks: 86,
    creditHours: 3,
    upcomingAssignment: 'React Native Assignment',
    assignmentDeadline: 'Tomorrow',
  },
  {
    id: 3,
    code: 'CS-403',
    name: 'Artificial Intelligence',
    instructor: 'Dr. Sara Ali',
    attendance: 79,
    attended: 19,
    total: 24,
    marks: 81,
    creditHours: 3,
    upcomingAssignment: 'Search Algorithms Report',
    assignmentDeadline: 'Oct 5, 2026',
  },
  {
    id: 4,
    code: 'CS-404',
    name: 'Database Systems',
    instructor: 'Dr. Bilal Mirza',
    attendance: 72,
    attended: 18,
    total: 25,
    marks: 70,
    creditHours: 3,
    upcomingAssignment: 'ER Diagram + Normalization',
    assignmentDeadline: 'Oct 3, 2026',
  },
  {
    id: 5,
    code: 'CS-405',
    name: 'Computer Networks',
    instructor: 'Dr. Hina Siddiqui',
    attendance: 92,
    attended: 23,
    total: 25,
    marks: 89,
    creditHours: 3,
    upcomingAssignment: 'Network Topology Design',
    assignmentDeadline: 'Oct 8, 2026',
  },
  {
    id: 6,
    code: 'HU-301',
    name: 'Technical Writing',
    instructor: 'Ms. Amna Tariq',
    attendance: 85,
    attended: 17,
    total: 20,
    marks: 78,
    creditHours: 3,
    upcomingAssignment: 'Research Paper Draft',
    assignmentDeadline: 'Oct 10, 2026',
  },
];

// ── Assignments / deadlines ──────────────────────────────────
export const assignments = [
  {
    id: 1,
    course: 'Mobile Application Development',
    code: 'CS-402',
    title: 'React Native Assignment',
    dueDate: 'Tomorrow',
    priority: 'high',
    description: 'Build a fully functional React Native app with state management, charts, and reusable components.',
  },
  {
    id: 2,
    course: 'Software Engineering',
    code: 'SE-301',
    title: 'SRS Document Submission',
    dueDate: 'Sep 30, 2026',
    priority: 'high',
    description: 'Submit the Software Requirements Specification document for your group project.',
  },
  {
    id: 3,
    course: 'Database Systems',
    code: 'CS-404',
    title: 'ER Diagram + Normalization',
    dueDate: 'Oct 3, 2026',
    priority: 'medium',
    description: 'Design an ER diagram for the library management system and normalize to 3NF.',
  },
  {
    id: 4,
    course: 'Artificial Intelligence',
    code: 'CS-403',
    title: 'Search Algorithms Report',
    dueDate: 'Oct 5, 2026',
    priority: 'medium',
    description: 'Compare BFS, DFS, A* and heuristic search algorithms with practical examples.',
  },
  {
    id: 5,
    course: 'Computer Networks',
    code: 'CS-405',
    title: 'Network Topology Design',
    dueDate: 'Oct 8, 2026',
    priority: 'low',
    description: 'Design a network topology for a medium-sized enterprise using Cisco Packet Tracer.',
  },
  {
    id: 6,
    course: 'Technical Writing',
    code: 'HU-301',
    title: 'Research Paper Draft',
    dueDate: 'Oct 10, 2026',
    priority: 'low',
    description: 'Submit first draft of the research paper (min 2000 words) with references.',
  },
];

// ── Announcements ────────────────────────────────────────────
export const announcements = [
  {
    id: 1,
    title: 'Midterm Examination Schedule Published',
    description:
      'The midterm examination schedule for Semester 7 has been finalized. Exams will be held from October 14–20, 2026. Students are advised to check the timetable on the notice board.',
    date: 'Today',
    type: 'academic',
    icon: '📋',
  },
  {
    id: 2,
    title: 'Fee Submission Deadline — September 30',
    description:
      'The last date for fee submission without a late fine is September 30, 2026. A fine of PKR 500/day will be charged after the deadline. Visit the accounts office or pay online via the portal.',
    date: 'Today',
    type: 'fee',
    icon: '💳',
  },
  {
    id: 3,
    title: 'Semester Project Groups Finalized',
    description:
      'Group assignments for Software Engineering semester projects have been finalized. Please coordinate with your assigned group and Dr. Ahmed Raza for the kickoff meeting.',
    date: 'Sep 27, 2026',
    type: 'academic',
    icon: '👥',
  },
  {
    id: 4,
    title: 'Campus Wi-Fi Upgrade — Downtime Notice',
    description:
      'The IT department will perform a campus-wide Wi-Fi infrastructure upgrade on September 29 from 10 PM to 2 AM. Internet access will be unavailable during this window.',
    date: 'Sep 26, 2026',
    type: 'general',
    icon: '📡',
  },
  {
    id: 5,
    title: 'Guest Lecture: Industry 4.0 and AI',
    description:
      'A guest lecture by Mr. Tariq Jameel (CTO, TechCorp Pakistan) on Industry 4.0 trends and AI applications in industry will be held on October 2 at 2 PM in Auditorium A.',
    date: 'Sep 25, 2026',
    type: 'event',
    icon: '🎤',
  },
];

// ── Fee information ──────────────────────────────────────────
export const feeData = {
  semesterFee: 145000,
  paid: 120000,
  dueDate: 'September 30, 2026',
  breakdown: [
    { label: 'Tuition Fee', amount: 120000 },
    { label: 'Lab Charges', amount: 10000 },
    { label: 'Library Fee', amount: 5000 },
    { label: 'Sports & Activities', amount: 5000 },
    { label: 'Examination Fee', amount: 5000 },
  ],
};

// ── Weekly attendance trend (for Line Chart) ─────────────────
export const attendanceTrend = {
  labels: ['Wk1', 'Wk2', 'Wk3', 'Wk4', 'Wk5', 'Wk6'],
  data: [82, 80, 84, 79, 85, 83],
};

// ── Priority sort order (used with .sort()) ──────────────────
export const priorityOrder = { high: 0, medium: 1, low: 2 };
