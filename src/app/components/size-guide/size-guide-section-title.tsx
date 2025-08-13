
interface SizeGuideSectionTitleProps {
  title: string
  description?: string
}

export default function SizeGuideSectionTitle({ title, description }: SizeGuideSectionTitleProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">{title}</h2>
      {description && <p className="text-muted-foreground max-w-3xl">{description}</p>}
    </div>
  )
}
