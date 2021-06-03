import {Box} from '@chakra-ui/react'
import {useEffect} from 'react'
import {selectorFamily, useRecoilValue, useSetRecoilState} from 'recoil'
import {getBorderColor, getImageDimensions} from '../../util'
import {elementStateFamily} from './Rectangle'
import {editPropertyState} from './../../EditProperties'

const imageSizeState = selectorFamily({
    key: 'imageSize',
    get: (src?: string) => async () => {
        if (src === undefined) return
        const imageSize = await getImageDimensions(src)
        return imageSize
    },
})

export const RectangleInner = ({selected, id}: {selected: boolean; id: number}) => {
    const element = useRecoilValue(elementStateFamily(id))
    const imageSize = useRecoilValue(imageSizeState(element.image?.src))
    const setElementSize = useSetRecoilState(editPropertyState({path: 'style.size', id}))

    useEffect(() => {
        if (!imageSize) return

        setElementSize(imageSize)
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
