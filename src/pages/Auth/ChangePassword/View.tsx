import { type FC, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '@/components/Dropdown';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconEye from '@/components/Icon/IconEye';
import IconMail from '@/components/Icon/IconMail';
import IconLockDots from '@/components/Icon/IconLockDots';

import useViewModel from './ViewModel';
import { clsx } from '@mantine/core';

const ChangePassword: FC = () => {
    const {
        currentLanguage,
        t,
        languageList,
        changeLanguage,
        isSubmitting,
        step,
        formState,
        verificationCode,
        showPassword,
        showConfirmPassword,
        setShowPassword,
        setShowConfirmPassword,
        setVerificationCode,
        hasSentVerificationCode,
        hasSentVerificationCodeEmailFirstTime,
        countdownSendVerificationCode,
        onChangeFormState,
        onSubmit,
        onSendVerificationCode,
    } = useViewModel();

    return (
        <Fragment>
            {/* Navigation Bar */}
            <header className="z-40 sticky top-0">
                <div className="shadow-sm">
                    <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black justify-between">
                        <div className="horizontal-logo flex justify-between items-center ltr:mr-2 rtl:ml-2">
                            <Link to="/" className="main-logo flex items-center shrink-0">
                                <img className="w-14 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/meelike/logo/meelike-logo.png" alt="logo" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Form */}
            <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-5 sm:px-16 bg-[url('/assets/meelike/bg/yellow-gradient.png')]">
                <div
                    className="relative w-full max-w-[600px] flex flex-col justify-center rounded-lg bg-white/60 backdrop-blur-lg px-6 lg:min-h-[758px] py-20"
                    style={{
                        backdropFilter: 'blur(17px)',
                    }}
                >
                    <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                        <Link to="/" className="w-8 block lg:hidden">
                            <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto w-10" />
                        </Link>
                        <div className="dropdown ms-auto w-max">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`bottom-end`}
                                btnClassName="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
                                button={
                                    <>
                                        <div>
                                            <img src={`/assets/images/flags/${currentLanguage.toUpperCase()}.svg`} alt="image" className="h-5 w-5 rounded-full object-cover" />
                                        </div>
                                        <div className="text-base font-bold uppercase">{currentLanguage}</div>
                                        <span className="shrink-0">
                                            <IconCaretDown />
                                        </span>
                                    </>
                                }
                            >
                                <ul className="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px]">
                                    {languageList.map((item: any) => {
                                        return (
                                            <li key={item.code}>
                                                <button
                                                    type="button"
                                                    className={`flex w-full hover:text-primary rounded-lg ${currentLanguage === item.code ? 'bg-primary/10 text-primary' : ''}`}
                                                    onClick={() => {
                                                        changeLanguage(item.code);
                                                    }}
                                                >
                                                    <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="w-5 h-5 object-cover rounded-full" />
                                                    <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Dropdown>
                        </div>
                    </div>

                    {step === 'fill-in-password' && (
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <img src="/assets/meelike/auth/ChangePassword.svg" alt="logo" className="w-48 mx-auto mb-10" />
                                <h1 className="text-3xl font-extrabold !leading-snug text-meelike-dark md:text-4xl text-center mb-5">{t('auth.changePassword.header')}</h1>
                                <p className="text-base font-bold leading-normal text-white-dark text-center capitalize">{t('auth.changePassword.subheader')}</p>
                            </div>
                            <div className="mb-5">
                                <div className="relative text-white-dark">
                                    <input
                                        id="newPassword"
                                        type="newPassword"
                                        placeholder={t('auth.changePassword.newPassword')}
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        value={formState.newPassword}
                                        onChange={(e) => onChangeFormState('newPassword', e.target.value)}
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconLockDots fill={true} />
                                    </span>
                                    <span className="absolute end-2 top-1/2 -translate-y-1/2">
                                        <button type="button" className="btn bg-none border-0 shadow-none px-2 py-1 hover:bg-white-light transition-all" onClick={() => setShowPassword(!showPassword)}>
                                            <IconEye fill={true} />
                                        </button>
                                    </span>
                                </div>
                            </div>
                            <div className="mb-5">
                                <div className="relative text-white-dark">
                                    <input
                                        id="confirmPassword"
                                        type="confirmPassword"
                                        placeholder={t('auth.changePassword.confirmPassword')}
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        value={formState.confirmPassword}
                                        onChange={(e) => onChangeFormState('confirmPassword', e.target.value)}
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconLockDots fill={true} />
                                    </span>
                                    <span className="absolute end-2 top-1/2 -translate-y-1/2">
                                        <button
                                            type="button"
                                            className="btn bg-none border-0 shadow-none px-2 py-1 hover:bg-white-light transition-all"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <IconEye fill={true} />
                                        </button>
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className={clsx('btn border-none font-bold text-meelike-dark-2 py-2 px-10 hover:opacity-80 active:opacity-40 w-full shadow', {
                                    'cursor-not-allowed': isSubmitting,
                                })}
                                style={{ background: 'linear-gradient(90deg, #FFE8BA 0%, #FFD77F 100%)' }}
                                disabled={isSubmitting}
                                onClick={onSubmit}
                            >
                                {isSubmitting ? (
                                    <span className="animate-spin border-4 border-white border-l-transparent rounded-full w-5 h-5 inline-block align-middle"></span>
                                ) : (
                                    t('auth.changePassword.submit')
                                )}
                            </button>
                        </div>
                    )}

                    {step === 'completed' && (
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <img src="/assets/meelike/auth/PasswordSaved.svg" alt="logo" className="w-48 mx-auto mb-10" />
                                <h1 className="text-3xl font-extrabold !leading-snug text-meelike-dark md:text-4xl text-center mb-5">{t('auth.changePassword.successHeader')}</h1>
                                <p className="text-base font-bold leading-normal text-white-dark text-center capitalize">{t('auth.changePassword.successSubheader')}</p>
                            </div>
                            <Link to="/auth/signin">
                                <button
                                    type="button"
                                    className={'btn border-none text-meelik-dark-2 shadow py-2 px-10 hover:opacity-80 active:opacity-40 w-full'}
                                    style={{ background: 'linear-gradient(90deg, #FFE8BA 0%, #FFD77F 100%)' }}
                                >
                                    {t('auth.changePassword.backToLogin')}
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default ChangePassword;
