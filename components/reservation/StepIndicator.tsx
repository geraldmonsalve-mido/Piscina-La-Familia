interface StepIndicatorProps {
  steps: string[];
  current: number;
}

export default function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="relative">
      {/* Line */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 mx-8 hidden sm:block">
        <div
          className="h-full bg-pool-500 transition-all duration-500"
          style={{ width: `${(current / (steps.length - 1)) * 100}%` }}
        />
      </div>

      <ol className="relative flex items-center justify-between">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;

          return (
            <li key={label} className="flex flex-col items-center gap-2">
              <div
                className={[
                  "size-8 rounded-full flex items-center justify-center text-sm font-semibold z-10",
                  "transition-all duration-300",
                  done
                    ? "bg-pool-600 text-white"
                    : active
                    ? "bg-pool-600 text-white ring-4 ring-pool-100"
                    : "bg-white border-2 border-slate-300 text-slate-400",
                ].join(" ")}
              >
                {done ? (
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={[
                  "text-xs font-medium hidden sm:block",
                  active ? "text-pool-700" : done ? "text-slate-500" : "text-slate-400",
                ].join(" ")}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
