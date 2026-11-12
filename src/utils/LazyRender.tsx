import { Suspense, type CSSProperties, type ReactNode } from "react";
import { useOnceInView } from "@/hooks/useOnceInView";

export interface LazyRenderProps {
  children: ReactNode;
  minHeight?: CSSProperties["minHeight"];
  rootMargin?: string;
  threshold?: number;
  eager?: boolean;
  fallback?: ReactNode;
  className?: string;
  id?: string;
}

const LazyRender = ({
  children,
  minHeight = "60vh",
  rootMargin = "300px 0px",
  threshold = 0,
  eager = false,
  fallback,
  className,
  id,
}: LazyRenderProps) => {
  const { ref, hasEntered } = useOnceInView<HTMLDivElement>({
    rootMargin,
    threshold,
    eager,
  });

  const placeholder = fallback ?? (
    <div aria-hidden="true" style={{ minHeight }} />
  );

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={hasEntered ? undefined : { minHeight }}
    >
      {hasEntered ? (
        <Suspense fallback={placeholder}>{children}</Suspense>
      ) : null}
    </div>
  );
};

export default LazyRender;
