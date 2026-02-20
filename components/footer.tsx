const iconClass = 'transition-transform duration-200 group-hover:scale-110';

function RssIcon() {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={iconClass}
    >
      <circle cx='6.18' cy='17.82' r='2.18' fill='currentColor' />
      <path
        d='M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z'
        fill='currentColor'
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={iconClass}
    >
      <path
        d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
      className={iconClass}
    >
      <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z' />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
      className={iconClass}
    >
      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className='mb-16 animate-in-delay-3'>
      <ul className='font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300'>
        <li>
          <a
            className='group flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100'
            rel='noopener noreferrer'
            target='_blank'
            href='https://github.com/popring'
          >
            <GitHubIcon />
            <p className='ml-2 h-7'>github</p>
          </a>
        </li>
        <li>
          <a
            className='group flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100'
            rel='noopener noreferrer'
            target='_blank'
            href='https://x.com/Harry5Sea'
          >
            <XIcon />
            <p className='ml-2 h-7'>twitter</p>
          </a>
        </li>
        <li>
          <a
            className='group flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100'
            href='/links'
          >
            <LinkIcon />
            <p className='ml-2 h-7'>友链</p>
          </a>
        </li>
        <li>
          <a
            className='group flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100'
            href='/rss'
          >
            <RssIcon />
            <p className='ml-2 h-7'>rss</p>
          </a>
        </li>
      </ul>
      <p className='mt-8 text-neutral-600 dark:text-neutral-300'>
        © {new Date().getFullYear()}{' '}
        <a
          href='https://creativecommons.org/licenses/by-nc-sa/4.0/'
          target='_blank'
          rel='noopener noreferrer'
          className='underline decoration-neutral-400 dark:decoration-neutral-600 underline-offset-2 hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors'
        >
          CC BY-NC-SA 4.0
        </a>
      </p>
    </footer>
  );
}
