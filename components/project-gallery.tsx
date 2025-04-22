"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X, Expand, ZoomIn, Info } from "lucide-react"

interface Project {
  id: string
  key: string // Key to look up translations in dictionary
  imagePath: string
  category: string // Added for potential categorization
}

interface ProjectGalleryProps {
  dict: {
    gallery: {
      title: string
      description: string
      viewDetails: string
      culturalContext: string
      loading?: string
      close?: string
      next?: string
      previous?: string
      id?: string
      artDescriptions: {
        [key: string]: string
      }
      culturalContexts: {
        [key: string]: string
      }
      categories?: {
        [key: string]: string
      }
      titles?: {
        [key: string]: string
      }
    }
  }
  lang: string
}

// Define the Moroccan art projects with image paths and dictionary keys
const moroccanArtProjects: Project[] = [
  {
    id: "1",
    key: "tborida",
    category: "traditional",
    imagePath: "/images/othmanotana_moroccan_tborida_show_a_festival_of_moroccans_rid_2e6b6e26-9a49-4959-a52e-81be4d1012ea_3.png"
  },
  {
    id: "2",
    key: "dress",
    category: "traditional",
    imagePath: "/images/othmanotana_mother_in_traditional_Moroccan_red_dress_dusted__du_f2e2555c-8669-4c47-a650-b8f98478ccd0.png"
  },
  {
    id: "3",
    key: "tiles",
    category: "patterns",
    imagePath: "/images/othmanotana_Traditional_geometric_Moroccan_tile_patterns_in_v_3c96ff30-f618-4b48-a09e-3f9fdd57672d_0.png"
  },
  {
    id: "4",
    key: "astrology",
    category: "patterns",
    imagePath: "/images/othmanotana_astrology_pattern_beautiful_midevil_arabian_tile__4828e34d-87a2-407d-991b-87a35a7e8e62_2.png"
  },
  {
    id: "5",
    key: "bicycle",
    category: "people",
    imagePath: "/images/othmanotana_Photo_of_two_Moroccan_boys_playing_with_one_bicycle_17741675-8699-4286-b810-1b6145f6d6c5.png"
  },
  {
    id: "6",
    key: "fakhar",
    category: "traditional",
    imagePath: "/images/othmanotana_A_traditional_Moroccan_fakhar_craftsman_working_on__73564925-59a7-458a-91e3-8a72619ea8dc.png"
  },
  {
    id: "7",
    key: "loom",
    category: "traditional",
    imagePath: "/images/othmanotana_A_traditional_Moroccan_loom_stands_in_the_center_of_2b10046b-3040-4556-bbb4-3d3e98eb2a95.png"
  },
  {
    id: "8",
    key: "child",
    category: "people",
    imagePath: "/images/othmanotana_A_middle-aged_child_holding_a_ball_in_his_hand_next_1f2d3b85-7f41-4334-9e3d-9295339acb47.png"
  },
  {
    id: "9",
    key: "cat",
    category: "architecture",
    imagePath: "/images/othmanotana_A_cat_sitting_on_the_steps_of_an_ancient_blue_city.png"
  },
  {
    id: "10",
    key: "woodworker",
    category: "traditional",
    imagePath: "/images/Wood Worker.jpg"
  },
  {
    id: "11",
    key: "jemaa",
    category: "people",
    imagePath: "/images/A man I jamaa lafnaa.jpg"
  },
  {
    id: "12",
    key: "tannery",
    category: "traditional",
    imagePath: "/images/Fes dar dbagha a man work there.png"
  },
  {
    id: "13",
    key: "regions",
    category: "people",
    imagePath: "/images/South_Morocco_meets_the_North_Morocco.png"
  },
  {
    id: "14",
    key: "architecture",
    category: "architecture",
    imagePath: "/images/Moroccan_Architecture.jpeg"
  },
  {
    id: "15",
    key: "fighter",
    category: "people",
    imagePath: "/images/Moroccan Woman Fighter.jpeg"
  },
  {
    id: "16",
    key: "amazigh",
    category: "people",
    imagePath: "/images/AnAMAZIGHWOMEN.jpeg"
  }
];

export default function ProjectGallery({ dict, lang }: ProjectGalleryProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [imageView, setImageView] = useState<"fit" | "fill">("fit");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get title function - fallback to key if no translation exists
  const getTitle = (project: Project) => {
    // Get title from dictionary, fallback to capitalizing the key
    return dict.gallery.titles?.[project.key] || project.key.charAt(0).toUpperCase() + project.key.slice(1);
  };

  // Get description for a project from dictionary
  const getDescription = (project: Project) => {
    return dict.gallery.artDescriptions[project.key] || `Description for ${project.key}`;
  };

  // Get cultural context for a project from dictionary
  const getCulturalContext = (project: Project) => {
    return dict.gallery.culturalContexts[project.key] || `Cultural context for ${project.key}`;
  };

  // Function to navigate to the previous project
  const navigateToPrevious = () => {
    if (!selectedProject) return;
    const currentIndex = moroccanArtProjects.findIndex(p => p.id === selectedProject.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : moroccanArtProjects.length - 1;
    setSelectedProject(moroccanArtProjects[prevIndex]);
  };

  // Function to navigate to the next project
  const navigateToNext = () => {
    if (!selectedProject) return;
    const currentIndex = moroccanArtProjects.findIndex(p => p.id === selectedProject.id);
    const nextIndex = currentIndex < moroccanArtProjects.length - 1 ? currentIndex + 1 : 0;
    setSelectedProject(moroccanArtProjects[nextIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      
      if (e.key === "ArrowLeft") {
        navigateToPrevious();
      } else if (e.key === "ArrowRight") {
        navigateToNext();
      } else if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  // Toggle image view mode between fit and fill
  const toggleImageView = () => {
    setImageView(prev => prev === "fit" ? "fill" : "fit");
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {moroccanArtProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden group">
            <div className="h-64 bg-muted relative overflow-hidden">
              <Image
                src={project.imagePath}
                alt={getTitle(project)}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button 
                  onClick={() => setSelectedProject(project)} 
                  variant="outline" 
                  className="bg-black/40 border-white text-white hover:bg-black/60"
                >
                  {dict.gallery.viewDetails || "View Details"}
                </Button>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-xl">{getTitle(project)}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground line-clamp-3">{getDescription(project)}</p>
            </CardContent>

            <CardFooter>
              <Button onClick={() => setSelectedProject(project)} variant="default" className="w-full">
                {dict.gallery.viewDetails || "View Details"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedProject} onOpenChange={(open) => {
        if (!open) setSelectedProject(null);
        setImageView("fit"); // Reset view mode when dialog closes
      }}>
        {selectedProject && (
          <DialogContent className={`max-w-5xl p-0 overflow-hidden ${isFullscreen ? 'h-screen w-screen max-h-screen' : 'max-h-[90vh]'}`}>
            <div className="relative flex flex-col h-full">
              {/* Image carousel area */}
              <div className="relative flex-grow bg-black">
                {/* Main image display */}
                <div className="relative w-full h-full min-h-[300px] md:min-h-[400px]">
                  <Image
                    src={selectedProject.imagePath}
                    alt={getTitle(selectedProject)}
                    fill
                    className={`duration-300 transition-all ${imageView === "fit" ? "object-contain" : "object-cover"}`}
                    sizes="(max-width: 768px) 100vw, 80vw"
                    priority
                  />
                  
                  {/* Category badge overlay */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 bg-primary/80 text-primary-foreground rounded-full text-sm font-medium backdrop-blur-sm">
                      {dict.gallery.categories?.[selectedProject.category] || selectedProject.category}
                    </span>
                  </div>
                  
                  {/* Image controls */}
                  <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full w-8 h-8"
                      onClick={toggleImageView}
                    >
                      <ZoomIn size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full w-8 h-8"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      <Expand size={16} />
                    </Button>
                  </div>
                  
                  {/* Carousel navigation */}
                  <button 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-all"
                    onClick={navigateToPrevious}
                  >
                    <ChevronLeft />
                  </button>
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-all"
                    onClick={navigateToNext}
                  >
                    <ChevronRight />
                  </button>
                  
                  {/* Close button */}
                  <button 
                    className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-all"
                    onClick={() => setSelectedProject(null)}
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* Thumbnail slider - can be implemented here */}
              </div>
              
              {/* Project info area - only show when not in fullscreen */}
              {!isFullscreen && (
                <div className="bg-background p-6 max-h-[40vh] overflow-y-auto">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-1">{getTitle(selectedProject)}</h2>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center">
                        <Info size={14} className="mr-1" /> 
                        {dict.gallery.id || "ID"}: {selectedProject.id}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{dict.gallery.description || "Description"}</h3>
                      <p className="text-muted-foreground">{getDescription(selectedProject)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{dict.gallery.culturalContext || "Cultural Context"}</h3>
                      <p className="text-muted-foreground">{getCulturalContext(selectedProject)}</p>
                    </div>
                  </div>
                  
                  {/* Project navigation controls */}
                  <div className="mt-6 flex justify-between items-center pt-4 border-t">
                    <Button 
                      variant="outline"
                      onClick={navigateToPrevious}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft size={16} /> {dict.gallery.previous || "Previous"}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={navigateToNext}
                      className="flex items-center gap-2"
                    >
                      {dict.gallery.next || "Next"} <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
