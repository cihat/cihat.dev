interface MapsProps {
  embedUrl: string;
  width?: string | number;
  height?: string | number;
  alt?: string; // Alternative text for accessibility
  title?: string; // Title for iframe (defaults to alt if provided)
}

export function Maps({ embedUrl, width = '600', height = '450', alt, title }: MapsProps) {
  const iframeTitle = title || alt || "Google Maps";
  
  return (
    <div className="maps-embed-container my-5">
      <div className="relative w-full overflow-hidden rounded-lg">
        <iframe
          src={embedUrl}
          width={width}
          height={height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={iframeTitle}
          aria-label={alt || iframeTitle}
          className="w-full"
        ></iframe>
      </div>
      {alt && (
        <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 italic">
          {alt}
        </p>
      )}
    </div>
  );
}

