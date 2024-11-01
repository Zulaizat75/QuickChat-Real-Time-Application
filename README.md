QuickChat: Small project to create real-time direct chat application
Preview Checkout: (https://rte-chatapp.web.app/).

A responsive and interactive chat application featuring real-time messaging, user profiles, and media sharing. Built with React, Firebase, and modern CSS, this application provides an intuitive and engaging user experience for seamless communication.
Table of Contents

    Features
    Tech Stack
    Usage
    Folder Structure

Features

    Real-time Messaging: Instantly send and receive messages with live updates.
    User Authentication: Secure sign-in and sign-out using Firebase Auth.
    Profile Management: Update profile information and avatar images.
    Media Sharing: View and share media files within the chat.
    Responsive Design: Optimized for both desktop and mobile screens.

Tech Stack

    Frontend: React + Vite, CSS
    Backend: Firebase Authentication, Firestore Database
    Image Upload: Firebase Storage


Usage

    Sign Up / Log In: Register with your email and password.
    Update Profile: Update your display name, bio, and profile image.
    Send Messages: Type a message and hit Enter to send.
    Toggle Sidebar: Use the sidebar to view chat participants and media history.
    View Media: Click on shared images to expand and view.

Folder Structure


src
├── assets                 # Static assets like images and icons
├── components             # Reusable components (e.g., ChatBox, Sidebars)
├── config                 # Firebase and other configuration files
├── context                # App context for state management
├── pages                  # Main page components (Chat, ProfileUpdate, Login)
├── App.js                 # Root component
└── index.js               # Entry point for React



