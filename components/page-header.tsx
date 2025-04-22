"use client"

export default function PageHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-12 text-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">{title}</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{description}</p>
    </div>
  )
}
