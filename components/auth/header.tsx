interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-foreground text-sm font-semibold text-background shadow-sm">
        A
      </div>
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Auth Kit
        </p>
        <p className="text-lg font-medium tracking-tight text-foreground">
          {label}
        </p>
      </div>
    </div>
  );
};
