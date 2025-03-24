export interface Dictionary {
  navigation: {
    home: string;
    gallery: string;
    about: string;
    language: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
    };
    intro: {
      title: string;
      description: string;
    };
    featured: {
      title: string;
      viewAll: string;
    };
    explore: string;
    learnMore: string;
    featuredProjects: string;
    viewAll: string;
    contactUs: string;
  };
  gallery: {
    title: string;
    filters: {
      all: string;
      ai: string;
      culture: string;
      design: string;
    };
  };
  about: {
    title: string;
    vision: {
      title: string;
      description: string;
      content: string;
    };
    journey: {
      title: string;
      description: string;
    };
    team: {
      title: string;
      members: {
        name: string;
        role: string;
        bio: string;
      }[];
    };
    timeline?: {
      title: string;
      phases: {
        title: string;
        description: string;
      }[];
    };
  };
  footer: {
    rights: string;
    language: string;
    links?: {
      privacy: string;
      terms: string;
      copyright: string;
    };
    social?: {
      twitter: string;
      facebook: string;
      instagram: string;
    };
  };
} 