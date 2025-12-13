import { type FC, Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '@/components/Dropdown';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconEye from '@/components/Icon/IconEye';
import IconMail from '@/components/Icon/IconMail';
import IconLockDots from '@/components/Icon/IconLockDots';

import useViewModel from './ViewModel';
import { clsx } from '@mantine/core';
import OTPField from '@/pages/Components/OTPInput';

const ForgotPassword: FC = () => {
    const {
        currentLanguage,
        t,
        languageList,
        changeLanguage,
        isSubmitting,
        showPassword,
        showConfirmPassword,
        setShowPassword,
        setShowConfirmPassword,
        otp,
        setOtp,
        onVerifyOtp,
        formState,
        formError,
        onChangeFormState,
        onSubmit,
        step,
        onSubmitChangePassword,
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

                    {step === 'form' && (
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <img src="/assets/meelike/auth/ForgotPassword.svg" alt="logo" className="w-48 mx-auto mb-10" />
                                <h1 className="text-3xl font-extrabold !leading-snug text-mls-black md:text-4xl text-center mb-5">{t('auth.forgotPassword.title')}</h1>
                                <p className="text-base font-bold leading-normal text-white-dark text-center">{t('auth.forgotPassword.subheader')}</p>
                            </div>
                            <div className="mb-5">
                                <div className="relative text-white-dark">
                                    <input
                                        id="Email"
                                        type="email"
                                        placeholder={t('auth.forgotPassword.email')}
                                        className="form-input ps-10 placeholder:text-white-dark"
                                        value={formState.email}
                                        onChange={(e) => onChangeFormState('email', e.target.value)}
                                    />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconMail fill={true} />
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className={clsx('btn border-none shadow-none py-2 px-10 hover:opacity-80 active:opacity-40 w-full text-meelike-dark font-bold', {
                                    'cursor-not-allowed': isSubmitting,
                                })}
                                disabled={isSubmitting}
                                onClick={onSubmit}
                                style={{ background: 'linear-gradient(90deg, #FFE8BA 0%, #FFD77F 100%)' }}
                            >
                                {isSubmitting ? (
                                    <span className="animate-spin border-4 border-white border-l-transparent rounded-full w-5 h-5 inline-block align-middle"></span>
                                ) : (
                                    t('auth.forgotPassword.recover')
                                )}
                            </button>
                        </div>
                    )}

                    {step === 'otp' && (
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <img src="/assets/meelike/auth/ForgotPassword.svg" alt="logo" className="w-48 mx-auto mb-10" />
                                <h1 className="text-3xl font-extrabold !leading-snug text-mls-black md:text-4xl text-center mb-5">{t('auth.forgotPassword.otpHeader')}</h1>
                                <p className="text-base font-bold leading-normal text-white-dark text-center capitalize">{t('auth.forgotPassword.otpSubheader')}</p>
                            </div>
                            <div className="mb-5 flex justify-center gap-2">
                                <OTPField length={6} inputs={otp} setInputs={setOtp} />
                            </div>
                            <button
                                type="button"
                                className={clsx('btn border-none shadow-none py-2 px-10 hover:opacity-80 active:opacity-40 w-full text-meelike-dark font-bold', {
                                    'cursor-not-allowed': isSubmitting,
                                })}
                                disabled={isSubmitting}
                                onClick={onVerifyOtp}
                                style={{ background: 'linear-gradient(90deg, #FFE8BA 0%, #FFD77F 100%)' }}
                            >
                                {isSubmitting ? (
                                    <span className="animate-spin border-4 border-white border-l-transparent rounded-full w-5 h-5 inline-block align-middle"></span>
                                ) : (
                                    t('auth.forgotPassword.verifyOtp')
                                )}
                            </button>
                        </div>
                    )}

                    {step === 'change-password' && (
                        <Fragment>
                            <div className="mx-auto w-full max-w-[440px]">
                                <div className="mb-10">
                                    <h1 className="text-3xl font-extrabold !leading-snug text-mls-black md:text-4xl text-center mb-5">{t('auth.forgotPassword.changePasswordHeader')}</h1>
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="Password">{t('auth.signup.password')}</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder={t('auth.signup.passwordPlaceholder')}
                                            className={clsx('form-input ps-10 placeholder:text-white-dark', {
                                                'border-red-500': formError.password,
                                            })}
                                            autoComplete="off"
                                            name="password"
                                            value={formState.password}
                                            onChange={(e) => onChangeFormState('password', e.target.value)}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                        <span className="absolute end-2 top-1/2 -translate-y-1/2">
                                            <button
                                                type="button"
                                                className="btn bg-none border-0 shadow-none px-2 py-1 hover:bg-white-light transition-all"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <IconEye fill={true} />
                                            </button>
                                        </span>
                                    </div>
                                    {formError.password && <div className="text-red-500 text-sm mt-2">{formError.password}</div>}
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="ConfirmPassword">{t('auth.signup.confirmPassword')}</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="ConfirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                                            className={clsx('form-input ps-10 placeholder:text-white-dark', {
                                                'border-red-500': formError.confirmPassword,
                                            })}
                                            autoComplete="off"
                                            name="confirmPassword"
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
                                    {formError.confirmPassword && <div className="text-red-500 text-sm mt-2">{formError.confirmPassword}</div>}
                                </div>
                                <button
                                    type="button"
                                    className={clsx('btn border-none shadow-none py-2 px-10 hover:opacity-80 active:opacity-40 w-full text-meelike-dark font-bold', {
                                        'cursor-not-allowed': isSubmitting,
                                    })}
                                    disabled={isSubmitting}
                                    onClick={onSubmitChangePassword}
                                    style={{ background: 'linear-gradient(90deg, #FFE8BA 0%, #FFD77F 100%)' }}
                                >
                                    {isSubmitting ? (
                                        <span className="animate-spin border-4 border-white border-l-transparent rounded-full w-5 h-5 inline-block align-middle"></span>
                                    ) : (
                                        t('auth.forgotPassword.changePasswordCTA')
                                    )}
                                </button>
                            </div>
                        </Fragment>
                    )}

                    {step === 'completed' && (
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <img src="/assets/meelike/auth/ResetPasswordSuccess.svg" alt="logo" className="w-48 mx-auto mb-10" />
                                <h1 className="text-3xl font-extrabold !leading-snug text-mls-black md:text-4xl text-center mb-5">{t('auth.forgotPassword.successHeader')}</h1>
                                <p className="text-base font-bold leading-normal text-white-dark text-center capitalize">{t('auth.forgotPassword.successSubheader')}</p>
                            </div>
                            <Link to="/auth/signin">
                                <button
                                    type="button"
                                    className={'btn border-none text-meelike-dark-2 font-bold shadow-none py-2 px-10 hover:opacity-80 active:opacity-40 w-full'}
                                    style={{ background: 'linear-gradient(90deg, #FFE8BA 0%, #FFD77F 100%)' }}
                                >
                                    {t('auth.forgotPassword.backToLogin')}
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default ForgotPassword;
