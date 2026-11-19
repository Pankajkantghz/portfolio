

import RecentPosts from '@/components/content/recent-posts'
import Intro from '@/components/home/intro'
import RecentProjects from '@/components/content/recent-projects'
import SkillsSection from '@/components/home/skills'
import ExperienceSection from '@/components/home/experience-section'
import ServicesSection from '@/components/home/service-section'
import ContactSection from '@/components/contact/contact-section'

export default function Home() {
  return (
    <section className='py-24'>
      <div className='container max-w-3xl'>
        <Intro />
        <ExperienceSection />
        <RecentProjects />
        <ServicesSection />
        <SkillsSection />
        <RecentPosts />
        <ContactSection />
      </div>
    </section>
  )
}
