# FLEX+ — Your University, Simplified

A modern, mobile-first student portal built with React Native and Expo.  
Designed as a reimagination of traditional university portals like FLEX.

---

## Problem

Traditional university portals suffer from several well-known problems:

- **Information overload** — everything is shown at once with no prioritisation
- **Buried attendance data** — students have to navigate deep menus to find attendance per course
- **No early warnings** — students only discover attendance or performance issues at the end of semester
- **No deadline visibility** — assignment deadlines are scattered across course pages
- **Poor mobile experience** — legacy portals are not designed for smartphones
- **Disconnected sections** — marks, attendance, fee, and announcements all live in separate places

FLEX+ solves all of these by surfacing what matters right now on a single intelligent dashboard.

---

## Proposed Solution

FLEX+ is a single-screen academic dashboard that:

- **Prioritises** by showing a "Needs Your Attention" section with dynamically generated warnings
- **Summarises** CGPA, attendance, course count, and credits in 4 cards at the top
- **Alerts** students when attendance drops below 75% or marks are low
- **Tracks deadlines** with priority-sorted assignment cards
- **Shows progress visually** using attendance bars, marks bars, and charts
- **Lets students interact** — tap a course to see full details, mark classes attended or missed
- **Stays on one screen** — everything accessible via scroll, modals, and expandable sections

---

## Main Features

| Feature | Description |
|---|---|
| Personalised dashboard | Greeting with student name, programme, and semester |
| Academic summary | CGPA, attendance %, course count, total credits |
| Attendance monitoring | Per-course attendance bars with class counts |
| Dynamic warnings | Auto-generated alerts for low attendance and marks |
| Course search | Search by name, code, or instructor |
| Course filtering | Filter by Excellent / Safe / Warning / Low |
| Course details modal | Full stats, mark attended/missed, live recalculation |
| Assignment tracking | Priority-sorted deadline cards |
| Announcements | Expandable announcement cards with type badges |
| Fee status | Payment summary card + full breakdown modal |
| Bar chart | Course marks comparison (react-native-chart-kit) |
| Line chart | Weekly attendance trend (react-native-chart-kit) |
| Attendance status | Visual summary of excellent/safe/low course counts |
| Performance calculator | Edit marks, recalculate average, grade, validation |
| Loading state | Spinner + banner when dashboard refreshes |
| Empty state | Friendly messages when lists have no items |
| Refresh button | Simulates dashboard update with loading indicator |
| Profile modal | Student name, ID, programme, email |

---

## React Concepts Demonstrated

### Components
The app is broken into 14 reusable components. Each does one thing and receives data via props.

```
Header, SummaryCard, SectionHeader, StatusBadge, AttendanceBar,
EmptyState, AttentionCard, CourseCard, AssignmentCard,
AnnouncementCard, QuickAction, CourseDetailsModal,
FeeDetailsModal, ProfileModal, AnalyticsSection
```

### Props
Every component receives data from its parent. Example:

```jsx
<CourseCard
  course={course}       // data object as prop
  onPress={setSelectedCourse}  // function as prop
/>
```

### State (useState)
`App.js` manages all top-level state:

```js
const [courses, setCourses]             = useState(initialCourses);
const [searchQuery, setSearchQuery]     = useState('');
const [activeFilter, setActiveFilter]   = useState('All');
const [loading, setLoading]             = useState(false);
const [selectedCourse, setSelectedCourse] = useState(null);
const [showFeeModal, setShowFeeModal]   = useState(false);
const [showAnalytics, setShowAnalytics] = useState(false);
```

`AnnouncementCard` manages its own local `expanded` state.  
`CourseDetailsModal` manages local `attended`, `total`, and `feedback` state.  
`AnalyticsSection` manages `localMarks` and `validationError` state.

### Events
- `onPress` → open modals, scroll to sections, toggle analytics
- `onChangeText` → search input, marks calculator input
- `onUpdate` → bubble attendance change from modal back to App.js

### Conditional Rendering
Used throughout the app:

```jsx
{attentionAlerts.length === 0
  ? <EmptyState title="You're all caught up 🎉" />
  : attentionAlerts.map(alert => <AttentionCard ... />)
}
```

Also: loading banner, last-updated label, search clear button, feedback message in modal.

### Lists and Keys
Every list renders using `.map()` with a unique `key` prop:

```jsx
{filteredCourses.map(course => (
  <CourseCard key={course.id} course={course} onPress={setSelectedCourse} />
))}
```

### Forms and Controlled TextInput
Search bar and performance calculator both use controlled inputs:

```jsx
<TextInput
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Search courses..."
/>
```

### Data-driven UI
No values are hardcoded in JSX. All content comes from `data/mockData.js`:

```js
const summaryCards = [
  { icon: '🎓', label: 'CGPA', value: summaryStats.cgpa, color: COLORS.primary },
  ...
];
// Rendered with .map() — adding a card requires only a data change
```

### Reusable Components
`SummaryCard`, `StatusBadge`, `AttendanceBar`, `EmptyState`, and `SectionHeader`
are used in multiple places with different props.

---

## JavaScript Concepts

### Arrays and Objects
All data lives in plain JS arrays and objects in `data/mockData.js`:

```js
export const initialCourses = [ { id: 1, code: 'SE-301', ... }, ... ];
export const student = { name: 'Rafay Ul Haq', cgpa: 3.42, ... };
```

### .map()
Used to render every list. Example — course cards:

```js
filteredCourses.map(course => <CourseCard key={course.id} course={course} />)
```

### .filter()
Used for course search, attendance filtering, and alert generation:

```js
// Alert generation
courses.filter(c => Math.round((c.attended / c.total) * 100) < 75)
       .forEach(c => alerts.push({ ... }));

// Search
courses.filter(c =>
  c.name.toLowerCase().includes(query) ||
  c.code.toLowerCase().includes(query)
)
```

### .find()
Used in `handleCourseUpdate` to locate a course by id before replacing it.

### .reduce()
Used to calculate total credits and average attendance:

```js
const totalCredits = courses.reduce((sum, c) => sum + c.creditHours, 0);

// Also in AnalyticsSection performance calculator
const total = courses.reduce((sum, c) => sum + c.marks, 0);
return (total / courses.length).toFixed(1);
```

### .sort()
Assignments are sorted by priority before rendering:

```js
[...assignments].sort(
  (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
)
```

### Arrow Functions
Used for all handlers, helpers, and inline callbacks throughout the codebase.

### Template Literals
Used for dynamic strings:

```js
`${c.name} — ${pct}% attendance`
`Semester ${student.semester}`
```

### Destructuring
Used when reading props and object fields:

```js
const { course, title, dueDate, priority } = assignment;
const { semesterFee, paid, dueDate, breakdown } = feeData;
```

### Conditions
Ternary operators and short-circuit `&&` used for conditional rendering and
dynamic style/color selection throughout the app.

---

## Advanced Features

| Feature | How it works |
|---|---|
| Search | Controlled `TextInput` + `.filter()` on name, code, instructor |
| Filtering | Filter chip state + `.filter()` comparing attendance % to thresholds |
| Dynamic warnings | `useMemo` over courses array, generates alert objects using `.forEach` |
| Attendance calculation | `Math.round((attended / total) * 100)` — never a hardcoded % |
| Interactive course cards | Tapping sets `selectedCourse` state → opens modal with live data |
| Mark attended/missed | Updates `attended`/`total` in modal state, calls `onUpdate` to sync App.js |
| Validation | Marks input checked for `isNaN`, `< 0`, `> 100` with error message |
| Multiple app states | Normal, loading, empty, search-empty, warning, success, all-clear |
| Charts | `BarChart` for marks, `LineChart` for attendance trend — both from `react-native-chart-kit` |

---

## Setup — Running in Expo Snack

1. Go to **https://snack.expo.dev**
2. Click the **files** icon (top left) to open the file panel
3. Delete the default `App.js` content
4. Create the following file structure by clicking the `+` button:

```
App.js
theme.js
data/
  mockData.js
components/
  Header.js
  SummaryCard.js
  SectionHeader.js
  StatusBadge.js
  AttendanceBar.js
  EmptyState.js
  AttentionCard.js
  CourseCard.js
  AssignmentCard.js
  AnnouncementCard.js
  QuickAction.js
  CourseDetailsModal.js
  FeeDetailsModal.js
  ProfileModal.js
  AnalyticsSection.js
```

5. Paste each file's content into the corresponding Snack file
6. In the **Dependencies** panel (bottom left), add:

```
react-native-chart-kit   6.12.0
react-native-svg         13.9.0
```

7. Click **Run** — the app will load in the Expo preview on the right

> **Tip:** Use the Android or iOS preview tab. The Web preview may not render charts correctly.

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `expo` | ~49.0.0 | Expo SDK |
| `react` | 18.2.0 | React core |
| `react-native` | 0.72.6 | React Native framework |
| `react-native-chart-kit` | 6.12.0 | BarChart + LineChart |
| `react-native-svg` | 13.9.0 | Required peer dependency for chart-kit |

---

## File Structure

```
FlexUp/
├── App.js                        ← Main dashboard (all state lives here)
├── theme.js                      ← Design tokens: colors, fonts, spacing
├── package.json
├── app.json
├── data/
│   └── mockData.js               ← All mock data (student, courses, etc.)
└── components/
    ├── Header.js                 ← Greeting + avatar button
    ├── SummaryCard.js            ← CGPA / attendance / courses / credits card
    ├── SectionHeader.js          ← Reusable section title + right label
    ├── StatusBadge.js            ← Colour pill (Excellent / Safe / Low etc.)
    ├── AttendanceBar.js          ← Visual progress bar
    ├── EmptyState.js             ← Empty list placeholder
    ├── AttentionCard.js          ← Warning / alert card
    ├── CourseCard.js             ← Tappable course card with bars
    ├── AssignmentCard.js         ← Deadline card with priority indicator
    ├── AnnouncementCard.js       ← Expandable announcement card
    ├── QuickAction.js            ← Icon + label action button
    ├── CourseDetailsModal.js     ← Full course detail + mark attended/missed
    ├── FeeDetailsModal.js        ← Fee breakdown + progress
    ├── ProfileModal.js           ← Student profile info
    └── AnalyticsSection.js       ← BarChart + LineChart + Performance Calculator
```

---

## VIVA GUIDE

Use this section to answer your professor's questions during the viva.

---

### "Where are you using state?"

**File:** `App.js` (lines ~50–70)

```js
const [courses, setCourses] = useState(initialCourses);   // live course data
const [searchQuery, setSearchQuery] = useState('');        // search bar
const [activeFilter, setActiveFilter] = useState('All');   // filter chips
const [loading, setLoading] = useState(false);             // refresh state
const [selectedCourse, setSelectedCourse] = useState(null); // open modal
```

Also:
- `AnnouncementCard.js` — `expanded` state (each card expands independently)
- `CourseDetailsModal.js` — `attended`, `total`, `feedback` state
- `AnalyticsSection.js` — `localMarks`, `validationError` state

---

### "Where are you using props?"

**File:** `CourseCard.js`

```jsx
export default function CourseCard({ course, onPress }) { ... }
```

Called in `App.js` as:

```jsx
<CourseCard course={course} onPress={setSelectedCourse} />
```

Every component in `components/` receives data via props. Check `SummaryCard`, `AttendanceBar`, `StatusBadge` for the simplest examples.

---

### "Where is conditional rendering?"

Multiple locations:

1. **Attention alerts** — `App.js` section 4:
   ```jsx
   {attentionAlerts.length === 0 ? <EmptyState ... /> : alerts.map(...)}
   ```

2. **Loading banner** — `App.js` top:
   ```jsx
   {loading && <View style={styles.loadingBanner}>...</View>}
   ```

3. **Search empty state** — `App.js` course section:
   ```jsx
   {filteredCourses.length === 0 ? <EmptyState ... /> : filteredCourses.map(...)}
   ```

4. **Announcement expand** — `AnnouncementCard.js`:
   ```jsx
   {expanded ? <Text>{description}</Text> : null}
   ```

5. **Feedback message** — `CourseDetailsModal.js`:
   ```jsx
   {feedback ? <View style={styles.feedbackBox}>...</View> : null}
   ```

6. **Fee status colour** — dynamic based on `remaining === 0`

---

### "Where are you using .map()?"

Used in every list render. Key locations:

| File | What it maps |
|---|---|
| `App.js` | `summaryCards.map()` → 4 SummaryCards |
| `App.js` | `filteredCourses.map()` → CourseCard list |
| `App.js` | `sortedAssignments.map()` → AssignmentCard list |
| `App.js` | `announcements.map()` → AnnouncementCard list |
| `App.js` | `quickActions.map()` → QuickAction buttons |
| `FeeDetailsModal.js` | `breakdown.map()` → fee breakdown rows |
| `ProfileModal.js` | `fields.map()` → profile field rows |
| `AnalyticsSection.js` | `courses.map()` → bar chart data + calculator inputs |

---

### "Where are you using .filter()?"

| File | Purpose |
|---|---|
| `App.js` — `filteredCourses` useMemo | Filter by search query AND attendance status chip |
| `App.js` — `attentionAlerts` useMemo | `.filter(c => marks < 70)` for performance alerts |
| `AnalyticsSection.js` | `.filter()` to count excellent/safe/low courses for status summary |

---

### "Where are you using .find()?"

`App.js` — `handleCourseUpdate`:

```js
setCourses(prev =>
  prev.map(c => (c.id === updatedCourse.id ? updatedCourse : c))
);
```

The `.map()` here effectively does a find-and-replace in a single pass.

---

### "Where are you using .reduce()?"

`App.js` — `summaryStats` useMemo:

```js
const totalCredits = courses.reduce((sum, c) => sum + c.creditHours, 0);
const avgAttendance = courses.reduce((sum, c) => sum + pct, 0) / courses.length;
```

`AnalyticsSection.js` — `calculateAverage`:

```js
const total = courses.reduce((sum, c) => sum + c.marks, 0);
return (total / courses.length).toFixed(1);
```

---

### "Where are you using .sort()?"

`App.js` — `sortedAssignments` useMemo:

```js
const sortedAssignments = useMemo(
  () => [...assignments].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  ),
  []
);
```

`priorityOrder` is defined in `mockData.js` as `{ high: 0, medium: 1, low: 2 }`.

---

### "Where is your form / input?"

Two places:

1. **Search bar** — `App.js`, courses section:
   - Controlled `TextInput` with `value` and `onChangeText`
   - Live filtering as the user types

2. **Performance calculator** — `AnalyticsSection.js`:
   - One `TextInput` per course
   - Controlled via `localMarks` state object
   - `keyboardType="numeric"` for mobile keyboard
   - Shows calculated average below the inputs

---

### "Where is validation?"

`AnalyticsSection.js` — `handleMarksChange`:

```js
if (isNaN(num)) {
  setValidationError('Marks must be a number.');
  return;
}
if (num < 0 || num > 100) {
  setValidationError('Marks must be between 0 and 100.');
  return;
}
```

The error message renders conditionally below the inputs.

---

### "Where are the two chart types?"

`AnalyticsSection.js`:

- **BarChart** (from `react-native-chart-kit`) — "Course Performance" — marks per course
- **LineChart** (from `react-native-chart-kit`) — "Attendance Trend" — weekly percentages

Both charts use data derived from props via `.map()` — no manually duplicated values.

---

### "Where are reusable components?"

Point to any of these components used in multiple places:

- `SummaryCard` — used 4 times (CGPA, Attendance, Courses, Credits)
- `AttendanceBar` — used in `CourseCard`, `CourseDetailsModal`, `FeeDetailsModal`
- `StatusBadge` — used in `CourseCard`, `CourseDetailsModal`, `AssignmentCard`
- `EmptyState` — used in courses, assignments, announcements, attention section
- `SectionHeader` — used in every dashboard section and inside AnalyticsSection

---

### "How does attendance calculation work?"

Every attendance percentage is calculated from raw counts, never stored directly:

```js
const attendancePct = Math.round((course.attended / course.total) * 100);
```

When "Mark Attended" is pressed in the modal:
```js
const newAttended = attended + 1;  // +1 attended
const newTotal    = total + 1;     // +1 total classes
const newPct = Math.round((newAttended / newTotal) * 100);  // recalculate
```

This updated course object is passed to `onUpdate()` which calls `setCourses()` in `App.js`,
causing the entire dashboard (cards, bars, alerts) to re-render with the new value.

---

### "How does filtering work?"

1. User types in the search bar → `setSearchQuery` updates state
2. User taps a filter chip → `setActiveFilter` updates state
3. `filteredCourses` is a `useMemo` that re-runs whenever either changes:

```js
const filteredCourses = useMemo(() => {
  return courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(query) || ...;
    const pct = Math.round((c.attended / c.total) * 100);
    if (activeFilter === 'Low') return matchesSearch && pct < 75;
    ...
  });
}, [courses, searchQuery, activeFilter]);
```

The rendered list updates immediately — no button press needed.

---

### "Where are your application states?"

| State | Where to show |
|---|---|
| Normal | Dashboard with all data loaded |
| Loading | Press "Refresh Dashboard" → spinner appears for 1.5s |
| Empty (no alerts) | All attendance > 80% → "You're all caught up 🎉" |
| Search empty | Search for "xyz" → "No courses found" card |
| Validation error | Enter 150 in the calculator → red error message |
| Warning | SE-301 and DB Systems have < 75% attendance → danger cards |
| Success (feedback) | Mark a class attended in modal → green success message |

---

*Built with React Native + Expo for Mobile Application Development — Semester 7*
