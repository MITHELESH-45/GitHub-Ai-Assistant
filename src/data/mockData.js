export const dummyData = {
  summary: {
    purpose: "This repository is a full-stack MERN application for managing tasks, designed for high scalability and real-time collaboration. It enables seamless task tracking, assignment, and progress monitoring.",
    features: [
      "User authentication with JWT and bcrypt",
      "RESTful API integration connected to MongoDB",
      "Real-time updates via WebSockets (Socket.io)",
      "Responsive React frontend tailored with Tailwind CSS"
    ],
    analytics: {
      stars: "1.2k+",
      forks: 342,
      openIssues: 28,
      contributors: 14
    }
  },
  qa: [
    {
      question: "Where is authentication implemented?",
      answer: "Authentication logic is handled in auth.js using JWT for session management and password hashing.",
      source: "src/auth.js"
    },
    {
      question: "How does the app handle real-time events?",
      answer: "The application uses Socket.io to emit and listen for task creation and update events in real-time.",
      source: "server/socket.js"
    }
  ],
  techStack: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "Tailwind CSS"],
  suggestions: [
    {
      type: "warning",
      text: "Add input validation for API endpoints to prevent injection attacks."
    },
    {
      type: "improvement",
      text: "Optimize database queries using compound indexing for frequently filtered fields."
    },
    {
      type: "improvement",
      text: "Improve error handling by implementing a global error handler module."
    }
  ]
};
