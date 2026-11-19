export default function ExperienceSection() {
  const experiences = [
    {
      role: 'Software Developer',
      company: 'EklavyaSolution',
      duration: 'Oct 2024 – Jul 2026',
      points: [
        'Developed responsive interfaces with React, Next.js, Redux, and Tailwind CSS, including routing, dashboards, and authentication workflows; contributed to a 30% revenue increase.',
        'Designed and optimized REST APIs and CRUD operations with Node.js and Express, improving backend reliability and reducing application load times by 20%.',
        'Strengthened application security with rate limiting, domain filtering, input sanitization, encrypted communication, and secure error handling.',
      ],
    },
    {
      role: 'Software Development Intern',
      company: 'EklavyaSolution',
      duration: 'May 2024 – Oct 2024',
      points: [
        'Developed interactive, responsive UI components with React and Redux to improve user workflows and application usability.',
        'Integrated frontend features with backend services through REST APIs.',
        'Collaborated with senior engineers on application features and functionality.',
      ],
    },
  ]

  return (
    <section className='pb-24'>
      <div className='mb-12'>
        <h2 className='title mb-4 font-mono'>Experience</h2>
        <p className='text-sm text-muted-foreground'>
          Experience building responsive interfaces, reliable APIs, and secure
          web application features.
        </p>
      </div>

      <div className='space-y-4'>
        {experiences.map(exp => (
          <div
            key={exp.role}
            className='rounded-lg border border-border p-5'
          >
            {/* Header */}
            <div className='flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <h3 className='text-base font-semibold'>{exp.role}</h3>
                <p className='text-sm text-muted-foreground'>{exp.company}</p>
              </div>
              <span className='w-fit rounded-full border border-border px-3 py-1 text-xs text-muted-foreground'>
                {exp.duration}
              </span>
            </div>

            {/* Bullet points as simple list */}
            <ul className='mt-4 space-y-1.5'>
              {exp.points.map(point => (
                <li
                  key={point}
                  className='flex items-start gap-2 text-sm text-muted-foreground'
                >
                  <span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground' />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
