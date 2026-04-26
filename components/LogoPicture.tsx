interface LogoPictureProps {
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

export default function LogoPicture({ className, imgClassName, priority }: LogoPictureProps) {
  return (
    <picture className={className}>
      <source srcSet="/legoro-logo-400.avif" type="image/avif" />
      <source srcSet="/legoro-logo-400.webp" type="image/webp" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/LEGORO LOGO NO Background .png"
        alt="LEGORO Logo"
        className={imgClassName}
        width="400"
        height="289"
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
      />
    </picture>
  );
}
