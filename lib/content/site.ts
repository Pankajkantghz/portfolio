export type ServiceIconName = 'Globe' | 'Database' | 'Code2' | 'Wrench' | 'Zap' | 'Plug'

export type SiteContent = {
  header: {
    brand: string
    links: { label: string; href: string; external?: boolean }[]
  }
  profile: {
    heading: string
    description: string
    photo: string
    photoAlt: string
    primaryActionLabel: string
    primaryActionHref: string
    secondaryActionLabel: string
    secondaryActionHref: string
  }
  experience: {
    title: string
    description: string
    items: { role: string; company: string; duration: string; points: string[] }[]
  }
  services: {
    title: string
    pageTitle: string
    description: string
    items: { title: string; description: string; icon: ServiceIconName }[]
  }
  home: {
    skillsTitle: string
    skillsDescription: string
    recentProjectsTitle: string
    recentPostsTitle: string
    recentCount: number
  }
  contact: {
    homeHeading: string
    homeDescription: string
    actionLabel: string
    actionHref: string
    email: string
    availability: string
    pageHeading: string
  }
  social: {
    github: string
    linkedin: string
    codeforces: string
    leetcode: string
    geeksforgeeks: string
  }
  footer: {
    copyrightName: string
  }
}
