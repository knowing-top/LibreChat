import { useLocalize } from '~/hooks';
import { BlinkAnimation } from './BlinkAnimation';
import { TStartupConfig } from 'librechat-data-provider';
import SocialLoginRender from './SocialLoginRender';
import { ThemeSelector } from '~/components/ui';
import Footer from './Footer';

const ErrorRender = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-16 flex justify-center">
    <div
      className="rounded-md border border-red-500 bg-red-500/10 px-3 py-2 text-sm text-gray-600 dark:text-gray-200"
      role="alert"
    >
      {children}
    </div>
  </div>
);

const DisplayError = ({
  startupConfigError,
  error,
  localize,
}: {
  startupConfigError: unknown | null | undefined;
  error: string | null;
  localize: (key: string) => string;
}) => {
  if (startupConfigError) {
    return <ErrorRender>{localize('com_auth_error_login_server')}</ErrorRender>;
  } else if (error === 'com_auth_error_invalid_reset_token') {
    return (
      <ErrorRender>
        {localize('com_auth_error_invalid_reset_token')}{' '}
        <a className="font-semibold text-green-600 hover:underline" href="/forgot-password">
          {localize('com_auth_click_here')}
        </a>{' '}
        {localize('com_auth_to_try_again')}
      </ErrorRender>
    );
  } else if (error) {
    return <ErrorRender>{localize(error)}</ErrorRender>;
  }
  return null;
};

function AuthLayout({
  children,
  header,
  isFetching,
  startupConfig,
  startupConfigError,
  pathname,
  error,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  isFetching: boolean;
  startupConfig: TStartupConfig | null | undefined;
  startupConfigError: unknown | null | undefined;
  pathname: string;
  error: string | null;
}) {
  const localize = useLocalize();

  return (
    <div className="relative flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <BlinkAnimation active={isFetching}>
        <div className="flex flex-grow w-full">
          <div className="hidden md:flex md:flex-1 items-center justify-center bg-cover">
            <img src="/assets/logo.svg" className="h-full w-full object-contain" alt="Logo" />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md px-6 py-4 overflow-hidden bg-white sm:rounded-lg dark:bg-gray-900">
              {!startupConfigError && !isFetching && (
                <h1
                  className="mb-4 text-center text-3xl font-semibold text-black dark:text-white"
                  style={{ userSelect: 'none' }}
                >
                  {header}
                </h1>
              )}
              <DisplayError startupConfigError={startupConfigError} error={error} localize={localize} />
              {children}
              {(pathname.includes('login') || pathname.includes('register')) && (
                <SocialLoginRender startupConfig={startupConfig} />
              )}
            </div>
          </div>
        </div>
      </BlinkAnimation>
      <div className="absolute bottom-0 left-0 md:m-4">
        <ThemeSelector />
      </div>
      <Footer startupConfig={startupConfig} />
    </div>
  );
}

export default AuthLayout;