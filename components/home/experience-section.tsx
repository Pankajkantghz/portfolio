import siteContent from '@/content/site.json'

export default function ExperienceSection() {
  return (
    <section className='pb-24'>
      <div className='mb-12'>
        <h2 className='title mb-4 font-mono'>{siteContent.experience.title}</h2>
        <p className='text-sm text-muted-foreground'>
          {siteContent.experience.description}
        </p>
      </div>

      <div className='space-y-4'>
        {siteContent.experience.items.map((exp, index) => (
          <div
            key={`${exp.role}-${exp.company}-${index}`}
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
              {exp.points.map((point, pointIndex) => (
                <li
                  key={`${exp.role}-${pointIndex}`}
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
