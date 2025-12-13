import { clsx } from '@mantine/core';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';

const Dropdown = (props: any, forwardedRef: any) => {
    const [visibility, setVisibility] = useState<any>(false);

    const referenceRef = useRef<any>();
    const popperRef = useRef<any>();

    const { styles, attributes } = usePopper(referenceRef.current, popperRef.current, {
        placement: props.placement || 'bottom-end',
        strategy: props.strategy || 'fixed',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: props.offset ?? [0, 8]
                }
            },
            {
                name: 'preventOverflow',
                options: {
                    boundary: 'viewport' as any,
                    altAxis: true,
                    tether: true,
                    padding: 8
                }
            },
            {
                name: 'flip',
                options: {
                    fallbackPlacements: ['top-end', 'bottom-start', 'top-start']
                }
            },
            {
                name: 'computeStyles',
                options: {
                    gpuAcceleration: false
                }
            }
        ]
    });

    const handleDocumentClick = (event: any) => {
        if (referenceRef.current?.contains(event.target) || popperRef.current?.contains(event.target)) {
            return;
        }

        setVisibility(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleDocumentClick);
        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, []);

    useImperativeHandle(forwardedRef, () => ({
        close () {
            setVisibility(false);
        }
    }));

    return (
        <>
            <button ref={referenceRef} type='button' disabled={props.buttonDisabled} className={props.btnClassName} onClick={() => setVisibility(!visibility)}>
                {props.button}
            </button>

            {createPortal(
                <div ref={popperRef} style={styles.popper} {...attributes.popper} className='dropdown z-[100]' onClick={() => setVisibility(!visibility)}>
                    {visibility && props.children}
                </div>,
                referenceRef.current?.parentNode || document.body
            )}
        </>
    );
};

export default forwardRef(Dropdown);
