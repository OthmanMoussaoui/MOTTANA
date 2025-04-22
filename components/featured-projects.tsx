"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Eye } from "lucide-react"
import { motion } from "framer-motion"

interface Project {
  id: string
  title: string
  description: string
  category: string
  technologies: string[]
  culturalContext: string
}

interface FeaturedProjectsProps {
  dict: {
    home: {
      featured: {
        title: string
        viewAll: string
      }
    }
    projects: Project[]
  }
  lang: string
}

// Function to get the appropriate image for each project
const getProjectImage = (projectId: string): string => {
  const imageMap: Record<string, string> = {
    "1": "/images/othmanotana_Traditional_geometric_Moroccan_tile_patterns_in_v_3c96ff30-f618-4b48-a09e-3f9fdd57672d_0.png", // Zellige Pattern
    "2": "/images/othmanotana_A_traditional_Moroccan_loom_stands_in_the_center_of_2b10046b-3040-4556-bbb4-3d3e98eb2a95.png", // Textile
    "3": "/images/A man I jamaa lafnaa.jpg", // Darija
    "4": "/images/Moroccan_Architecture.jpeg" // Architecture
  };
  
  return imageMap[projectId] || "/images/othmanotana_moroccan_tborida_show_a_festival_of_moroccans_rid_2e6b6e26-9a49-4959-a52e-81be4d1012ea_3.png";
};

export default function FeaturedProjects({ dict, lang }: FeaturedProjectsProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  // Only show 3 featured projects on the home page
  const featuredProjects = dict.projects.slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-gradient-primary">{dict.home.featured.title}</h2>
        <div className="w-24 h-1 mx-auto bg-gradient-to-r from-moroccan-blue via-moroccan-terracotta to-moroccan-yellow"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card
              className={`overflow-hidden transition-all duration-300 border-none ${
                hoveredProject === project.id ? "transform scale-105" : ""
              } glass-card`}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="h-48 bg-muted relative overflow-hidden group">
                <Image
                  src={getProjectImage(project.id)}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <Eye className="text-white w-6 h-6" />
                </div>
              </div>

              <CardHeader className="relative">
                <div className="absolute -top-5 left-4 bg-gradient-to-r from-moroccan-terracotta to-moroccan-yellow px-3 py-1 rounded-full">
                  <Badge variant="outline" className="border-0 text-white">
                    {project.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-2">{project.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{project.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-accent/20 rounded-full">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Link href={`/${lang}/gallery`} className="w-full">
                  <Button variant="outline" className="w-full group hover:border-moroccan-blue">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Link href={`/${lang}/gallery`}>
          <Button
            variant="default"
            className="bg-gradient-to-r from-moroccan-blue to-moroccan-terracotta hover:from-moroccan-terracotta hover:to-moroccan-blue"
          >
            {dict.home.featured.viewAll}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
