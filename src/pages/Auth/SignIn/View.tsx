import { type FC, Fragment } from 'react';
import IconEye from '@/components/Icon/IconEye';
import IconMail from '@/components/Icon/IconMail';
import IconLockDots from '@/components/Icon/IconLockDots';

import useViewModel from './ViewModel';
import { clsx } from '@mantine/core';

const SignIn: FC = () => {
    const { isSubmitting, formState, formError, errorMessage, showPassword, setShowPassword, onChangeFormState, submitForm } = useViewModel();

    return (
        <Fragment>
            <div className="relative flex max-h-screen items-center bg-meelike-primary bg-center bg-no-repeat">
                {/* Form */}
                <div className="relative w-full bg-meelike-primary max-h-screen">
                    <div className="relative flex flex-col justify-center rounded-lg bg-meelike-white backdrop-blur-lg dark:bg-black/50 px-6 min-h-[758px] lg:h-screen">
                        <div className="mx-auto w-full max-w-[540px]">
                            <img src="/assets/meelike/logo/meelike-logo.png" alt="Main Logo" className="block lg:hidden h-36 lg:h-48 lg:mb-7 select-none pointer-events-none mx-auto" />
                            <div className="mb-10">
                                <div className="flex flex-row justify-center">
                                    <h1 className="text-3xl font-bold text-black mb-3 uppercase text-center">ยินดีต้อนรับสู่ MeeLike Admin</h1>
                                </div>

                                <p className="text-base font-semibold leading-normal text-black text-center">SMM Provider ที่ดีที่สุดในประเทศไทย</p>
                            </div>
                            <form className="dark:text-white bg-white rounded-lg shadow pt-6" onSubmit={submitForm}>
                                <div className="bg-meelike-secondary w-full h-[40px]">
                                    <img className="mx-auto h-[40px]" src="/assets/meelike/logo/meelike-logo.png" alt="Clinag Logo" />
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="text-center">
                                        <h2 className="text-xl font-bold text-meelike-primary">โปรดระบุผู้ใช้งาน</h2>
                                    </div>
                                    <div>
                                        <label htmlFor="Email">อีเมล</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="Email"
                                                type="email"
                                                placeholder={'กรอกอีเมลของคุณ'}
                                                className={clsx('form-input ps-10 placeholder:text-gray-400', {
                                                    'border-red-500': formError.email,
                                                })}
                                                autoComplete="off"
                                                name="email"
                                                value={formState.email}
                                                onChange={(e) => onChangeFormState('email', e.target.value)}
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconMail fill={true} />
                                            </span>
                                        </div>
                                        {formError.email && <div className="text-red-500 text-sm mt-2">{formError.email}</div>}
                                    </div>
                                    <div>
                                        <label htmlFor="Password">รหัสผ่าน</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="Password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder={'กรอกรหัสผ่านของคุณ'}
                                                className={clsx('form-input ps-10 placeholder:text-gray-400', {
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
                                    <div
                                        className={clsx('flex flex-row items-center', {
                                            'justify-between': Boolean(errorMessage),
                                            'justify-end': !Boolean(errorMessage),
                                        })}
                                    >
                                        {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
                                        {/* <Link to={paths.auth.forgotPassword}>
                                        <span className="text-black cursor-pointer hover:underline font-bold">{t('auth.signin.forgotPassword')}?</span>
                                    </Link> */}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={clsx('btn bg-meelike-primary text-meelike-dark font-bold !mt-6 w-full border-0 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]', {
                                            'disabled:cursor-not-allowed pointer-events-none': isSubmitting,
                                            'hover:opacity-80': !isSubmitting,
                                        })}
                                    >
                                        {isSubmitting ? 'กำลังลงชื่อเข้าใช้งาน...' : 'ลงชื่อเข้าใช้งาน'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default SignIn;
