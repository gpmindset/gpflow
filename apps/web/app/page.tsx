"use client"
import { Button } from "@gpflow/design/components/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="GPFlow Logo"
              width={32}
              height={32}
              className="bg-indigo-500 rounded-lg p-1"
            />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">GPFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/sgprakas/gpflow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              View on GitHub
            </a>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <div className="flex items-center gap-2">
                <Image 
                  src="/google.svg" 
                  alt="Google" 
                  width={20} 
                  height={20}
                />
                Try Demo
              </div>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="mb-6 text-indigo-600 dark:text-indigo-400 font-medium">Portfolio Project</div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Workflow Automation Demo with{" "}
              <span className="text-indigo-600 dark:text-indigo-400">GPFlow</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              A showcase of modern web development skills including React, Node.js, and real-time data processing. Built with Next.js, TypeScript, and WebSocket technology.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 text-lg"
                onClick={() => {/* Implement Demo */}}
              >
                Try Live Demo
              </Button>
              <a
                href="https://github.com/sgprakas/gpflow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 text-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-md"
              >
                View Source Code
              </a>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Frontend Technologies",
                description: "Built with Next.js 14, React, TypeScript, and Tailwind CSS for a modern, responsive UI",
                icon: "⚛️"
              },
              {
                title: "Backend Architecture",
                description: "Node.js with Express, WebSocket for real-time updates, and clean architecture principles",
                icon: "🔧"
              },
              {
                title: "Developer Experience",
                description: "Implemented with best practices, clean code, and comprehensive documentation",
                icon: "📚"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Project Highlights */}
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-16">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10" />
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Project Features</h2>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600">✓</span>
                  <span>Drag-and-drop workflow builder with React Flow</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600">✓</span>
                  <span>Real-time workflow execution monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600">✓</span>
                  <span>Custom node types with TypeScript</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600">✓</span>
                  <span>Responsive design with Tailwind CSS</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Built by Your Name • Portfolio Project • {new Date().getFullYear()}
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              GitHub
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              LinkedIn
            </a>
            <a href="mailto:your.email@example.com" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
