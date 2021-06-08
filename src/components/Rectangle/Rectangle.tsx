import {Suspense} from 'react'
import {useRecoilState, atomFamily, atom} from 'recoil'
import {Drag} from '../Drag'
import {Resize} from '../Resize'
import {RectangleContainer} from './RectangleContainer'
import {RectangleLoading} from './RectangleLoading';
import {RectangleInner} from './RectangleInner'

export type ElementStyle = {
    position: {top: number; left: number}
    size: {width: number; height: number}
}

export type Element = {style: ElementStyle; image?: {id: number; src: string}}

export const defaultElement = {
    style: {
        position: {top: 0, left: 0},
        size: {width: 50, height: 50},
    },
}

export const elementStateFamily = atomFamily<Element, number>({
    key: 'element',
    default: defaultElement,
})

export const selectedElementState = atom<number | null>({
    key: 'selectedElement',
    default: null,
})

export const Rectangle = ({id}: {id: number}) => {
    const [selectedElement, setSelectedElement] = useRecoilState(selectedElementState)
    const [element, setElement] = useRecoilState(elementStateFamily(id))

    const selected = selectedElement === id

    return (
        <RectangleContainer
            position={element.style.position}
            size={element.style.size}
            onSelect={() => {
                setSelectedElement(id)
            }}
        >
            <Resize
                selected={selected}
                position={element.style.position}
                size={element.style.size}
                onResize={(style) =>
                    setElement((prevElement) => ({
                        ...prevElement,
                        style,
                    }))
                }
                keepAspectRatio={element.image !== undefined}
            >
                <Drag
                    position={element.style.position}
                    onDrag={(position) => {
                        setElement((prevElement) => ({
                            ...prevElement,
                            style: {
                                ...element.style,
                                position,
                            },
                        }))
                    }}
                >
                    <div>
                        <Suspense fallback={<RectangleLoading selected={selected} />}>
                            <RectangleInner selected={id === selectedElement} id={id} />
                        </Suspense>
                    </div>
                </Drag>
            </Resize>
        </RectangleContainer>
    )
}
