export default function SectionHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="font-mono text-sm text-accent">{number}</span>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground whitespace-nowrap">
        {title}
      </h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
