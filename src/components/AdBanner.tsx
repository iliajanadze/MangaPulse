import React from 'react';

interface AdBannerProps {
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const adHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '1eddf56bb67d3c71c68b913229ef9f07',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/1eddf56bb67d3c71c68b913229ef9f07/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <aside
      aria-label="Advertisement"
      className={`my-6 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-2 ${className}`}
    >
      <div className="mb-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
        რეკლამა / Sponsor
      </div>
      <div className="flex w-full items-center justify-center overflow-x-auto">
        <iframe
          title="Adsterra 728x90 Banner"
          width="728"
          height="90"
          scrolling="no"
          loading="lazy"
          className="max-w-[728px] border-0"
          srcDoc={adHtml}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation"
        />
      </div>
    </aside>
  );
};
