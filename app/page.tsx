"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Code2, ExternalLink, Github, Trophy, Moon, Sun, Mail, Linkedin, Twitter, Phone, ArrowUp } from "lucide-react"

// Static data
const projectsData = {
  "projects": [
    {
      "id": 1,
      "title": "InfraAI - AI-Powered System Design Platform",
      "icon": "/infra-ai-logo.svg",
      "description": "Built comprehensive AI-powered web application converting natural language descriptions to detailed system architecture diagrams using Gemini 1.5 Flash with multi-turn conversation support and React Flow for interactive visual rendering of 50+ components and relationships, achieving 95% accuracy in architecture generation",
      "demoUrl": "https://infra-ai.altamsh.me/",
      "technologies": ["TypeScript", "Next.js", "React Flow", "Supabase", "Gemini 1.5", "NLP", "GENAI"]
    },
    {
      "id": 2,
      "title": "AIPoweredLMS Backend",
      "icon": "/school.svg",
      "description": "Developed highly scalable RAG backend system processing diverse educational content (PDFs, PPTs, documents) via AWS S3 with vector embeddings, featuring AI-driven note summarization, adaptive quiz generation across difficulty levels, and interactive concept visualizations achieving 90% accuracy",
      "codeUrl": "https://github.com/altamsh04/aipoweredlms-backend",
      "technologies": ["Python", "Django", "Vector DB", "AWS S3", "Gemini 1.5 Pro"]
    },
    {
      "id": 3,
      "title": "Accuia - Chat With Database",
      "icon": "/bot.svg",
      "description": "Built sophisticated AI platform enabling seamless natural language PostgreSQL interaction using advanced SQL RAG architecture with intelligent conversational interface, multi-turn context retention, and support for complex layered database queries achieving 95% query accuracy and eliminating SQL knowledge requirements",
      "demoUrl": "https://accuia.vercel.app/",
      "codeUrl": "https://github.com/altamsh04/accuia",
      "technologies": ["TypeScript", "Next.js", "FastAPI", "PostgreSQL", "Supabase", "Gemini 1.5 Pro"]
    },
    {
      "id": 4,
      "title": "Reminder-CLI (400+ Downloads)",
      "icon": "/terminal.svg",
      "description": "Developed feature-rich lightweight CLI productivity tool with advanced time-based scheduling capabilities, cross-platform compatibility, and intuitive command interface, published as open-source npm package achieving 390+ downloads with active community contributions and 98% user satisfaction rating",
      "demoUrl": "https://www.npmjs.com/package/@altamsh04/reminder-cli",
      "codeUrl": "https://github.com/altamsh04/reminder-cli",
      "technologies": ["JavaScript", "NodeJS", "CLI", "Task Manager", "Productivity"]
    },
    {
      "id": 5,
      "title": "NPM Analytics Pro",
      "icon": "/package.svg",
      "description": "Advanced package insights & comparison tool for NPM modules including trends, bundle analysis, and health scoring.",
      "demoUrl": "https://npm-analytics-pro.altamsh.me/",
      "technologies": ["NextJS", "TailwindCSS", "Vercel", "NPM API"]
    },
    {
      "id": 6,
      "title": "Ghibli Meme Maker",
      "icon": "/pencil.svg", 
      "description": "Transform your favorite Studio Ghibli moments into hilarious memes with our easy-to-use meme creator.",
      "demoUrl": "https://www.ghiblimemes.fun/",
      "technologies": ["React", "TailwindCSS", "Meme Editor"]
    }
  ]
};


const experienceData = {
  experiences: [
    {
      id: 1,
      title: "Full Stack Developer Intern",
      company: "Banza App · Internship",
      icon: "/banzaofficial_logo.jpeg",
      location: "Dubai · Remote",
      startDate: "2025-08-01",
      endDate: null,
      current: true,
      description:
        "Contributing to the development of a new platform for Banza App, enhancing user experience through full stack development and implementing robust data security measures.",
      achievements: [
        "Contributed to the development of a new platform for Banza App, enhancing user experience.",
        "Implemented OPzkTLS based data security, ensuring robust protection of sensitive information.",
        "Engaged in full stack development, gaining comprehensive technical expertise.",
      ],
      technologies: ["Full-Stack Development", "OPzkTLS"],
    },
    {
      id: 2,
      title: "Software Developer",
      company: "Embeetek Technologies · SDE Freelance",
      icon: "https://res.cloudinary.com/dhbuw3k2w/image/upload/v1744040070/embeetek.com/logo.png",
      location: "Miraj Maharashtra, India · Hybrid",
      startDate: "2025-01-01",
      endDate: "2025-06-01",
      current: false,
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
      id: 3,
      title: "Software Developer",
      company: "Knam Construction · SDE Freelance",
      icon: "/knam-logo.png",
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
    name: "Smart India Hackathon 2025 Winner",
    issuer: "Government of India",
    year: "2025",
    description: "National level hackathon",
    logo: "/sih_logo_png.png",
  },
  {
    name: "Gate 2025 Qualified",
    issuer: "Hosted By IIT Roorkee",
    year: "2025",
    description: "Competitive exam for engineers",
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
  const [animationStates, setAnimationStates] = useState({
    hero: false,
    projects: false,
    experience: false,
    achievements: false,
    education: false,
    footer: false
  })
  const [showGoTop, setShowGoTop] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    
    // Staggered animation timing
    const animationDelays = {
      hero: 200,
      projects: 600,
      experience: 1000,
      achievements: 1400,
      education: 1800,
      footer: 2200
    }

    // Trigger animations with delays
    Object.entries(animationDelays).forEach(([key, delay]) => {
      setTimeout(() => {
        setAnimationStates(prev => ({
          ...prev,
          [key]: true
        }))
      }, delay)
    })

    // Go to top button scroll listener
    const onScroll = () => {
      setShowGoTop(window.scrollY > 200)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
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
      {/* Go to Top Button */}
      {showGoTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold transition-colors text-xs p-3 rounded-full shadow-lg transition-all duration-300 border-2 border-white dark:border-slate-900"
          aria-label="Go to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
      {/* Theme Toggle - Fixed Top Right */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-10 h-10 p-0 rounded-full flex items-center justify-center border-slate-300 dark:border-slate-600 bg-white/90 dark:bg-slate-900/90 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors shadow-md"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-2 xs:px-3 sm:px-4 pt-10 xs:pt-12 sm:pt-16 md:pt-20 pb-3 xs:pb-4 sm:pb-6 space-y-4 xs:space-y-5 sm:space-y-6">
        {/* Hero Section */}
        <section 
          className={`text-center space-y-3 xs:space-y-4 sm:space-y-6 transition-all duration-1000 ease-out ${
            animationStates.hero 
              ? 'blur-0 opacity-100 translate-y-0' 
              : 'blur-md opacity-0 translate-y-4'
          }`}
        >
          <div className="space-y-2 xs:space-y-3 sm:space-y-4">
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
                  <img 
                    src="https://res.cloudinary.com/dhbuw3k2w/image/upload/fl_preserve_transparency/v1751700067/naruto_pfp.jpg"
                    alt="Altamsh Bairagdar"
                    className="w-full h-full max-w-full object-cover"
                  />
                </div>
              </div>
            </div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight break-words">
              Hi, I'm Altamsh Bairagdar
            </h2>
            <p className="text-xs xs:text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto px-2 break-words">
              Full Stack Developer who flirts with frontend but is madly in love with backend. Also casually teaching machines to think while they're still figuring out if I'm their creator or just another bug in the matrix. If there's an API to build, a database to tame, an AI model to sweet-talk, or a CLI tool that needs summoning, I'm already caffeinated and halfway through the job.
            </p>
          </div>
          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 px-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm border-slate-300 dark:border-slate-600 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors px-2 py-1 h-8 min-w-[90px]"
              onClick={() => window.open("http://github.com/altamsh04", "_blank")}
            >
              <Github className="w-3 h-3 mr-1" />
              GitHub
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm border-slate-300 dark:border-slate-600 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors px-2 py-1 h-8 min-w-[90px]"
              onClick={() => window.open("https://www.linkedin.com/in/altamsh04/  ", "_blank")}
            >
              <Linkedin className="w-3 h-3 mr-1" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm border-slate-300 dark:border-slate-600 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors px-2 py-1 h-8 min-w-[90px]"
              onClick={() => window.open("https://x.com/altamsh04", "_blank")}
            >
              <Twitter className="w-3 h-3 mr-1" />
              Twitter
            </Button>
            <Button
              size="sm"
              className="bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold transition-colors text-xs sm:text-sm px-2 py-1 h-8 min-w-[90px]"
              onClick={() => window.open("mailto:bairagdaraltamsh@gmail.com", "_blank")}
            >
              <Mail className="w-3 h-3 mr-1" />
              Contact
            </Button>
          </div>
        </section>

        {/* Projects */}
        <section 
          className={`space-y-2 xs:space-y-3 transition-all duration-1000 ease-out ${
            animationStates.projects 
              ? 'blur-0 opacity-100 translate-y-0' 
              : 'blur-md opacity-0 translate-y-4'
          }`}
        >
          <h3 className="text-sm xs:text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1">
            PROJECTS
          </h3>
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {projectsData.projects.map((project) => (
              <Card
                key={project.id}
                className="border-slate-200 dark:border-slate-800 hover:border-lime-400 hover:shadow-lg transition-all duration-300 h-full"
              >
                <CardContent className="p-4 xs:p-5 sm:p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={project.icon} alt={project.title + ' icon'} className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-md bg-slate-100 dark:bg-slate-800 object-contain max-w-full h-auto" />
                    <h4 className="text-base xs:text-lg font-bold text-slate-900 dark:text-slate-100 break-words">{project.title}</h4>
                  </div>
                  <p className="text-xs xs:text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2 xs:mb-3 flex-1 break-words">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1.5 xs:gap-2 mb-3 xs:mb-4">
                      {project.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="text-xs border-slate-300 dark:border-slate-600"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-1.5 xs:gap-2 mt-auto">
                    {project.demoUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-300 dark:border-slate-600"
                        onClick={() => window.open(project.demoUrl, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Website
                      </Button>
                    )}
                    {project.codeUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-300 dark:border-slate-600"
                        onClick={() => window.open(project.codeUrl, "_blank")}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Source
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section 
          className={`space-y-2 xs:space-y-3 transition-all duration-1000 ease-out ${
            animationStates.experience 
              ? 'blur-0 opacity-100 translate-y-0' 
              : 'blur-md opacity-0 translate-y-4'
          }`}
        >
          <h3 className="text-sm xs:text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1">
            EXPERIENCE
          </h3>
          <div className="space-y-2 xs:space-y-3">
            {experienceData.experiences.map((exp) => (
              <Card
                key={exp.id}
                className="border-slate-200 dark:border-slate-800 hover:border-lime-400 hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-3 xs:p-4 sm:p-5">
                  <div className="space-y-2 xs:space-y-3">
                    {/* Header */}
                    <div className="flex flex-col gap-1 xs:gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 xs:gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <img src={exp.icon} alt={exp.company + ' icon'} className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 rounded-md bg-slate-100 dark:bg-slate-800 object-contain max-w-full h-auto" />
                            <p className="text-lime-600 dark:text-lime-400 font-medium text-xs xs:text-sm sm:text-base break-words">{exp.company}</p>
                          </div>
                        </div>
                        {exp.current && (
                          <Badge className="bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-400 text-xs xs:text-sm hover:bg-lime-200 dark:hover:bg-lime-900/50 transition-colors self-start">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 xs:gap-1 sm:gap-2 text-xs xs:text-sm text-slate-500 dark:text-slate-400">
                        <span>{exp.location}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate!)}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <Badge variant="secondary" className="text-xs xs:text-sm self-start sm:self-auto">
                          {calculateDuration(exp.startDate, exp.endDate)}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-xs xs:text-sm sm:text-base text-slate-600 dark:text-slate-400 break-words">{exp.description}</p>
                    
                    {/* Achievements */}
                    <div className="space-y-1 xs:space-y-2">
                      <h5 className="font-medium text-slate-900 dark:text-slate-100 text-xs xs:text-sm sm:text-base">KEY ACHIEVEMENTS:</h5>
                      <ul className="space-y-1 xs:space-y-1.5">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-1 xs:gap-2 text-xs xs:text-sm sm:text-base text-slate-600 dark:text-slate-400">
                            <div className="w-2 h-2 bg-lime-400 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="leading-relaxed break-words">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 xs:gap-2">
                      {exp.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="text-xs xs:text-sm border-slate-300 dark:border-slate-600 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
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
        <section 
          className={`space-y-2 xs:space-y-3 transition-all duration-1000 ease-out ${
            animationStates.achievements 
              ? 'blur-0 opacity-100 translate-y-0' 
              : 'blur-md opacity-0 translate-y-4'
          }`}
        >
          <h3 className="text-sm xs:text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1">
            ACHIEVEMENTS
          </h3>
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-2.5">
            {achievementsData.map((achievement) => (
              <Card
                key={achievement.name}
                className={`border-slate-200 dark:border-slate-800 hover:border-lime-400 hover:shadow-md transition-all duration-300 ${
                  achievement.name === "Smart India Hackathon 2025 Winner" ? "sm:col-span-2" : ""
                }`}
              >
                <CardContent className="p-2 xs:p-2.5">
                  <div className="flex items-start gap-1.5 xs:gap-2">
                    {achievement.logo ? (
                      <img 
                        src={achievement.logo} 
                        alt={achievement.name} 
                        className="w-8 h-8 xs:w-10 xs:h-10 rounded-lg object-contain flex-shrink-0 bg-slate-100 dark:bg-slate-800 p-1"
                      />
                    ) : (
                      <div className="w-4 h-4 xs:w-5 xs:h-5 bg-lime-100 dark:bg-lime-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-2 h-2 xs:w-2.5 xs:h-2.5 text-lime-600 dark:text-lime-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm xs:text-base break-words">{achievement.name}</h4>
                      <p className="text-xs xs:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                        {achievement.issuer} • {achievement.year}
                      </p>
                      <p className="text-xs xs:text-sm text-slate-500 dark:text-slate-500 mt-0.5 break-words">{achievement.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* GitHub Contribution Graph Card (separate) */}
          <div className="mt-3 xs:mt-4">
            <Card className="border-slate-200 dark:border-slate-800 hover:border-lime-400 hover:shadow-md transition-all duration-300">
              <CardContent className="p-2 xs:p-4 flex flex-col items-center justify-center">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm xs:text-base mb-2 xs:mb-3">GitHub Contribution Graph</h4>
                <img
                  src="https://ghchart.rshah.org/altamsh04"
                  alt="GitHub Contribution Graph for altamsh04"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 shadow p-2 xs:p-4"
                  style={{ minHeight: '120px', minWidth: 0 }}
                  loading="lazy"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">@altamsh04</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Education */}
        <section 
          className={`space-y-2 xs:space-y-3 transition-all duration-1000 ease-out ${
            animationStates.education 
              ? 'blur-0 opacity-100 translate-y-0' 
              : 'blur-md opacity-0 translate-y-4'
          }`}
        >
          <h3 className="text-sm xs:text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1">
            EDUCATION
          </h3>
          <div className="space-y-1.5 xs:space-y-2.5">
            {educationData.education.map((edu) => (
              <Card
                key={edu.id}
                className="border-slate-200 dark:border-slate-800 hover:border-lime-400 hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-3 xs:p-4 sm:p-5">
                  <div className="space-y-2 xs:space-y-3">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 xs:gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm xs:text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 break-words">{edu.degree}</h4>
                        <p className="text-lime-600 dark:text-lime-400 font-medium text-xs xs:text-sm sm:text-base break-words">{edu.institution}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 xs:gap-1 sm:gap-2 text-xs xs:text-sm text-slate-500 dark:text-slate-400 mt-1">
                          <span>{edu.location}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>
                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs xs:text-sm self-start sm:self-auto">
                        {edu.gpa}
                      </Badge>
                    </div>
                    
                    {/* Honors */}
                    {edu.honors && (
                      <div className="flex flex-wrap gap-1 xs:gap-2">
                        {edu.honors.map((honor) => (
                          <Badge
                            key={honor}
                            className="bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-400 text-xs xs:text-sm hover:bg-lime-200 dark:hover:bg-lime-900/50 transition-colors"
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
      <footer 
        className={`bg-slate-900 dark:bg-slate-950 text-white mt-8 transition-all duration-1000 ease-out ${
          animationStates.footer 
            ? 'blur-0 opacity-100 translate-y-0' 
            : 'blur-md opacity-0 translate-y-4'
        }`}
      >
        <div className="max-w-4xl mx-auto px-2 xs:px-3 sm:px-4 py-4 xs:py-6">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
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
                  onClick={() => window.open("https://www.linkedin.com/in/altamsh04", "_blank")}
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
