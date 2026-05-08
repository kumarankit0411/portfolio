export default function SkillBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-light">
      {name}
    </span>
  );
}
