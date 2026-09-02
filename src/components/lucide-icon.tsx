import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { Circle } from 'lucide-react';

/**
 * Resolve a lucide-react icon by its PascalCase name.
 * Falls back to a neutral `Circle` when the name is unknown so the UI never
 * breaks if a category row references an icon that doesn't exist.
 */
export function LucideIcon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Comp =
    ((LucideIcons as Record<string, React.ComponentType<LucideProps>>)[name] as
      | React.ComponentType<LucideProps>
      | undefined) ?? Circle;
  return <Comp {...props} />;
}
