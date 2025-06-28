"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Code2, ExternalLink, Github, Trophy, Moon, Sun, Mail, Linkedin, Twitter, Phone } from "lucide-react"

// Static data
const projectsData = {
  "projects": [
    {
      "id": 1,
      "title": "Accuia",
      "description": "Chat with Your Database. Transform complex data into simple conversations. Search, explore, and interact with your product catalog using natural language — no SQL required.",
      "status": "Personal",
      "demoUrl": "https://accuia.vercel.app/",
      "technologies": ["AI", "NextJS", "FastAPI", "Supabase", "Postgres"]
    },
    {
      "id": 2,
      "title": "reminder-cli",
      "description": "A simple Node.js command-line tool that allows users to set reminders for tasks or events directly from the terminal. Over 350+ downloads and growing.",
      "status": "Personal",
      "demoUrl": "https://www.npmjs.com/package/@altamsh04/reminder-cli",
      "codeUrl": "https://github.com/altamsh04/reminder-cli",
      "technologies": ["NodeJS", "CLI", "Task Manager", "Terminal", "Productivity"]
    },
    {
      "id": 3,
      "title": "NPM Analytics Pro",
      "description": "Advanced package insights & comparison tool for NPM modules including trends, bundle analysis, and health scoring.",
      "status": "Personal",
      "demoUrl": "https://npm-analytics-pro.altamsh.me/",
      "technologies": ["NextJS", "TailwindCSS", "Vercel", "NPM API"]
    },
    {
      "id": 4,
      "title": "Ghibli Meme Maker",
      "description": "Transform your favorite Studio Ghibli moments into hilarious memes with our easy-to-use meme creator.",
      "status": "Personal",
      "demoUrl": "https://www.ghiblimemes.fun/",
      "technologies": ["React", "TailwindCSS", "Meme Editor"]
    },
    {
      "id": 5,
      "title": "AI Powered LMS",
      "description": "A learning management system powered by AI, using RAG (Retrieval-Augmented Generation) architecture for enhanced learning experiences.",
      "status": "Hackathon",
      "codeUrl": "https://github.com/altamsh04/aipoweredlms-backend",
      "technologies": ["AI", "RAG", "AWS S3", "React", "Django"]
    },
    {
      "id": 6,
      "title": "Collaborative Project Management Tools for Remote Teams",
      "description": "A comprehensive project management tool designed for remote teams to collaborate effectively.",
      "status": "Hackathon",
      "codeUrl": "https://github.com/altamsh04/hackathon-project-at-sgu",
      "technologies": ["MongoDB", "Express", "React", "NodeJS"]
    },
    {
      "id": 7,
      "title": "Embeetek Technologies",
      "description": "Personal organization website for project inquiry, project showcase, overall company services, features with admin panel.",
      "status": "Freelance",
      "demoUrl": "https://www.embeetek.com/",
      "technologies": ["FullStack"]
    },
    {
      "id": 8,
      "title": "Basu Engineering",
      "description": "Personal Organization website for products inquiry, overall company services, features etc with admin panel.",
      "status": "Freelance",
      "demoUrl": "http://www.basuengineering.in",
      "technologies": ["FullStack"]
    }
  ]
};


const experienceData = {
  experiences: [
    {
      id: 1,
      title: "Software Developer",
      company: "Embeetek Technologies · Freelance",
      location: "Miraj Maharashtra, India · Hybrid",
      startDate: "2025-01-01",
      endDate: null,
      current: true,
      description:
        "As a Freelance Software Developer at Embeetek Technologies, I have successfully delivered over five software projects, specializing in cutting-edge technologies such as Artificial Intelligence, Image Processing and full-stack web development.",
      achievements: [
        "Led the development of the official company website (www.embeetek.com) to highlight services, portfolio, and unique features.",
        "Developed RESTful APIs for managing vital health data, integrated with IoT devices and real-time databases using Firebase.",
        "Implemented accident reduction systems using computer vision and real-time communication via the MQTT protocol.",
        "Developed Smart AI Glasses for interpreting sign language, leveraging Google's Teachable Machine for model training and deployment.",
      ],
      technologies: ["Computer Vision", "AI", "ML", "Firebase", "React", "NodeJS", "MQTT"],
    },
    {
      id: 2,
      title: "Software Developer",
      company: "Knam Construction · Freelance",
      location: "Miraj Maharashtra, India · Remote",
      startDate: "2024-11-01",
      endDate: "2025-02-28",
      current: false,
      description:
        "As a Freelance Software Developer at Knam Construction, I have been responsible for designing and building software solutions tailored to streamline construction management operations.",
      achievements: [
        "Led the development of impactful software project that enhanced operational workflows and significantly reduced manual effort.",
        "Built 'SiteIQ', a custom platform for Site management, Payment tracking, Vendor  coordination and Material logistics.",
        "This solution reduced manual paperwork by over 70% and improved overall team efficiency.",
      ],
      technologies: ["React", "NodeJS", "RESTful APIs", "Firebase"],
    },
  ],
}

const achievementsData = [
  {
    name: "Gate 2025 Qualified",
    issuer: "Hosted By IIT Roorkee",
    year: "2025",
    description: "Competitive exams for engineering",
  },
  {
    name: "Android Team Lead",
    issuer: "GDG On Campus, RIT",
    year: "2025",
    description: "Google developers groups, Lead android team",
  },
]

const educationData = {
  education: [
    {
      id: 1,
      degree: "BTech in Computer Science (Current)",
      institution: "Rajarambapu Institute Of Technology",
      location: "Uran Islampur, Maharashtra",
      startDate: "2023",
      endDate: "2026",
      gpa: "8.5/10",
      honors: [
        "Operating System",
        "Computer Networking",
        "Database Management",
        "Machine Learning",
        "Research",
        "GDG Android Lead",
      ],
    },
    {
      id: 2,
      degree: "Diploma in Computer Enginnering",
      institution: "Government Polytechnic Miraj",
      location: "Miraj, Maharashtra",
      startDate: "2020",
      endDate: "2023",
      gpa: "92.91%",
      honors: ["C", "C++", "Java", "Python", "Web", "Android"],
    },
    {
      id: 3,
      degree: "SSC",
      institution: "Vidya Mandir Prashala, Miraj",
      location: "Miraj, Maharashtra",
      startDate: "2019",
      endDate: "2020",
      gpa: "83.40%",
      honors: ["Maths", "Science", "English", "etc"],
    },
  ],
}

export default function Portfolio() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth()
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (years > 0 && remainingMonths > 0) {
      return `${years}y ${remainingMonths}m`
    } else if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}`
    } else {
      return `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-mono">
      {/* Theme Toggle - Fixed Top Right */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="border-slate-300 dark:border-slate-600 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
        >
          {theme === "dark" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
        </Button>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-12 sm:pt-16 md:pt-20 pb-4 sm:pb-6 space-y-5 sm:space-y-6">
        {/* Hero Section */}
        <section className="text-center space-y-3">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Altamsh Bairagdar
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-2">
              A Full Stack Developer Who Loves Backend Most
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 text-sm text-slate-500 dark:text-slate-400 px-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>Miraj Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Available for work</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 px-2">
            <Button
              variant="outline"
              size="sm"
              className="text-sm sm:text-base border-slate-300 dark:border-slate-600 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors px-4 py-2 h-10"
              onClick={() => window.open("http://github.com/altamsh04", "_blank")}
            >
              <Github className="w-4 h-4 mr-2" />
              GITHUB
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-sm sm:text-base border-slate-300 dark:border-slate-600 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors px-4 py-2 h-10"
              onClick={() => window.open("https://www.linkedin.com/in/altamsh-bairagdar-324ab7254", "_blank")}
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LINKEDIN
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-sm sm:text-base border-slate-300 dark:border-slate-600 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors px-4 py-2 h-10"
              onClick={() => window.open("https://x.com/altamsh04", "_blank")}
            >
              <Twitter className="w-4 h-4 mr-2" />
              X/TWITTER
            </Button>
            <Button
              size="sm"
              className="bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold transition-colors text-sm sm:text-base px-4 py-2 h-10"
              onClick={() => window.open("mailto:bairagdaraltamsh@gmail.com", "_blank")}
            >
              <Mail className="w-4 h-4 mr-2" />
              CONTACT
            </Button>
          </div>
        </section>

        {/* Projects */}
        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1">
            PROJECTS
          </h3>
          <div className="space-y-2.5">
            {projectsData.projects.map((project) => (
              <Card
                key={project.id}
                className="border-slate-200 dark:border-slate-800 hover:border-lime-400 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="space-y-3">
                    {/* Header with title and status */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">{project.title}</h4>
                      <Badge className="bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-400 text-sm hover:bg-lime-200 dark:hover:bg-lime-900/50 transition-colors self-start">
                        {project.status}
                      </Badge>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Technologies */}
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="text-sm border-slate-300 dark:border-slate-600 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      {project.demoUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 sm:flex-none border-slate-300 dark:border-slate-600 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors h-10"
                          onClick={() => window.open(project.demoUrl, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          <span className="text-sm">Demo</span>
                        </Button>
                      )}
                      {project.codeUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 sm:flex-none border-slate-300 dark:border-slate-600 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors h-10"
                          onClick={() => window.open(project.codeUrl, "_blank")}
                        >
                          <Github className="w-4 h-4 mr-2" />
                          <span className="text-sm">Code</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1">
            EXPERIENCE
          </h3>
          <div className="space-y-3">
            {experienceData.experiences.map((exp) => (
              <Card
                key={exp.id}
                className="border-slate-200 dark:border-slate-800 hover:border-lime-400 hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{exp.title}</h4>
                          <p className="text-lime-600 dark:text-lime-400 font-medium text-sm sm:text-base">{exp.company}</p>
                        </div>
                        {exp.current && (
                          <Badge className="bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-400 text-sm hover:bg-lime-200 dark:hover:bg-lime-900/50 transition-colors self-start">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <span>{exp.location}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate!)}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <Badge variant="secondary" className="text-sm self-start sm:self-auto">
                          {calculateDuration(exp.startDate, exp.endDate)}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{exp.description}</p>
                    
                    {/* Achievements */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-slate-900 dark:text-slate-100 text-sm sm:text-base">KEY ACHIEVEMENTS:</h5>
                      <ul className="space-y-1.5">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                            <div className="w-2 h-2 bg-lime-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="text-sm border-slate-300 dark:border-slate-600 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1">
            ACHIEVEMENTS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievementsData.map((achievement) => (
              <Card
                key={achievement.name}
                className="border-slate-200 dark:border-slate-800 hover:border-lime-400 hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-lime-100 dark:bg-lime-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-tight">{achievement.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {achievement.issuer} • {achievement.year}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1 leading-relaxed">{achievement.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1">
            EDUCATION
          </h3>
          <div className="space-y-2.5">
            {educationData.education.map((edu) => (
              <Card
                key={edu.id}
                className="border-slate-200 dark:border-slate-800 hover:border-lime-400 hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{edu.degree}</h4>
                        <p className="text-lime-600 dark:text-lime-400 font-medium text-sm sm:text-base">{edu.institution}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                          <span>{edu.location}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>
                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-sm self-start sm:self-auto">
                        {edu.gpa}
                      </Badge>
                    </div>
                    
                    {/* Honors */}
                    {edu.honors && (
                      <div className="flex flex-wrap gap-2">
                        {edu.honors.map((honor) => (
                          <Badge
                            key={honor}
                            className="bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-400 text-sm hover:bg-lime-200 dark:hover:bg-lime-900/50 transition-colors"
                          >
                            {honor}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white mt-8">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-lime-400 rounded-lg flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-slate-900" />
                </div>
                <span className="text-sm font-bold">ALTAMSH.BAIRAGDAR</span>
              </div>
              <p className="text-slate-400 text-sm">Building the future, one line of code at a time.</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm">CONNECT</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  bairagdaraltamsh@gmail.com
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +91 8010208605
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Miraj Maharashtra, India
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm">LINKS</h4>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-slate-400 hover:border-lime-400 hover:text-lime-400 transition-colors p-2 h-10"
                  onClick={() => window.open("http://github.com/altamsh04", "_blank")}
                >
                  <Github className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-slate-400 hover:border-lime-400 hover:text-lime-400 transition-colors p-2 h-10"
                  onClick={() => window.open("https://www.linkedin.com/in/altamsh-bairagdar-324ab7254", "_blank")}
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-slate-400 hover:border-lime-400 hover:text-lime-400 transition-colors p-2 h-10"
                  onClick={() => window.open("https://x.com/altamsh04", "_blank")}
                >
                  <Twitter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-6 pt-4 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} ALTAMSH BAIRAGDAR. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
