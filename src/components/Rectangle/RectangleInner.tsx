import {Box} from '@chakra-ui/react'
import {useEffect} from 'react'
import {selectorFamily, useRecoilState, useRecoilValue} from 'recoil'
import {getBorderColor, getImageDimensions} from '../../util'
import {elementStateFamily} from './Rectangle'

const imageSizeState = selectorFamily({
    key: 'imageSize',
    get: (src?: string) => async () => {
        if (src === undefined) return
        const imageSize = await getImageDimensions(src)
        return imageSize
    },
})

export const RectangleInner = ({selected, id}: {selected: boolean; id: number}) => {
    const [element, setElement] = useRecoilState(elementStateFamily(id))
    const imageSize = useRecoilValue(imageSizeState(element.image?.src))

    useEffect(() => {
        if (!imageSize) return

        setElement((prevElement) => ({
            ...prevElement,
            style: {
                ...prevElement.style,
                size: imageSize,
            },
        }))
    }, [imageSize])

    return (
        <Box
            position="absolute"
            border={`1px solid ${getBorderColor(selected)}`}
            transition="0.1s border-color ease-in-out"
            width="100%"
            height="100%"
            display="flex"
            padding="2px"
        >
            <Box
                flex="1"
                border="3px dashed #101010"
                borderRadius="255px 15px 225px 15px/15px 225px 15px 255px"
                backgroundColor="white"
                backgroundImage={`url('${element.image?.src}')`}
                backgroundSize="cover"
            />
        </Box>
    )
}
